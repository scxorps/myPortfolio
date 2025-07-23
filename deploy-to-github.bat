@echo off
echo ========================================
echo   DÉPLOIEMENT RAPIDE VERS GITHUB
echo   Repository: scxorps/myportfolio
echo ========================================
echo.

echo 🧹 Nettoyage des caches...
if exist .parcel-cache rmdir /s /q .parcel-cache
if exist dist rmdir /s /q dist
echo    ✅ Caches nettoyés

echo.
echo 📦 Initialisation Git...
git init
git add .
git commit -m "🎉 Initial commit: Mon Portfolio - Mehadji Mohamed El Habib"
echo    ✅ Commit initial créé

echo.
echo 🔗 Connexion au repository GitHub...
git remote add origin https://github.com/scxorps/myportfolio.git
git branch -M main
echo    ✅ Repository configuré

echo.
echo 🚀 Push vers GitHub...
git push -u origin main
echo    ✅ Code poussé vers GitHub

echo.
echo ========================================
echo   🎉 DÉPLOIEMENT TERMINÉ !
echo ========================================
echo.
echo ✅ Votre code est maintenant sur GitHub
echo 🌐 Repository: https://github.com/scxorps/myportfolio
echo.
echo 📋 ÉTAPE FINALE :
echo    1. Allez sur https://github.com/scxorps/myportfolio
echo    2. Settings ^> Pages ^> Source: GitHub Actions
echo.
echo 🎯 Votre portfolio sera disponible sur:
echo    https://scxorps.github.io/myportfolio
echo.
pause
