@echo off
echo Stopping any running Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo Cleaning Parcel cache...
if exist .parcel-cache rmdir /s /q .parcel-cache
if exist dist rmdir /s /q dist

echo Starting development server on port 3000...
npm start
