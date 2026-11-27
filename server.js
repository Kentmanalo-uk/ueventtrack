const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_DIR = path.join(__dirname, 'backend');
const PUBLIC_DIR = path.join(BACKEND_DIR, 'public');

// ---------------------------------------------------------------------------
// 1. Generate Laravel .env from Node.js environment variables
// ---------------------------------------------------------------------------
function generateLaravelEnv() {
  const envPath = path.join(BACKEND_DIR, '.env');

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
      `DB_PASSWORD="${(process.env.DB_PASSWORD || '').replace(/(["\\$])/g, '\\$1')}"`,
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
// 2. PHP bridge: run Laravel through php-cgi, one process per request.
//    Hostinger disables proc_open (no `artisan serve`) and refuses loopback
//    connections to child servers (no `php -S` proxying), so we speak CGI
//    over stdin/stdout instead. No sockets are involved.
// ---------------------------------------------------------------------------
const phpLogs = []; // ring buffer of recent PHP-side problems
function pushLog(msg) {
  phpLogs.push({ t: new Date().toISOString(), msg: String(msg).slice(0, 2000) });
  if (phpLogs.length > 50) phpLogs.shift();
}

let lastPhpOk = null;

function runLaravel(req, res) {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('error', () => res.destroy());
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const hostHeader = req.headers.host || 'localhost';

    const env = {
      ...process.env,
      GATEWAY_INTERFACE: 'CGI/1.1',
      SERVER_PROTOCOL: 'HTTP/1.1',
      SERVER_SOFTWARE: 'node-cgi-bridge',
      REDIRECT_STATUS: '200', // required by php-cgi
      REQUEST_METHOD: req.method,
      REQUEST_URI: req.originalUrl,
      QUERY_STRING: req.originalUrl.includes('?') ? req.originalUrl.split('?').slice(1).join('?') : '',
      SCRIPT_FILENAME: path.join(PUBLIC_DIR, 'index.php'),
      SCRIPT_NAME: '/index.php',
      PHP_SELF: '/index.php',
      DOCUMENT_ROOT: PUBLIC_DIR,
      SERVER_NAME: hostHeader.split(':')[0],
      SERVER_PORT: secure ? '443' : String(PORT),
      REMOTE_ADDR: req.ip || '127.0.0.1',
      CONTENT_LENGTH: String(body.length),
      CONTENT_TYPE: req.headers['content-type'] || '',
    };
    if (secure) env.HTTPS = 'on';

    for (const [name, value] of Object.entries(req.headers)) {
      if (name === 'content-type' || name === 'content-length') continue;
      env['HTTP_' + name.toUpperCase().replace(/-/g, '_')] = Array.isArray(value) ? value.join(', ') : value;
    }

    const php = spawn('php-cgi', [], { cwd: PUBLIC_DIR, env, stdio: ['pipe', 'pipe', 'pipe'] });

    const out = [];
    let stderr = '';
    let finished = false;

    const fail = (message) => {
      if (finished) return;
      finished = true;
      pushLog(message);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Backend API Error', message: 'The PHP backend failed to handle the request.' });
      } else {
        res.end();
      }
    };

    const timer = setTimeout(() => {
      php.kill('SIGKILL');
      fail(`php-cgi timed out: ${req.method} ${req.originalUrl}`);
    }, 60000);

    php.on('error', (err) => { clearTimeout(timer); fail('Failed to spawn php-cgi: ' + err.message); });
    php.stdin.on('error', () => {}); // ignore EPIPE if PHP exits early
    php.stdout.on('data', (d) => out.push(d));
    php.stderr.on('data', (d) => { stderr += d.toString(); });

    php.on('close', (code) => {
      clearTimeout(timer);
      if (finished) return;
      const raw = Buffer.concat(out);

      // Split CGI headers from the body
      let sep = raw.indexOf('\r\n\r\n');
      let sepLen = 4;
      if (sep === -1) { sep = raw.indexOf('\n\n'); sepLen = 2; }
      if (sep === -1) {
        return fail(`php-cgi exit ${code}, no CGI headers. stderr: ${stderr.trim()} stdout: ${raw.toString('utf8', 0, 500)}`);
      }

      const headerLines = raw.toString('utf8', 0, sep).split(/\r?\n/);
      const payload = raw.subarray(sep + sepLen);
      let status = 200;
      const headers = {};
      for (const line of headerLines) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        const lower = key.toLowerCase();
        if (lower === 'status') {
          status = parseInt(val, 10) || 200;
        } else if (lower === 'set-cookie') {
          (headers['set-cookie'] = headers['set-cookie'] || []).push(val);
        } else {
          headers[lower] = val;
        }
      }
      delete headers['content-length'];
      delete headers['transfer-encoding'];

      if (status >= 500) {
        pushLog(`HTTP ${status} on ${req.method} ${req.originalUrl}. stderr: ${stderr.trim().slice(0, 500)} body: ${payload.toString('utf8', 0, 500)}`);
      }
      lastPhpOk = new Date().toISOString();

      finished = true;
      res.status(status);
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.setHeader('content-length', payload.length);
      res.end(payload);
    });

    php.stdin.end(body);
  });
}

// ---------------------------------------------------------------------------
// 3. Express setup
// ---------------------------------------------------------------------------
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', lastPhpOk, timestamp: new Date().toISOString() });
});

// Recent PHP-side errors (temporary diagnostic; remove once stable)
app.get('/debug/php-logs', (req, res) => {
  res.json({ lastPhpOk, logs: phpLogs });
});

// Laravel routes
app.use('/api', runLaravel);
app.use('/sanctum', runLaravel);

// Uploaded files (the public/storage symlink can't be created on this host)
app.use('/storage', express.static(path.join(BACKEND_DIR, 'storage', 'app', 'public'), { maxAge: '1d' }));

// React frontend
const frontendPath = path.join(__dirname, 'build');
app.use(express.static(frontendPath, { maxAge: '1d', etag: true }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) res.status(500).send('Frontend not found. Build may have failed.');
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ---------------------------------------------------------------------------
// 4. Boot
// ---------------------------------------------------------------------------
generateLaravelEnv();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] U-EventTrack running on port ${PORT}`);
});
