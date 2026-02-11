# Add Git to PATH
$env:PATH = "C:\Program Files\Git\cmd;$env:PATH"

# Navigate to project
Set-Location "C:\eclipse\medical-kiosk"

Write-Host "Medical Kiosk - GitHub Push Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "Current Git Status:" -ForegroundColor Green
git status

Write-Host ""
Write-Host "To authenticate with GitHub, you have these options:" -ForegroundColor Yellow
Write-Host "1. Use GitHub CLI: gh auth login" -ForegroundColor White
Write-Host "2. Use Personal Access Token: Create at https://github.com/settings/tokens" -ForegroundColor White
Write-Host "3. Use SSH Key: Add to https://github.com/settings/keys" -ForegroundColor White
Write-Host ""

Write-Host "Attempting to push to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Falconbeast21k/medical-kiosk" -ForegroundColor Green
} else {
    Write-Host "✗ Push failed. Check authentication." -ForegroundColor Red
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
}
