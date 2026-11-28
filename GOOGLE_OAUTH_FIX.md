# Fix Google OAuth "invalid_client" Error

## Problem
Getting "Error 401: invalid_client - The OAuth client was not found"

## Solution: Create New OAuth 2.0 Client

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project or create a new one called "U-EventTrack"

### Step 2: Enable Google+ API (if not enabled)
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - **App name:** U-EventTrack
   - **User support email:** your-email@example.com
   - **Developer contact email:** your-email@example.com
4. Click **Save and Continue**
5. **Scopes:** Click **Add or Remove Scopes**
   - Select: `userinfo.email`
   - Select: `userinfo.profile`
   - Select: `openid`
6. Click **Save and Continue**
7. **Test users:** Add your Gmail account
8. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type:** Web application
4. **Name:** U-EventTrack Web Client

5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5173
   https://ueventtrack.online
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:5173
   https://ueventtrack.online
   https://auth.expo.io
   ```

7. Click **CREATE**

### Step 5: Copy the Client ID

After creating, you'll see:
- **Your Client ID:** `1234567890-xxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- **Your Client Secret:** `GOCSPX-xxxxxxxxxxxxxxxxxxxxxx`

**Copy the Client ID** (you'll need it in the next step)

### Step 6: Update Frontend Code

Open `d:\Ueventtrack\Ueventtrack_2\frontend\src\App.jsx`

Find this line (around line 37):
```javascript
const GOOGLE_CLIENT_ID = '698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4.apps.googleusercontent.com';
```

Replace it with your NEW Client ID:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_NEW_CLIENT_ID_HERE.apps.googleusercontent.com';
```

### Step 7: Update Mobile App (Optional)

If you also want to update the mobile app, edit:
`d:\Ueventtrack\Ueventtrack_2\USG_app\App.jsx`

Find this line (around line 643):
```javascript
clientId: '698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4.apps.googleusercontent.com',
```

Replace with your NEW Client ID.

### Step 8: Restart Development Server

```bash
cd d:\Ueventtrack\Ueventtrack_2\frontend
npm run dev
```

### Step 9: Test Google Sign-In

1. Go to http://localhost:3000 (or your dev port)
2. Click "Sign in with Google"
3. Should now work without errors!

## Quick Fix (If you have access to the original Google Cloud Project)

If you have access to the Google Cloud Console for the existing Client ID:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find the OAuth 2.0 Client ID: `698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4`
3. Click on it to edit
4. Add these **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5173
   ```
5. Add these **Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:5173
   ```
6. Click **Save**
7. Wait 5 minutes for changes to propagate
8. Try again

## Verification

After setup, you should be able to:
- ✅ Click "Sign in with Google" on the homepage
- ✅ See Google login popup
- ✅ Select your Google account
- ✅ Get redirected back to the app
- ✅ See your name and be logged in

## Still Having Issues?

### Error: "redirect_uri_mismatch"
- Make sure you added the EXACT URL including protocol (http:// or https://)
- No trailing slashes
- Port numbers must match (3000 or 5173)

### Error: "access_denied"
- User cancelled the login
- Check if app is in "Testing" mode and add your email as a test user

### Error: "invalid_client"
- Client ID doesn't exist or was deleted
- Create a new OAuth client following steps above

## Need Help?

Share:
1. Screenshot of Google Cloud Console → Credentials page
2. The error message you're seeing
3. What step you're stuck on
