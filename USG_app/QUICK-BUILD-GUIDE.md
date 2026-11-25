# Quick Build Guide for USG App APK

## Current Status
✅ Expo SDK 58 installed  
✅ Android project generated (gradlew.bat ready)  
✅ JavaScript bundle exported  
✅ API_URL configured (192.168.137.26:8000/api)  
❌ **Missing: Android SDK + JDK 17** (required to build APK)

---

## Install Prerequisites (One-Time Setup)

### 1. Install JDK 17 (~10 minutes)
- Download: https://adoptium.net/temurin/releases/?version=17
- Choose: **Windows x64 Installer**
- Install to default location

### 2. Install Android Studio (~30 minutes)
- Download: https://developer.android.com/studio
- During installation:
  - ✅ Install Android SDK
  - ✅ Install Android SDK Platform  
  - ✅ Install Android SDK Build-Tools
- Default location: `C:\Users\91460\AppData\Local\Android\Sdk`

### 3. Set Environment Variables
Open PowerShell **as Administrator**:
```powershell
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.13-hotspot" /M
setx ANDROID_HOME "C:\Users\91460\AppData\Local\Android\Sdk" /M
```
(Adjust JDK version number to match what you installed)

### 4. Restart Terminal
Close and reopen PowerShell for changes to take effect.

---

## Build APK (After Prerequisites Installed)

### Quick Build
```powershell
cd d:\Ueventtrack\Ueventtrack_2\USG_app
.\build-apk.bat
```

### Manual Build (if script fails)
```powershell
cd d:\Ueventtrack\Ueventtrack_2\USG_app\android
.\gradlew.bat assembleRelease -PreactNativeArchitectures=armeabi-v7a,arm64-v8a,x86_64
```

---

## Find Your APK
After successful build:
```
d:\Ueventtrack\Ueventtrack_2\USG_app\android\app\build\outputs\apk\release\app-release.apk
```

---

## Install on Phone

### Method 1: USB
1. Enable USB Debugging on phone (Settings → Developer Options)
2. Connect phone via USB
3. Run: `adb install -r app-release.apk`

### Method 2: File Transfer
1. Copy `app-release.apk` to phone
2. Open file on phone
3. Allow "Install from Unknown Sources" if prompted
4. Tap Install

---

## Troubleshooting

### "Gradle download timeout"
- Your network may be blocking gradle.org
- Use mobile hotspot or different network
- Download manually: https://services.gradle.org/distributions/gradle-8.3-bin.zip
- Place in: `%USERPROFILE%\.gradle\wrapper\dists\gradle-8.3-bin\<hash>\`

### "JAVA_HOME not set"
- Restart terminal after setting environment variables
- Verify: `echo $env:JAVA_HOME`

### Build takes too long
- First build: 20-40 minutes (normal)
- Subsequent builds: 5-15 minutes

---

## Alternative: EAS Build (No Local Setup)
If you can't install Android Studio, wait for EAS free tier reset:
- **Reset Date**: December 1, 2026 (7 days)
- Command: `eas build --platform android --profile preview`
- No prerequisites needed, builds in cloud

---

## Backend Server
Make sure backend is running before testing APK:
```powershell
cd d:\Ueventtrack\Ueventtrack_2\backend
php artisan serve --host=0.0.0.0 --port=8000
```

App connects to: `http://192.168.137.26:8000/api`
