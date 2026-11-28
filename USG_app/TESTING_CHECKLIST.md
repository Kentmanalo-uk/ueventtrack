# Google Sign-In Testing Checklist

## ✅ Setup Complete

- [x] Installed expo-auth-session and expo-web-browser
- [x] Removed incompatible @react-native-google-signin package
- [x] Added app scheme to app.json
- [x] Configured OAuth in App.jsx
- [x] Updated landing page UI
- [x] Created backend endpoint for mobile Google auth
- [x] Added route in api.php

## 🧪 Testing Steps

### 1. Start the App
```bash
cd d:\Ueventtrack\Ueventtrack_2\USG_app
npm start
```

### 2. Open on Physical Device
- Scan QR code with Expo Go app
- **Note:** Google OAuth doesn't work in iOS Simulator or Android Emulator with Expo Go

### 3. Test Google Sign-In Flow

**Expected Behavior:**
1. App loads with gradient background
2. "Sign up with Google" button is visible
3. Click button → Browser opens
4. User logs in with Google account
5. Browser redirects back to app
6. Loading indicator shows "Signing in..."
7. Success alert: "Welcome, [User Name]!"
8. User is redirected to Dashboard

### 4. Verify Backend
Check Laravel logs for:
```
New user registered via Google (Mobile): user@email.com
```

### 5. Test Different Scenarios

#### ✅ New User (First Sign-In)
- [ ] Google account not in database
- [ ] User created with role "student"
- [ ] Email verified automatically
- [ ] Token generated successfully

#### ✅ Existing User (Return Sign-In)
- [ ] Google account exists in database
- [ ] User data loaded correctly
- [ ] New token generated
- [ ] Dashboard shows correct data

#### ✅ Linked Account
- [ ] User exists with same email (no google_id)
- [ ] Google ID linked to existing account
- [ ] Login successful

#### ❌ Invalid Email Domain
- [ ] Email not from allowed domain
- [ ] Error: "Only institutional email addresses are allowed"

#### ❌ Archived Account
- [ ] User account is archived
- [ ] Error: "This account has been archived"

## 🐛 Common Issues

### Issue: "OAuth client not found"
**Solution:** Add redirect URI to Google Console:
```
https://auth.expo.io
```
(Note: Don't include the path - Google requires just the origin)

### Issue: Browser doesn't redirect back
**Solution:** Check app scheme in app.json matches:
```json
"scheme": "com.emnl2004.USG_app"
```

### Issue: "Network Error"
**Solution:** Check API_URL is correct:
```javascript
const API_URL = 'https://ueventtrack.online/api';
```

### Issue: Backend returns 500 error
**Solution:** Check Laravel logs:
```bash
tail -f storage/logs/laravel.log
```

## 📱 Device Requirements

- Physical Android/iOS device (Simulators won't work with Expo Go)
- Internet connection
- Google account
- Expo Go app installed

## 🔐 Security Verification

- [ ] ID token validated (in production, verify with Google API)
- [ ] Email domain whitelist enforced
- [ ] Sanctum token generated securely
- [ ] User role defaults to "student"
- [ ] Audit log created for new registrations

## 📊 Success Metrics

After successful implementation:
- Google Sign-In completion rate > 90%
- Average sign-in time < 10 seconds
- Zero security vulnerabilities
- User feedback: "Easy to use"

## 🚀 Next Steps

1. Test on multiple devices
2. Gather user feedback
3. Monitor error logs
4. Add analytics tracking
5. Optimize user experience

## 📝 Notes

- Google OAuth requires HTTPS in production
- Expo Go uses different redirect URI than standalone builds
- Backend validates all authentication tokens
- Users can still use email/password login as fallback
