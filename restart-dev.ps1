# PowerShell script to restart development server
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Cleaning cache..." -ForegroundColor Yellow
if (Test-Path .parcel-cache) { Remove-Item .parcel-cache -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path dist) { Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "Starting server on port 3000..." -ForegroundColor Green
npm start
