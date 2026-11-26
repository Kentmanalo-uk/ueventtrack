# 🚀 Hostinger Deployment Quick Checklist

## ✅ Pre-Deployment Verification

Before deploying to Hostinger, verify these files exist:

```bash
# Required entry files
✓ index.js              # Hostinger entry point
✓ server.js             # Express server
✓ package.json          # Root dependencies

# Required directories
✓ frontend/             # React source code
✓ backend/              # Laravel API

# Test build locally
npm run build

# Verify frontend build output
✓ frontend/dist/index.html exists
✓ frontend/dist/assets/ folder exists
```

## 📋 Hostinger Configuration

### Node.js Application Settings

```
Application Name:    U-EventTrack
Node.js Version:     22 (or latest LTS)
Application Mode:    Production
Build Command:       npm run build
Entry File:          index.js
Output Directory:    frontend/dist
```

### Port Configuration

The server will automatically use Hostinger's assigned port via `process.env.PORT`.

**DO NOT** hardcode port numbers.

## 🔧 Backend Setup (Laravel)

```bash
cd backend

# 1. Create .env file
cp .env.example .env
nano .env

# 2. Install dependencies
composer install --optimize-autoloader --no-dev

# 3. Generate key
php artisan key:generate

# 4. Run migrations
php artisan migrate --force

# 5. Cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Set permissions
chmod -R 755 storage bootstrap/cache

# 7. Start Laravel (must be on port 8000)
php artisan serve --host=127.0.0.1 --port=8000
```

## 🧪 Testing Checklist

After deployment, test these URLs:

| Endpoint | Expected Response | Status Code |
|----------|-------------------|-------------|
| `https://yourdomain.com` | React login page | 200 |
| `https://yourdomain.com/health` | `{"status":"ok"}` | 200 |
| `https://yourdomain.com/api/health` | Laravel API response | 200 |
| `https://yourdomain.com/dashboard` | React dashboard (after login) | 200 |
| `https://yourdomain.com/assets/index-[hash].js` | JavaScript file | 200 |

## 🔍 Common Issues & Solutions

### Issue: 403 Forbidden

```bash
# Check if index.js exists
ls -la index.js

# Check if frontend/dist/index.html exists
ls -la frontend/dist/index.html

# If missing, rebuild
npm run build
```

### Issue: API Errors (500/404)

```bash
# Verify Laravel is running on port 8000
curl http://localhost:8000/api/health

# Check Laravel logs
tail -f backend/storage/logs/laravel.log
```

### Issue: Blank Page

```bash
# Check browser console for errors
# Verify assets are built
ls -la frontend/dist/assets/

# Rebuild if needed
cd frontend && npm run build
```

## 📦 Files to Upload to Hostinger

**Upload these:**
- ✅ `index.js` (REQUIRED)
- ✅ `server.js` (REQUIRED)
- ✅ `package.json` (REQUIRED)
- ✅ `backend/` (entire folder)
- ✅ `frontend/` (entire folder including src/)

**Do NOT upload:**
- ❌ `node_modules/`
- ❌ `frontend/node_modules/`
- ❌ `frontend/dist/` (will be generated)
- ❌ `.env` files
- ❌ `.git/`

## ✨ Success Criteria

Your deployment is successful when:

1. ✅ Root URL (`/`) shows React login page (not 403)
2. ✅ `/health` returns JSON with `"status":"ok"`
3. ✅ Login works and redirects to dashboard
4. ✅ Browser console has no errors
5. ✅ API calls work without CORS issues
6. ✅ Static assets load correctly

## 🎯 Key Configuration Points

| Component | Configuration |
|-----------|---------------|
| **Entry File** | `index.js` (must exist in root) |
| **Server Binding** | `0.0.0.0` (binds to all interfaces) |
| **Port** | `process.env.PORT` (Hostinger assigns this) |
| **Frontend Path** | `frontend/dist` (served by Express) |
| **API Proxy** | `/api/*` → `http://localhost:8000/api/*` |
| **SPA Fallback** | All unmatched routes → `index.html` |

## 📄 Environment Variables (Optional)

If needed, add these in Hostinger Node.js settings:

```
NODE_ENV=production
LARAVEL_HOST=localhost:8000
```

## 🔄 Redeploy Command

To update your deployed application:

```bash
# Update code
git pull

# Rebuild
npm run build

# Update backend
cd backend && composer install --no-dev && php artisan config:cache

# Restart in Hostinger panel
```

---

**Need help?** Check `HOSTINGER_SETUP.md` for detailed instructions.
