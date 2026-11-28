# Google OAuth Setup Guide

## Overview
This app now uses Google Sign-In via Expo's AuthSession API. Follow these steps to configure Google Cloud Console.

## Prerequisites
- Google Cloud Console account
- Access to the project: U-EventTrack

## Steps to Configure

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Select Your Project
- Select or create project "U-EventTrack"

### 3. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API"
- Click "Enable"

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"

### 5. Configure OAuth Consent Screen (if not done)
- User Type: External
- App name: U-EventTrack
- User support email: your-email@example.com
- Developer contact: your-email@example.com
- Add scopes:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`

### 6. Create Web Application Client
**Application type:** Web application
**Name:** U-EventTrack Web Client

**Authorized redirect URIs:**
```
https://auth.expo.io
```

**Note:** Google OAuth doesn't allow paths in redirect URIs for web applications. Expo handles the routing internally.

After creating, you'll get:
- **Client ID:** `698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4.apps.googleusercontent.com`
- **Client Secret:** (keep this secure)

### 7. Create Android OAuth Client (Optional for native builds)
**Application type:** Android
**Name:** U-EventTrack Android
**Package name:** `com.emnl2004.USG_app`
**SHA-1 certificate fingerprint:** Get from your debug/release keystore

### 8. Create iOS OAuth Client (Optional for native builds)
**Application type:** iOS
**Name:** U-EventTrack iOS
**Bundle ID:** `com.emnl2004.USG_app`

## Important URLs

### Redirect URI for Expo Go / Development
```
https://auth.expo.io
```

### Redirect URI for Standalone Build
```
com.emnl2004.USG_app://redirect
```

## Testing

### In Development (Expo Go)
1. Make sure the Web Client ID is in `App.jsx`
2. Add redirect URI to Google Console
3. Run `npm start` and test on physical device

### Production Build
1. Build the app with EAS Build
2. Update redirect URIs in Google Console
3. Test the Google Sign-In flow

## Current Configuration

**App Scheme:** `com.emnl2004.USG_app`
**Web Client ID:** `698527452653-b6vnphcdkl4vaj0sftfk6uivlrj1vqd4.apps.googleusercontent.com`

## Troubleshooting

### "Invalid OAuth client" error
- Verify the Client ID matches in `App.jsx`
- Check that redirect URI is added to Google Console

### "Sign in cancelled" 
- User cancelled the sign-in flow (expected behavior)

### "OAuth2 error: invalid_grant"
- Token expired, try again

### "Redirect URI mismatch"
- Make sure the redirect URI in Google Console matches exactly:
  - For Expo Go: `https://auth.expo.io`
  - For standalone: `com.emnl2004.USG_app://redirect`

## Security Notes

1. **Never commit Client Secret to version control**
2. Keep the Web Client ID public (it's safe in mobile apps)
3. Backend validates all authentication via ID token
4. Only allow institutional email domains (@mindoro.edu.ph, @minsu.edu.ph)

## Backend Configuration

The backend endpoint `/api/auth/google` accepts:
```json
{
  "idToken": "string",
  "email": "string",
  "name": "string",
  "googleId": "string"
}
```

Returns:
```json
{
  "success": true,
  "token": "sanctum_token_here",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@email.com",
    "role": "student"
  }
}
```
