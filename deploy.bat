@echo off
cd /d C:\Claude-AI\DS\fluent-prototype
echo Building...
call npm run build
echo Renaming dist to docs...
if exist docs rmdir /s /q docs
move dist docs
echo Pushing to GitHub...
git add .
git commit -m "update prototype"
git push
echo.
echo Done! The site will update in a few minutes at:
echo https://orsolyasas.github.io/fluent-prototype/
pause
