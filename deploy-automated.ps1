# Portfolio Automated Deployment Script
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   PORTFOLIO AUTOMATED DEPLOYMENT" -ForegroundColor Cyan  
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

try {
    # 1. Switch to main branch
    Write-Host "[1/6] Switching to main branch..." -ForegroundColor Yellow
    git checkout main
    if ($LASTEXITCODE -ne 0) { throw "Failed to switch to main branch" }

    # 2. Add and commit changes
    Write-Host "[2/6] Adding and committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Update source code on main branch" 2>$null
    Write-Host "Source changes committed (if any)" -ForegroundColor Green

    # 3. Push main branch
    Write-Host "[3/6] Pushing main branch to origin..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw "Failed to push main branch" }

    # 4. Build project
    Write-Host "[4/6] Building project with Parcel..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 5. Switch to gh-pages and deploy
    Write-Host "[5/6] Switching to gh-pages and deploying..." -ForegroundColor Yellow
    git checkout gh-pages
    if ($LASTEXITCODE -ne 0) { throw "Failed to switch to gh-pages branch" }

    # Copy built files
    Copy-Item "dist\*" -Destination "." -Force -ErrorAction SilentlyContinue
    Copy-Item "assets\*.mp4" -Destination "." -Force -ErrorAction SilentlyContinue
    Remove-Item ".nojekyll" -Force -ErrorAction SilentlyContinue
    "" | Out-File ".nojekyll" -Encoding ASCII

    # Commit and push gh-pages
    git add .
    git commit -m "Automated deployment from main branch"
    git push origin gh-pages
    if ($LASTEXITCODE -ne 0) { throw "Failed to push gh-pages branch" }

    # 6. Success message
    Write-Host "[6/6] Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Site deployed to: https://scxorps.github.io/myPortfolio" -ForegroundColor Green
    Write-Host "✅ Main branch synchronized and pushed" -ForegroundColor Green  
    Write-Host "✅ Gh-pages branch updated and deployed" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Read-Host "Press Enter to continue"
