# ⚡ FIX 403 ERROR NOW - Quick Action Guide

## 🎯 Root Cause Identified

Your `package.json` is **missing** `"main": "index.js"` field!

The changes were just pushed to GitHub. Follow these steps:

---

## ✅ IMMEDIATE FIX (5 Minutes)

### Option 1: Update via GitHub (Recommended)

1. **Pull the latest changes** from GitHub to Hostinger:

```bash
# SSH into Hostinger
ssh your-user@ueventtrack.online

# Navigate to your app
cd domains/ueventtrack.online/public_html/

# Pull the fix
git pull origin main

# Restart the Node.js app in Hostinger panel
```

2. **Restart Node.js App**:
   - Go to Hostinger Panel → **Advanced** → **Node.js**
   - Find "U-EventTrack"
   - Click **Restart**

3. **Test**: Visit https://ueventtrack.online/

---

### Option 2: Manual Fix (If Git Doesn't Work)

1. **Edit package.json on the server**:

```bash
# SSH into Hostinger
cd domains/ueventtrack.online/public_html/

# Edit package.json
nano package.json
```

2. **Add this line** after `"description"`:

```json
{
  "name": "ueventtrack",
  "private": true,
  "description": "U-EventTrack: Laravel API backend and React frontend for Hostinger deployment",
  "main": "index.js",          ← ADD THIS LINE!
```

3. **Also change** the start script:

```json
"scripts": {
  "start": "node index.js",    ← CHANGE FROM "node server.js"
```

4. **Save** (Ctrl+X, Y, Enter)

5. **Restart** in Hostinger Panel

---

## 🔍 Verify Configuration

### Check 1: Entry File in Hostinger

Go to: **Node.js** → **Edit Application**

**Must be:**
```
Entry File: index.js
```

**NOT**: `server.js` or anything else!

### Check 2: Verify Files Exist

```bash
ls -la index.js        # Must exist
ls -la server.js       # Must exist
ls -la frontend/dist/index.html  # Must exist
```

If `frontend/dist/index.html` is missing:

```bash
npm run build
```

### Check 3: Verify Laravel Backend

```bash
cd backend

# Check if .env exists
ls -la .env

# If missing, create it
cp .env.example .env
nano .env  # Add database credentials

# Generate key
php artisan key:generate

# Start Laravel
php artisan serve --host=127.0.0.1 --port=8000 &
```

---

## 🎯 Expected Result

After fixing:

1. ✅ `https://ueventtrack.online/` → React login page (NOT 403!)
2. ✅ `https://ueventtrack.online/health` → `{"status":"ok"}`
3. ✅ Node.js status shows **Running**

---

## 🆘 Still 403? Check These:

### 1. Node.js App Status

Hostinger Panel → Node.js → Status should be **Running**

If **Stopped**:
- Check logs for errors
- Click **Restart**

### 2. Build Completed?

```bash
ls -la frontend/dist/

# Should have:
# - index.html
# - assets/ folder
```

If empty:
```bash
npm run build
```

### 3. Port Conflict?

```bash
# Check if port is in use
netstat -tlnp | grep node

# Kill if needed
killall -9 node

# Restart in panel
```

---

## 📞 Quick Support Info

If still stuck, check logs:

```bash
# View Node.js logs (in Hostinger panel)
# Or via SSH:
journalctl -u node --since "10 minutes ago"

# Check Laravel logs
tail -f backend/storage/logs/laravel.log
```

Common errors:
- ❌ "Cannot find module './server.js'" → `index.js` is wrong
- ❌ "ENOENT: no such file or directory" → Files not uploaded
- ❌ "Port already in use" → Kill the process

---

## ✨ Success Checklist

- [ ] Git pull completed (or manual edit done)
- [ ] `package.json` has `"main": "index.js"`
- [ ] Hostinger Entry File set to `index.js`
- [ ] Node.js app restarted
- [ ] `frontend/dist/index.html` exists
- [ ] Laravel backend running on port 8000
- [ ] Site shows React login page (not 403!)

---

**Once fixed, the site will be live! 🎉**

For detailed troubleshooting, see: `HOSTINGER_TROUBLESHOOTING.md`
