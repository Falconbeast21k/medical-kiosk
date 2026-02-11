@echo off
REM Medical Kiosk Startup Script for Windows

echo.
echo 🏥 Medical Kiosk - Initialization Script
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✓ Dependencies installed
echo.

REM Initialize database
echo 🗄️ Initializing database...
cd server
call npm run db:init

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)

call npm run db:seed

if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo ✓ Database initialized with sample data
echo.

cd ..

echo ==========================================
echo ✓ Setup complete!
echo.
echo 🚀 To start the application:
echo    npm run dev
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5000
echo.
echo 📝 Demo Credentials:
echo    Username: admin
echo    Password: admin123
echo.
pause
