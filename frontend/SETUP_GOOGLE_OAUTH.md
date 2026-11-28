# Google OAuth Setup for U-EventTrack

## Current Status
❌ Google OAuth is not working because the Client ID needs to be configured

## What You Need to Do

### Option 1: Quick Test (Use Existing Client ID)
If someone else set up the Google Cloud project, ask them to:
1. Add you as a test user
2. Add these URLs to the OAuth client:
   - JavaScript origins: `http://localhost:5173`
   - Redirect URIs: `http://localhost:5173`

### Option 2: Create Your Own (Recommended)

#### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name: `U-EventTrack-Dev`
4. Click "Create"

#### Step 2: Enable Required APIs
1. Go to **APIs & Services** → **Library**
2. Search and enable:
   - Google+ API
   - Google People API

#### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External**
3. Fill in:
   ```
   App name: U-EventTrack
   User support email: (your email)
   Developer contact: (your email)
   ```
4. Click **Save and Continue**

5. **Scopes** page:
   - Click **Add or Remove Scopes**
   - Check these boxes:
     ✅ `.../auth/userinfo.email`
     ✅ `.../auth/userinfo.profile`
     ✅ `openid`
   - Click **Update** → **Save and Continue**

6. **Test users** page:
   - Click **Add Users**
   - Add your Gmail address
   - Click **Save and Continue**

7. Click **Back to Dashboard**

#### Step 4: Create OAuth Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**

3. Fill in:
   ```
   Application type: Web application
   Name: U-EventTrack Web Client
   ```

4. **Authorized JavaScript origins:**
   Click **+ ADD URI** for each:
   ```
   http://localhost:5173
   http://localhost:3000
   https://ueventtrack.online
   ```

5. **Authorized redirect URIs:**
   Click **+ ADD URI** for each:
   ```
   http://localhost:5173
   http://localhost:3000
   https://ueventtrack.online
   ```

6. Click **CREATE**

#### Step 5: Copy Your Client ID
You'll see a popup with:
```
Your Client ID
1234567890-xxxxxxxxxxxxxxxx.apps.googleusercontent.com

Your Client Secret
GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

**Copy the Client ID** (the long string ending in .apps.googleusercontent.com)

#### Step 6: Update Your .env File
1. Open: `d:\Ueventtrack\Ueventtrack_2\frontend\.env`

2. Replace the `VITE_GOOGLE_CLIENT_ID` line with your new Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Save the file

#### Step 7: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

#### Step 8: Test It!
1. Go to http://localhost:5173
2. Click "Sign in with Google"
3. You should see the Google login screen
4. Select your account
5. Click "Continue"
6. You should be redirected back and logged in!

## Troubleshooting

### Still getting "invalid_client" error?
- Double-check the Client ID in `.env` file
- Make sure there are no extra spaces
- Restart the dev server after changing `.env`

### "redirect_uri_mismatch" error?
- Make sure you added `http://localhost:5173` to BOTH:
  - Authorized JavaScript origins
  - Authorized redirect URIs
- URLs must match exactly (including http://, port number)
- No trailing slashes

### "access_denied" error?
- Add your email as a test user in OAuth consent screen
- Make sure the app is in "Testing" status

### Google popup is blocked?
- Allow popups for localhost in your browser
- Chrome: Click the popup icon in address bar

## Verification Checklist

Before testing, verify:
- ✅ OAuth consent screen configured
- ✅ Test user added (your Gmail)
- ✅ OAuth client created
- ✅ JavaScript origins added: `http://localhost:5173`
- ✅ Redirect URIs added: `http://localhost:5173`
- ✅ Client ID copied to `.env` file
- ✅ Dev server restarted

## Production Setup

When ready for production:

1. In Google Cloud Console, add:
   - JavaScript origin: `https://ueventtrack.online`
   - Redirect URI: `https://ueventtrack.online`

2. Update `.env.production`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

3. Publish OAuth app (move from Testing to Production)

## Need More Help?

Common issues:
1. **Client ID not working** → Create a new one following steps above
2. **Can't access Google Console** → Ask project owner to add you as editor
3. **Popup blocked** → Allow popups for localhost
4. **Still stuck** → Share screenshot of the error

---

## Quick Reference

**Google Cloud Console:** https://console.cloud.google.com/
**Credentials Page:** https://console.cloud.google.com/apis/credentials
**OAuth Consent:** https://console.cloud.google.com/apis/credentials/consent

**Your .env file location:**
```
d:\Ueventtrack\Ueventtrack_2\frontend\.env
```

**Current Client ID in code:**
```
698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4.apps.googleusercontent.com
```

**What you need to replace it with:**
Your new Client ID from Google Cloud Console
