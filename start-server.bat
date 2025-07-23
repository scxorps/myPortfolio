@echo off
echo Demarrage du serveur portfolio...
echo Port: 8080
echo URL: http://localhost:8080

:: Nettoyer les anciens processus
taskkill /F /IM node.exe >nul 2>&1

:: Nettoyer les caches
if exist .parcel-cache rmdir /s /q .parcel-cache
if exist dist rmdir /s /q dist

:: Demarrer le serveur
npm start

pause
