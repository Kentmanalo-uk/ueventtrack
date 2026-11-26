# 🔧 Hostinger 403 Error - Troubleshooting Guide

## Current Issue: HTTP 403 Forbidden

Your site at https://ueventtrack.online/ is returning **403 Forbidden** because the Node.js application is not properly configured or not running.

---

## ✅ Quick Fix Checklist

### 1. Verify Files Are Uploaded

SSH into your Hostinger server and check these files exist:

```bash
ls -la /home/u123456789/domains/ueventtrack.online/public_html/

# You MUST have:
# ✓ index.js (entry point)
# ✓ server.js (Express server)
# ✓ package.json (with "main": "index.js")
# ✓ frontend/dist/index.html (built React app)
```

### 2. Check package.json Configuration

Your `package.json` MUST have:

```json
{
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

**Current Issue**: The `"main"` field might be missing!

### 3. Verify Node.js App Configuration in Hostinger Panel

Go to: **Advanced** → **Node.js**

**Required Settings:**
```
Application Name:    U-EventTrack
Node.js Version:     22 (or 18+)
Application Mode:    Production
Entry File:          index.js          ← CRITICAL!
Build Command:       npm run build
```

**Common Mistake**: Entry file set to `server.js` instead of `index.js`

### 4. Check if Frontend Was Built

```bash
# SSH into server
cd /home/u123456789/domains/ueventtrack.online/public_html/
ls -la frontend/dist/

# You MUST see:
# ✓ index.html
# ✓ assets/ folder with JS/CSS files
```

If `dist` folder is empty or missing:

```bash
npm run build
```

### 5. Verify Node.js App is Running

In Hostinger Panel:
1. Go to **Node.js**
2. Find your app
3. Check **Status**: Should be "Running"
4. If stopped, click **Restart**

Or via SSH:

```bash
# Check if Node process is running
ps aux | grep node

# Check port
netstat -tlnp | grep node
```

### 6. Check Application Logs

In Hostinger Panel → **Node.js** → **View Logs**

Look for errors like:
- ❌ "Cannot find module './server.js'"
- ❌ "ENOENT: no such file or directory"
- ❌ "Port already in use"

---

## 🔍 Detailed Diagnosis

### Test 1: Check if Node.js is Running

```bash
curl http://localhost:$PORT/health
```

**Expected**: `{"status":"ok","service":"U-EventTrack"}`
**If 404**: Node.js server is not running

### Test 2: Check if Frontend Files Exist

```bash
ls -la frontend/dist/index.html
```

**Expected**: File exists (~1 KB)
**If missing**: Run `npm run build`

### Test 3: Check server.js Configuration

```bash
cat server.js | grep "frontend/dist"
```

**Expected**: `path.join(__dirname, 'frontend', 'dist')`

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Cannot find module './server.js'"

**Cause**: `index.js` can't find `server.js`

**Solution**:
```bash
# Verify files are in the same directory
ls -la index.js server.js

# Both should be in the root directory
```

### Issue 2: Frontend Returns 404

**Cause**: `frontend/dist` folder doesn't exist or is empty

**Solution**:
```bash
# Build the frontend
cd /path/to/app
npm run build

# Verify output
ls -la frontend/dist/index.html
```

### Issue 3: "Port already in use"

**Cause**: Another process is using the port

**Solution**:
```bash
# Find and kill the process
lsof -ti:$PORT | xargs kill -9

# Restart Node.js app in Hostinger panel
```

### Issue 4: Permission Denied

**Cause**: File permissions are incorrect

**Solution**:
```bash
chmod 755 index.js server.js
chmod -R 755 frontend/dist
```

### Issue 5: Laravel Backend Not Running

**Cause**: Laravel needs to run on port 8000

**Solution**:
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000 &
```

Or use PM2:
```bash
pm2 start "php artisan serve --host=127.0.0.1 --port=8000" --name laravel-api
pm2 save
```

---

## 🚀 Step-by-Step Recovery Process

### Step 1: Stop Everything

In Hostinger Panel → Node.js → **Stop** the application

### Step 2: Verify Files

```bash
# SSH into server
cd /home/u123456789/domains/ueventtrack.online/public_html/

# Check critical files
ls -la index.js       # Must exist
ls -la server.js      # Must exist  
ls -la package.json   # Must have "main": "index.js"
ls -la frontend/dist/index.html  # Must exist
```

### Step 3: Update package.json

```bash
nano package.json
```

Ensure it has:
```json
{
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

Save and exit (Ctrl+X, Y, Enter)

### Step 4: Rebuild if Needed

```bash
# If frontend/dist is missing or empty
npm run build
```

### Step 5: Update Node.js App Configuration

In Hostinger Panel → Node.js → Edit Application:

```
Entry File: index.js
Build Command: npm run build
```

**Save** changes

### Step 6: Start Laravel Backend

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000 &
```

### Step 7: Restart Node.js App

In Hostinger Panel → Node.js → **Restart**

### Step 8: Test

```bash
# Test from server
curl http://localhost:$PORT/health

# Test from browser
https://ueventtrack.online/
```

---

## 📋 Hostinger-Specific Configuration

### Environment Variables

In Node.js app settings, add:

```
NODE_ENV=production
LARAVEL_HOST=localhost:8000
```

**Do NOT set PORT** - Hostinger assigns this automatically

### Directory Structure

Your app should look like:

```
/home/u123456789/domains/ueventtrack.online/public_html/
├── backend/
│   ├── app/
│   ├── public/
│   ├── .env              ← Must exist
│   └── artisan
├── frontend/
│   ├── dist/             ← Must exist after build
│   │   ├── index.html    ← Critical!
│   │   └── assets/
│   └── src/
├── node_modules/         ← Generated by npm install
├── index.js              ← Entry point (REQUIRED)
├── server.js             ← Express server
└── package.json          ← Must have "main": "index.js"
```

---

## 🔧 Manual Deployment Checklist

If Hostinger's build command fails:

```bash
# 1. SSH into server
ssh u123456789@ueventtrack.online

# 2. Navigate to app directory
cd domains/ueventtrack.online/public_html/

# 3. Install root dependencies
npm install

# 4. Install frontend dependencies
cd frontend
npm install

# 5. Build frontend
npm run build

# 6. Verify build output
ls -la dist/index.html  # Should exist

# 7. Go back to root
cd ..

# 8. Install Laravel dependencies
cd backend
composer install --optimize-autoloader --no-dev

# 9. Setup Laravel
cp .env.example .env
nano .env  # Edit database credentials
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# 10. Start Laravel
php artisan serve --host=127.0.0.1 --port=8000 &

# 11. Go back to root
cd ..

# 12. Start Node.js (via Hostinger panel)
# Or manually:
PORT=3000 node index.js
```

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ `https://ueventtrack.online/` shows React login page (not 403!)
2. ✅ `https://ueventtrack.online/health` returns `{"status":"ok"}`
3. ✅ Node.js app status shows "Running" in Hostinger panel
4. ✅ Browser console has no errors
5. ✅ Login works and shows dashboard

---

## 🆘 Still Not Working?

### Check These:

1. **Is the domain pointing to the right directory?**
   - Hostinger → Domains → Manage → Document Root
   - Should point to: `public_html` (not `public_html/frontend/dist`)

2. **Is SSL enabled?**
   - Hostinger → SSL/TLS → Enable

3. **Are there any .htaccess conflicts?**
   ```bash
   # Rename .htaccess if it exists
   mv .htaccess .htaccess.bak
   ```

4. **Check DNS propagation:**
   - Visit: https://dnschecker.org/
   - Enter: ueventtrack.online
   - Should show Hostinger's IP

### Get Logs:

```bash
# Node.js logs (via Hostinger panel)
# Or:
journalctl -u node --since "1 hour ago"

# Laravel logs
tail -f backend/storage/logs/laravel.log

# System logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

---

## 📞 Contact Support

If still stuck, provide this info to support:

```
Issue: 403 Forbidden on https://ueventtrack.online/
Node.js Version: 22
Entry File: index.js
Build Status: [Success/Failed]
App Status: [Running/Stopped]
Error Message: [From logs]

Files checked:
- index.js: [exists/missing]
- server.js: [exists/missing]  
- package.json "main": [present/missing]
- frontend/dist/index.html: [exists/missing]
```

---

## 🎉 After Fixing

Once working, test these URLs:

1. `https://ueventtrack.online/` → Login page
2. `https://ueventtrack.online/health` → `{"status":"ok"}`
3. `https://ueventtrack.online/api/health` → Laravel response
4. Login → Dashboard → Should load

**Deployment complete!** 🚀
