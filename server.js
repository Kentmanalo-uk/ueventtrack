const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;
const net = require('net');
let PHP_PORT = 0; // chosen at runtime: a free port assigned by the OS
const phpHost = () => `127.0.0.1:${PHP_PORT}`;

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}
const BACKEND_DIR = path.join(__dirname, 'backend');

// ---------------------------------------------------------------------------
// 1. Generate Laravel .env from Node.js environment variables
// ---------------------------------------------------------------------------
function generateLaravelEnv() {
  const envPath = path.join(BACKEND_DIR, '.env');

  // If essential DB vars are set, generate .env from environment
  if (process.env.DB_DATABASE) {
    const lines = [
      `APP_NAME="${process.env.APP_NAME || 'U-EventTrack'}"`,
      `APP_ENV=production`,
      `APP_KEY=${process.env.APP_KEY || ''}`,
      `APP_DEBUG=false`,
      `APP_URL=${process.env.APP_URL || 'https://ueventtrack.online'}`,
      `APP_TIMEZONE=UTC`,
      ``,
      `DB_CONNECTION=${process.env.DB_CONNECTION || 'mysql'}`,
      `DB_HOST=${process.env.DB_HOST || '127.0.0.1'}`,
      `DB_PORT=${process.env.DB_PORT || '3306'}`,
      `DB_DATABASE=${process.env.DB_DATABASE}`,
      `DB_USERNAME=${process.env.DB_USERNAME || ''}`,
      `DB_PASSWORD=${process.env.DB_PASSWORD || ''}`,
      ``,
      `SESSION_DRIVER=${process.env.SESSION_DRIVER || 'database'}`,
      `SESSION_LIFETIME=120`,
      `SESSION_SECURE_COOKIE=true`,
      `SESSION_DOMAIN=${process.env.SESSION_DOMAIN || '.ueventtrack.online'}`,
      `SESSION_SAME_SITE=lax`,
      ``,
      `CACHE_STORE=database`,
      `QUEUE_CONNECTION=database`,
      `BROADCAST_CONNECTION=log`,
      `FILESYSTEM_DISK=local`,
      ``,
      `LOG_CHANNEL=stack`,
      `LOG_STACK=single`,
      `LOG_LEVEL=${process.env.LOG_LEVEL || 'error'}`,
      ``,
      `SANCTUM_STATEFUL_DOMAINS=${process.env.SANCTUM_STATEFUL_DOMAINS || 'ueventtrack.online'}`,
      `FRONTEND_URL=${process.env.FRONTEND_URL || 'https://ueventtrack.online'}`,
      ``,
      `MAIL_MAILER=log`,
      `MAIL_FROM_ADDRESS="${process.env.MAIL_FROM_ADDRESS || 'hello@ueventtrack.online'}"`,
      `MAIL_FROM_NAME="\${APP_NAME}"`,
      ``,
      `TRUSTED_PROXIES=*`,
      ``,
      `GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID || ''}`,
      `GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET || ''}`,
      `GOOGLE_REDIRECT_URI=${process.env.APP_URL || 'https://ueventtrack.online'}/api/auth/google/callback`,
    ];
    fs.writeFileSync(envPath, lines.join('\n') + '\n');
    console.log('[init] Laravel .env generated from environment variables');
  } else if (fs.existsSync(envPath)) {
    console.log('[init] Using existing Laravel .env');
  } else {
    console.warn('[init] WARNING: No DB_DATABASE env var and no .env file found. API will not work.');
  }
}

// ---------------------------------------------------------------------------
// 2. Start PHP built-in server for Laravel
// ---------------------------------------------------------------------------
let phpProcess = null;
let phpReady = false;
const phpLogs = []; // ring buffer of last 50 log lines
function pushLog(msg) {
  phpLogs.push({ t: new Date().toISOString(), msg });
  if (phpLogs.length > 50) phpLogs.shift();
}

async function startPhp() {
  try {
    PHP_PORT = await getFreePort();
  } catch (e) {
    pushLog('Could not find a free port: ' + e.message);
    return setTimeout(startPhp, 5000);
  }
  console.log(`[php] Starting Laravel on ${phpHost()}...`);
  pushLog('Starting php -S on port ' + PHP_PORT);

  // Quick boot test — check that PHP and Laravel load
  try {
    const { execSync } = require('child_process');
    const out = execSync('php artisan --version 2>&1', { cwd: BACKEND_DIR, timeout: 10000 }).toString().trim();
    pushLog('Boot test: ' + out);
    console.log(`[php] Boot test OK: ${out}`);
  } catch (e) {
    const errMsg = e.stdout ? e.stdout.toString() : e.message;
    pushLog('Boot test FAILED: ' + errMsg);
    console.error(`[php] Boot test FAILED: ${errMsg}`);
  }

  // Use PHP built-in server directly (not artisan serve, which needs proc_open).
  // The router script serves static files from public/ and routes the rest to Laravel.
  phpProcess = spawn('php', [
    '-S', phpHost(),
    'server-router.php'
  ], {
    cwd: BACKEND_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  phpProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) {
      console.log(`[php] ${msg}`);
      pushLog(msg);
    }
    if (msg.includes('started')) phpReady = true;
  });

  phpProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) {
      console.error(`[php] ${msg}`);
      pushLog('STDERR: ' + msg);
    }
  });

  phpProcess.on('error', (err) => {
    console.error(`[php] Failed to start PHP: ${err.message}`);
    pushLog('SPAWN ERROR: ' + err.message);
  });

  phpProcess.on('close', (code) => {
    phpReady = false;
    const msg = `Process exited with code ${code}. Restarting in 5s...`;
    console.error(`[php] ${msg}`);
    pushLog(msg);
    if (code !== null) {
      setTimeout(startPhp, 5000);
    }
  });

  // Mark ready after a short delay even if we didn't see the "started" message
  setTimeout(() => { phpReady = true; }, 2000);
}

// ---------------------------------------------------------------------------
// 3. Express setup
// ---------------------------------------------------------------------------
app.set('trust proxy', true);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    php: phpReady ? 'running' : 'starting',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint — shows PHP logs to diagnose startup issues
app.get('/debug/php-logs', (req, res) => {
  res.json({ phpReady, logs: phpLogs });
});


// Debug endpoint — probes the PHP server directly and lists listening sockets
app.get('/debug/probe', (req, res) => {
  const out = { phpPort: PHP_PORT, phpPid: phpProcess && phpProcess.pid, phpAlive: !!(phpProcess && phpProcess.exitCode === null) };
  const { exec } = require('child_process');
  const http = require('http');
  const tryGet = (host) => new Promise((resolve) => {
    const r = http.get({ host, port: PHP_PORT, path: '/', timeout: 3000 }, (resp) => {
      resp.resume();
      resolve(`HTTP ${resp.statusCode}`);
    });
    r.on('error', (e) => resolve('ERR ' + e.code + ' ' + e.message));
    r.on('timeout', () => { r.destroy(); resolve('TIMEOUT'); });
  });
  exec('(ss -ltnp 2>&1 || netstat -ltnp 2>&1) | head -40', (e, so, se) => {
    out.sockets = (so || se || (e && e.message) || '').split('\n');
    Promise.all([tryGet('127.0.0.1'), tryGet('localhost'), tryGet('::1')]).then(([a, b, c]) => {
      out.get127 = a; out.getLocalhost = b; out.getIPv6 = c;
      res.json(out);
    });
  });
});


app.get('/debug/env', (req, res) => {
  const { exec } = require('child_process');
  exec('which php php-cgi php-fpm lsphp 2>&1; echo ---; ls -l "$(which php)" 2>&1; echo ---; php -v 2>&1 | head -2; echo ---; php-cgi -v 2>&1 | head -2; echo ---; php -r "echo php_sapi_name(), PHP_EOL, ini_get(\'disable_functions\'), PHP_EOL;" 2>&1; echo ---; curl -s -m 3 -o /dev/null -w "shell-curl:%{http_code}" http://127.0.0.1:' + PHP_PORT + '/ 2>&1', { timeout: 15000 }, (e, so, se) => {
    res.type('text/plain').send((so || '') + (se || '') + (e ? '\nexec error: ' + e.message : ''));
  });
});

// Proxy /sanctum to Laravel (needed for CSRF cookies)
app.use('/sanctum', proxy(phpHost, {
  proxyReqPathResolver: (req) => '/sanctum' + req.url,
  proxyErrorHandler: (err, res) => {
    console.error('[proxy] Sanctum error:', err.message); pushLog('PROXY SANCTUM ERROR: ' + err.message);
    res.status(502).json({ error: 'Backend not ready', message: 'Laravel is still starting up.' });
  }
}));

// Proxy /api to Laravel
app.use('/api', proxy(phpHost, {
  proxyReqPathResolver: (req) => '/api' + req.url,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['X-Forwarded-For'] = srcReq.ip;
    proxyReqOpts.headers['X-Forwarded-Proto'] = srcReq.protocol;
    proxyReqOpts.headers['X-Forwarded-Host'] = srcReq.get('host');
    return proxyReqOpts;
  },
  proxyErrorHandler: (err, res) => {
    console.error('[proxy] API error:', err.message); pushLog('PROXY API ERROR: ' + err.message + ' (target ' + phpHost() + ')');
    res.status(502).json({
      error: 'Backend API Error',
      message: phpReady
        ? 'Laravel returned an error. Check runtime logs.'
        : 'Laravel is still starting up. Try again in a few seconds.'
    });
  }
}));

// Proxy /storage to Laravel (uploaded files, barcodes, etc.)
app.use('/storage', proxy(phpHost, {
  proxyReqPathResolver: (req) => '/storage' + req.url,
  proxyErrorHandler: (err, res) => {
    res.status(502).json({ error: 'Storage not available' });
  }
}));

// Serve React frontend
const frontendPath = path.join(__dirname, 'build');
app.use(express.static(frontendPath, { maxAge: '1d', etag: true }));

// SPA fallback — serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send('Frontend not found. Build may have failed.');
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ---------------------------------------------------------------------------
// 4. Boot sequence
// ---------------------------------------------------------------------------
generateLaravelEnv();
startPhp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] U-EventTrack running on port ${PORT}`);
  console.log(`[server] Frontend: http://localhost:${PORT}`);
  console.log('[server] API proxy: /api -> local PHP server');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down...');
  if (phpProcess) phpProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  if (phpProcess) phpProcess.kill();
  process.exit(0);
});
