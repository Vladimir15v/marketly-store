@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
    echo Node.js/npm not found. Install Node.js LTS from https://nodejs.org/
    pause
    exit /b 1
)
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo npm install failed. Check the Internet connection.
    pause
    exit /b 1
)
echo Starting development server...
echo Open the Local URL shown below. Press Ctrl+C to stop.
call npm run dev
pause
