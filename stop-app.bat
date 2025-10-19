@echo off
title KandyPack - Stopping Servers
color 0C
echo.
echo ========================================
echo    KandyPack Distribution System
echo    Stopping All Servers...
echo ========================================
echo.

echo [*] Stopping Node.js processes...

REM Kill all node processes running nodemon or react-scripts
taskkill /F /IM node.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Node.js processes stopped successfully!
) else (
    echo [!] No Node.js processes found running.
)

echo.
echo [*] Closing server windows...

REM Close command windows by title
taskkill /FI "WINDOWTITLE eq KandyPack Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq KandyPack Frontend*" /F >nul 2>&1

echo [+] Server windows closed!
echo.
echo ========================================
echo    All Servers Stopped Successfully!
echo ========================================
echo.
pause
