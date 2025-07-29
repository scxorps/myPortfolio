@echo off
echo ====================================
echo    PORTFOLIO AUTOMATED DEPLOYMENT
echo ====================================
echo.

REM Ensure we're on main branch
echo [1/6] Switching to main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ERROR: Failed to switch to main branch
    pause
    exit /b 1
)

REM Add and commit any changes
echo [2/6] Adding and committing changes...
git add .
git commit -m "Update source code on main branch" 2>nul
echo Source changes committed (if any)

REM Push main branch
echo [3/6] Pushing main branch to origin...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push main branch
    pause
    exit /b 1
)

REM Build the project
echo [4/6] Building project with Parcel...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

REM Switch to gh-pages branch
echo [5/6] Switching to gh-pages and deploying...
git checkout gh-pages
if %errorlevel% neq 0 (
    echo ERROR: Failed to switch to gh-pages branch
    pause
    exit /b 1
)

REM Copy built files (excluding source files)
xcopy /Y dist\*.* .\ >nul 2>&1
xcopy /Y assets\*.mp4 .\ >nul 2>&1
del .nojekyll >nul 2>&1
echo. > .nojekyll

REM Commit and push gh-pages
git add .
git commit -m "Automated deployment from main branch"
git push origin gh-pages
if %errorlevel% neq 0 (
    echo ERROR: Failed to push gh-pages branch
    pause
    exit /b 1
)

echo [6/6] Deployment completed successfully!
echo.
echo ✅ Site deployed to: https://scxorps.github.io/myPortfolio
echo ✅ Main branch synchronized and pushed
echo ✅ Gh-pages branch updated and deployed
echo.
pause
