@echo off
echo ========================================
echo   PREPARATION POUR GITHUB REPOSITORY
echo ========================================
echo.

echo 1. Nettoyage des fichiers temporaires...
if exist .parcel-cache rmdir /s /q .parcel-cache
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
echo    ✅ Cache nettoyé

echo.
echo 2. Initialisation du repository Git...
if exist .git (
    echo    ⚠️  Repository Git déjà initialisé
) else (
    git init
    echo    ✅ Repository Git initialisé
)

echo.
echo 3. Création du fichier .gitignore...
echo node_modules/ > .gitignore
echo .parcel-cache/ >> .gitignore
echo dist/ >> .gitignore
echo .env >> .gitignore
echo *.log >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo    ✅ .gitignore créé

echo.
echo 4. Ajout des fichiers au repository...
git add .
echo    ✅ Fichiers ajoutés

echo.
echo 5. Commit initial...
git commit -m "🎉 Initial commit: Mon Portfolio - Mehadji Mohamed El Habib"
echo    ✅ Commit initial créé

echo.
echo ========================================
echo   ÉTAPES SUIVANTES SUR GITHUB:
echo ========================================
echo 1. Créez un nouveau repository sur GitHub nommé 'myportfolio'
echo 2. Copiez l'URL du repository (ex: https://github.com/scxorps/myportfolio.git)
echo 3. Exécutez ces commandes dans ce dossier:
echo.
echo    git remote add origin https://github.com/scxorps/myportfolio.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Activez GitHub Pages dans les paramètres du repository
echo    - Settings ^> Pages ^> Source: GitHub Actions
echo.
echo ✅ Votre portfolio sera disponible sur:
echo    https://scxorps.github.io/myportfolio
echo.
pause
