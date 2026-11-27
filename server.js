const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;
const LARAVEL_HOST = process.env.LARAVEL_HOST || 'localhost:8000';

// Trust proxy (required for Hostinger behind reverse proxy)
app.set('trust proxy', true);

// Log all requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'U-EventTrack',
    timestamp: new Date().toISOString()
  });
});

// Serve Laravel storage files (uploaded images, barcodes, etc.)
app.use('/storage', proxy(LARAVEL_HOST, {
  proxyReqPathResolver: (req) => {
    return '/storage' + req.url;
  }
}));

// Proxy all /api requests to Laravel backend
app.use('/api', proxy(LARAVEL_HOST, {
  proxyReqPathResolver: (req) => {
    const url = '/api' + req.url;
    console.log(`Proxying API: ${req.method} ${url}`);
    return url;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward original headers
    proxyReqOpts.headers['X-Forwarded-For'] = srcReq.ip;
    proxyReqOpts.headers['X-Forwarded-Proto'] = srcReq.protocol;
    proxyReqOpts.headers['X-Forwarded-Host'] = srcReq.get('host');
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    // Log API responses in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Response: ${userRes.statusCode} ${userReq.url}`);
    }
    return proxyResData;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Laravel API Proxy Error:', err.message);
    res.status(502).json({
      error: 'Backend API Error',
      message: 'The Laravel backend API is not responding.',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
  }
}));

// Serve React static files from build directory (output of vite build)
const frontendPath = path.join(__dirname, 'build');
app.use(express.static(frontendPath, {
  maxAge: '1d',
  etag: true
}));

// Serve React app for all other routes (SPA fallback)
// This must be LAST to allow API and storage routes to work
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving React app:', err);
      res.status(500).send('Frontend application not found. Please run "npm run build" first.');
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nU-EventTrack Server Started`);
  console.log(`Frontend:    http://localhost:${PORT}`);
  console.log(`API Proxy:   http://localhost:${PORT}/api -> http://${LARAVEL_HOST}/api`);
  console.log(`Health:      http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
