@echo off
title Create Desktop Shortcuts
color 0B
echo.
echo ========================================
echo    Create Desktop Shortcuts
echo ========================================
echo.

set SCRIPT_DIR=%~dp0
set DESKTOP=%USERPROFILE%\Desktop

echo Creating shortcuts on your desktop...
echo.

REM Create Start App shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\Start KandyPack.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%SCRIPT_DIR%start-app.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Start KandyPack Frontend and Backend" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,24" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript //nologo "%TEMP%\CreateShortcut.vbs"
echo [+] Created: Start KandyPack.lnk

REM Create Stop App shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\Stop KandyPack.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%SCRIPT_DIR%stop-app.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Stop KandyPack Servers" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,28" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript //nologo "%TEMP%\CreateShortcut.vbs"
echo [+] Created: Stop KandyPack.lnk

REM Clean up temp file
del "%TEMP%\CreateShortcut.vbs"

echo.
echo ========================================
echo    Shortcuts Created Successfully!
echo ========================================
echo.
echo Check your desktop for:
echo   - Start KandyPack.lnk
echo   - Stop KandyPack.lnk
echo.
echo You can now double-click these shortcuts to:
echo   - Start both servers quickly
echo   - Stop all servers easily
echo.
pause
