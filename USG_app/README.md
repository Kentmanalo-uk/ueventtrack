# USG App - Expo SDK 58

## ✅ Current Configuration

This app is correctly configured with **Expo SDK 58**:

- **Expo SDK:** 58.0.0
- **React Native:** 0.88.0 (Official version for SDK 58)
- **React:** 19.3.1 (Required for SDK 58)

All versions are per [Expo SDK 58 official documentation](https://expo.dev/changelog/sdk-58).

## 🚀 Quick Start

### Start the App
```powershell
npm start
```

Or double-click: `start-app.bat`

### Start Backend and App Together
```
Double-click: ..\start-both-servers.bat
```

This starts both:
- Laravel backend (port 8000)
- Expo development server

## 📱 Testing on Phone

1. Install **Expo Go** app (latest version with SDK 58 support)
2. Make sure phone and computer are on same WiFi
3. Scan QR code from terminal
4. App loads successfully!

## 🔌 Backend Connection

### Current API URL:
```javascript
const API_URL = 'http://172.31.178.26:8000/api';
```

### To Update API URL:
1. Find your IP: `ipconfig`
2. Edit `App.jsx`
3. Change `API_URL` to your IP
4. Restart app

### Start Backend:
```powershell
cd ..\backend
php artisan serve --host=0.0.0.0 --port=8000
```

## 📁 Project Structure

```
USG_app/
├── App.jsx                 # Main app component
├── styles.js              # Global styles
├── package.json           # Dependencies (SDK 58)
├── app.json              # Expo configuration
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Screen components
│   ├── context/          # Context providers
│   └── config/           # Configuration
└── assets/               # Images and resources
```

## 🛠️ Development

### Install Dependencies
```powershell
npm install --legacy-peer-deps
```

### Clear Cache
```powershell
npx expo start --clear
```

### Update Dependencies
```powershell
npx expo install --fix
```

## 🐛 Troubleshooting

### Network Error
- Start backend server: `php artisan serve --host=0.0.0.0`
- Check both devices on same WiFi
- Update API_URL in App.jsx with correct IP

### Module Not Found
```powershell
npm install --legacy-peer-deps
```

### Cache Issues
```powershell
npx expo start --clear
```

### Version Mismatch
Make sure Expo Go app on phone is updated to latest version with SDK 58 support.

## ✅ Success Indicators

Working correctly when:
- ✅ No TurboModule errors
- ✅ App loads to login screen
- ✅ Can navigate between screens
- ✅ Backend connection works
- ✅ All features functional

## 📚 Key Features

- QR Code scanning for attendance
- Event check-ins with geolocation
- Facial recognition enrollment
- Real-time announcements
- Dashboard with statistics
- Dark mode support
- Offline-first architecture

## 🎯 Version History

- **v2.0.0** - Updated to Expo SDK 58 (November 2026)
  - Upgraded to React Native 0.88.0
  - Updated all Expo packages to SDK 58 versions
  - Note: Requires Node.js v22+ for optimal compatibility
- **v1.0.0** - Initial release with Expo SDK 57
  - Migrated from SDK 52 to SDK 57
  - Fixed TurboModule compatibility issues

## 📝 Notes

- Keep backend server running while testing
- Backend URL will change if computer IP changes
- Update Expo Go app regularly
- Test on physical device, not just emulator

---

**Note:** SDK 58 recommends Node.js v22+ but will work with Node.js v20 (current version). For best performance, consider upgrading Node.js.
