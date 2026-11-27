# 🚀 Hostinger Node.js Deployment Guide

## ✅ Configuration for Hostinger Node.js Interface

Use these **exact settings** when deploying via Hostinger's Node.js deployment interface:

---

## 📋 Build Settings

```
Framework preset: Other
Node version: 22.x
Root directory: ./
Build command: npm run build
Package manager: npm
Output directory: (leave empty)
Entry file: index.js
```

---

## 🔧 Environment Variables

Add these in the Hostinger Node.js environment variables section:

```env
PORT=3000
NODE_ENV=production
LARAVEL_HOST=localhost:8000
```

**Note**: Hostinger will automatically assign a PORT. The default 3000 will be overridden.

---

## 📁 What Gets Deployed

After GitHub deployment completes, your structure will be:

```
/home/u501626207/domains/ueventtrack.online/public_html/
├── frontend/
│   └── dist/          ← React build (created by npm run build)
├── backend/
│   ├── app/
│   ├── config/
│   ├── public/
│   └── .env           ← YOU MUST CREATE THIS!
├── server.js          ← Node.js Express server
├── index.js           ← Entry point
├── package.json
└── .env.production    ← Node.js environment template
```

---

## ⚙️ Post-Deployment Steps (SSH Required)

After Hostinger deploys from GitHub, you **MUST** do these steps via SSH:

### Step 1: SSH into Server

```bash
ssh u501626207@ueventtrack.online
```

### Step 2: Navigate to App Directory

```bash
cd /home/u501626207/domains/ueventtrack.online/public_html
```

### Step 3: Create Laravel .env File

```bash
cd backend
cp .env.production .env
```

### Step 4: Install Laravel Dependencies

```bash
composer install --optimize-autoloader --no-dev --no-scripts
```

### Step 5: Generate Application Key (if needed)

```bash
php artisan key:generate
```

### Step 6: Run Database Migrations

```bash
php artisan migrate --force
```

### Step 7: Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 8: Set Permissions

```bash
chmod -R 775 storage bootstrap/cache
```

### Step 9: Link Storage

```bash
php artisan storage:link
```

### Step 10: **CRITICAL** - Start Laravel Backend

```bash
# Start Laravel on port 8000 (required for Node.js proxy to work)
php artisan serve --host=127.0.0.1 --port=8000 &
```

**Keep this process running!** You may need to use `nohup` or `screen`:

**Option A: Using nohup (Recommended)**
```bash
nohup php artisan serve --host=127.0.0.1 --port=8000 > laravel.log 2>&1 &
```

**Option B: Using screen (if available)**
```bash
screen -S laravel
php artisan serve --host=127.0.0.1 --port=8000
# Press Ctrl+A then D to detach
```

---

## ✅ Verify Deployment

### Test URLs

1. **Frontend**: https://ueventtrack.online/
   - Should show: React login page

2. **Health Check**: https://ueventtrack.online/health
   - Should return: `{"status":"ok","service":"U-EventTrack",...}`

3. **API**: https://ueventtrack.online/api/announcements/public
   - Should return: JSON data

### Check if Laravel is Running

```bash
# Check if Laravel process is running
ps aux | grep "php artisan serve"

# Check Laravel logs
tail -f backend/storage/logs/laravel.log
```

---

## 🐛 Troubleshooting

### "connect ECONNREFUSED 127.0.0.1:8000"

**Problem**: Laravel backend is not running on port 8000

**Solution**:
```bash
cd /home/u501626207/domains/ueventtrack.online/public_html/backend
nohup php artisan serve --host=127.0.0.1 --port=8000 > laravel.log 2>&1 &
```

### Frontend Shows Blank Page

**Problem**: React build failed or missing

**Solution**:
```bash
cd /home/u501626207/domains/ueventtrack.online/public_html/frontend
npm ci
npm run build
```

Verify: `ls -la dist/index.html` should exist

### Database Connection Failed

**Problem**: .env file missing or wrong credentials

**Solution**:
```bash
cd /home/u501626207/domains/ueventtrack.online/public_html/backend
cp .env.production .env
nano .env  # Verify database credentials
php artisan config:clear
```

### Laravel Process Keeps Stopping

**Problem**: SSH disconnect kills the process

**Solutions**:

1. **Use nohup** (see Step 10 above)
2. **Use screen/tmux** if available
3. **Create a systemd service** (if you have server access)
4. **Ask Hostinger support** for persistent process management

---

## 📊 Database Configuration

Your database is configured in `backend/.env.production`:

```env
DB_CONNECTION=mysql
DB_HOST=srv1416.hstgr.io
DB_PORT=3306
DB_DATABASE=u501626207_eventtracker
DB_USERNAME=u501626207_kylemagsino
DB_PASSWORD=Kyle.kyle.27
```

This is automatically copied to `.env` in Step 3.

---

## 🔄 Update/Redeploy Process

When you push changes to GitHub and Hostinger auto-deploys:

1. **Node.js restarts automatically** ✅
2. **Laravel DOES NOT restart** ❌

**You must SSH in and restart Laravel**:

```bash
ssh u501626207@ueventtrack.online
cd /home/u501626207/domains/ueventtrack.online/public_html/backend

# Kill old Laravel process
pkill -f "php artisan serve"

# Start new Laravel process
nohup php artisan serve --host=127.0.0.1 --port=8000 > laravel.log 2>&1 &

# If code changes affect routes/config
php artisan config:clear
php artisan route:clear
php artisan config:cache
php artisan route:cache
```

---

## ⚠️ Known Limitations

This Node.js proxy architecture has these limitations on Hostinger:

1. **Laravel must run on port 8000** manually via SSH
2. **Laravel process may stop** when SSH disconnects
3. **Two processes to manage** (Node.js + Laravel)
4. **Port 8000 must be accessible** from Node.js (localhost only)
5. **Process management is manual** (no PM2 or systemd)

---

## 💡 Alternative: Consider VPS Hosting

If you need more control:
- Use a VPS with PM2 for process management
- Or use the Laravel-primary architecture (simpler, PHP-only)

For Laravel-primary architecture (no Node.js), see commit `e1a9117` or later.

---

## 📞 Support Checklist

If deployment fails, check these:

- [ ] Node.js app shows "Running" in Hostinger panel
- [ ] `frontend/dist/index.html` exists after build
- [ ] `backend/.env` file exists with correct database credentials
- [ ] Laravel backend is running: `ps aux | grep "php artisan serve"`
- [ ] Port 8000 is listening: `netstat -tuln | grep 8000`
- [ ] No errors in `backend/storage/logs/laravel.log`
- [ ] Composer dependencies installed: `backend/vendor/` directory exists

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ https://ueventtrack.online/ loads React login page  
✅ https://ueventtrack.online/health returns OK status  
✅ https://ueventtrack.online/api/announcements/public returns JSON  
✅ Login works and dashboard loads  
✅ Both Node.js and Laravel processes are running  

---

## 🔐 Security Notes

- ✅ Database password is in `.env.production` (included in repo for deployment)
- ✅ Actual `.env` file is in `.gitignore` (not committed)
- ⚠️ `.env.production` contains real credentials - keep repo private!
- ✅ `APP_DEBUG=false` in production
- ✅ `SESSION_SECURE_COOKIE=true` for HTTPS

---

**Last Updated**: November 2024  
**Architecture**: Node.js (Express) + Laravel (PHP)  
**Deployment Platform**: Hostinger Node.js Hosting  
**Node Version**: 22.x  
**PHP Version**: 8.2+
