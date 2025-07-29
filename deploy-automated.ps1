# Portfolio Automated Deployment Script
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   PORTFOLIO AUTOMATED DEPLOYMENT" -ForegroundColor Cyan  
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

try {
    # 1. Switch to dev branch
    Write-Host "[1/6] Switching to dev branch..." -ForegroundColor Yellow
    git checkout dev
    if ($LASTEXITCODE -ne 0) { throw "Failed to switch to dev branch" }

    # 2. Add and commit changes
    Write-Host "[2/6] Adding and committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Update source code on dev branch" 2>$null
    Write-Host "Source changes committed (if any)" -ForegroundColor Green

    # 3. Push dev branch
    Write-Host "[3/6] Pushing dev branch to origin..." -ForegroundColor Yellow
    git push origin dev
    if ($LASTEXITCODE -ne 0) { throw "Failed to push dev branch" }

    # 4. Build project
    Write-Host "[4/6] Building project with Parcel..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 5. Switch to prod and deploy
    Write-Host "[5/6] Switching to prod and deploying..." -ForegroundColor Yellow
    git checkout prod
    if ($LASTEXITCODE -ne 0) { throw "Failed to switch to prod branch" }

    # Copy built files
    Copy-Item "dist\*" -Destination "." -Force -ErrorAction SilentlyContinue
    Copy-Item "assets\*.mp4" -Destination "." -Force -ErrorAction SilentlyContinue
    Remove-Item ".nojekyll" -Force -ErrorAction SilentlyContinue
    "" | Out-File ".nojekyll" -Encoding ASCII

    # Commit and push prod
    git add .
    git commit -m "Automated deployment from dev branch"
    git push origin prod
    # Also push to gh-pages for GitHub Pages
    git push origin prod:gh-pages
    if ($LASTEXITCODE -ne 0) { throw "Failed to push prod branch" }

    # 6. Success message
    Write-Host "[6/6] Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Site deployed to: https://scxorps.github.io/myPortfolio" -ForegroundColor Green
    Write-Host "✅ Dev branch synchronized and pushed" -ForegroundColor Green  
    Write-Host "✅ Prod branch updated and deployed" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Read-Host "Press Enter to continue"
