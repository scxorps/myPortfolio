Write-Host "Demarrage du serveur portfolio STABLE..." -ForegroundColor Green
Write-Host "Port: 5000 (http-server)" -ForegroundColor Yellow
Write-Host "URL: http://localhost:5000" -ForegroundColor Cyan

# Nettoyer les anciens processus
Write-Host "Nettoyage des processus Node.js..." -ForegroundColor Blue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Nettoyer les caches
Write-Host "Nettoyage des caches..." -ForegroundColor Blue
Remove-Item -Path ".parcel-cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# Construire et servir avec http-server (plus stable)
Write-Host "Construction et demarrage du serveur stable..." -ForegroundColor Green
npm run serve

Read-Host "Appuyez sur Entree pour continuer..."
