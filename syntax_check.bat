@echo off
cd /d "C:\Users\pbdep\OneDrive\Documenten\PB-leer-project_4"

echo === Command 1: node --check server/models/Follows.js ===
node --check server/models/Follows.js
echo Exit Code: %ERRORLEVEL%
echo.

echo === Command 2: node --check server/routes/profile.js ===
node --check server/routes/profile.js
echo Exit Code: %ERRORLEVEL%
echo.

echo === Command 3: node --check server/models/Users.js ===
node --check server/models/Users.js
echo Exit Code: %ERRORLEVEL%
echo.

echo === Command 4: node --check server/index.js ===
node --check server/index.js
echo Exit Code: %ERRORLEVEL%
echo.

echo === Command 5: Module loading test ===
cd server
node -e "const r = require('./routes/profile'); console.log('loaded:', typeof r);"
echo Exit Code: %ERRORLEVEL%
