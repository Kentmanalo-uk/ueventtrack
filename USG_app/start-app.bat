@echo off
echo Starting USG Mobile App...
echo.
echo Current Configuration:
echo - Backend URL: http://192.168.137.26:8000/api
echo.
echo Make sure:
echo 1. Backend is running at http://192.168.137.26:8000
echo 2. Your phone and computer are on the same WiFi (Wi-Fi 3)
echo 3. Expo Go app is installed on your phone
echo.
echo If backend is not accessible, update the IP in config.js
echo To find your IP: Run 'ipconfig' and look for 'Wi-Fi 3' IPv4 Address
echo.
pause
npm start
