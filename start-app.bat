@echo off
title KandyPack Application Launcher
color 0A
echo.
echo ========================================
echo    KandyPack Distribution System
echo    Starting Application...
echo ========================================
echo.

REM Check if frontend node_modules exists
if not exist "Frontend\node_modules\" (
    echo [!] Frontend dependencies not found!
    echo [*] Installing frontend dependencies...
    cd Frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    cd ..
    echo [+] Frontend dependencies installed!
    echo.
)

REM Check if backend node_modules exists
if not exist "backend\node_modules\" (
    echo [!] Backend dependencies not found!
    echo [*] Installing backend dependencies...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Failed to install backend dependencies!
        pause
        exit /b 1
    )
    cd ..
    echo [+] Backend dependencies installed!
    echo.
)

REM Check if frontend .env exists, create if missing
if not exist "Frontend\.env" (
    echo [*] Creating frontend .env file...
    echo REACT_APP_API_URL=http://localhost:3000/api > Frontend\.env
    echo [+] Frontend .env created successfully!
    echo.
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [X] ERROR: Backend .env file not found!
    echo [!] Please create backend\.env with database configuration.
    echo.
    echo Required variables:
    echo   - PORT=3000
    echo   - DB_HOST=localhost
    echo   - DB_NAME=kandypack
    echo   - DB_USER=root
    echo   - DB_PASSWORD=your_password
    echo   - JWT_SECRET=your_secret_key
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
echo       Location: backend/
echo       Command: npm run dev
echo       URL: http://localhost:3000
echo.
cd backend
start "KandyPack Backend (Port 3000)" cmd /k "color 0E && echo Backend Server Starting... && npm run dev"
timeout /t 3 /nobreak > nul
cd ..

echo [+] Backend server started!
echo.

echo [2/3] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul
echo [+] Backend ready!
echo.

echo [3/3] Starting Frontend Server...
echo       Location: Frontend/
echo       Command: npm start
echo       URL: http://localhost:3001 (or next available port)
echo.
cd Frontend
start "KandyPack Frontend" cmd /k "color 0B && echo Frontend Server Starting... && set PORT=3001 && npm start"
cd ..

echo.
echo ========================================
echo    Application Started Successfully!
echo ========================================
echo.
echo [+] Backend API:  http://localhost:3000/api
echo [+] Frontend App: http://localhost:3001 (opens automatically)
echo.
echo Two command windows are now open:
echo   1. KandyPack Backend (Yellow) - API Server
echo   2. KandyPack Frontend (Cyan) - React App
echo.
echo To stop both servers, run: stop-app.bat
echo.
echo Press any key to close this launcher...
pause > nul
