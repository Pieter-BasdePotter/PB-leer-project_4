@echo off
setlocal enabledelayedexpansion

cd /d "C:\Users\pbdep\OneDrive\Documenten\PB-leer-project_4"

echo ===== 1. node --check server/models/Follows.js =====
node --check server/models/Follows.js 2>&1
set EXIT_CODE1=!ERRORLEVEL!
echo Exit Code: !EXIT_CODE1!
echo.

echo ===== 2. node --check server/routes/profile.js =====
node --check server/routes/profile.js 2>&1
set EXIT_CODE2=!ERRORLEVEL!
echo Exit Code: !EXIT_CODE2!
echo.

echo ===== 3. node --check server/models/Users.js =====
node --check server/models/Users.js 2>&1
set EXIT_CODE3=!ERRORLEVEL!
echo Exit Code: !EXIT_CODE3!
echo.

echo ===== 4. node --check server/index.js =====
node --check server/index.js 2>&1
set EXIT_CODE4=!ERRORLEVEL!
echo Exit Code: !EXIT_CODE4!
echo.

echo ===== 5. cd server and node -e =====
cd server
node -e "const r = require('./routes/profile'); console.log('loaded:', typeof r);" 2>&1
set EXIT_CODE5=!ERRORLEVEL!
echo Exit Code: !EXIT_CODE5!
