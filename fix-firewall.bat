@echo off
echo Adding firewall rule for Laravel backend...
netsh advfirewall firewall add rule name="Laravel Backend Port 8000" dir=in action=allow protocol=TCP localport=8000
echo.
echo Firewall rule added successfully!
echo.
echo Now test your mobile app.
pause
