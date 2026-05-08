Set-Location "C:\Claude-AI\DS\fluent-prototype"

Write-Host "Building..." -ForegroundColor Cyan
npm run build

Write-Host "Updating docs folder..." -ForegroundColor Cyan
if (Test-Path "docs") { Remove-Item -Recurse -Force "docs" }
Move-Item "dist" "docs"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "update prototype"
git push

Write-Host ""
Write-Host "Done! Site will update in a few minutes at:" -ForegroundColor Green
Write-Host "https://orsolyasas.github.io/fluent-prototype/" -ForegroundColor Green
Read-Host "Press Enter to close"
