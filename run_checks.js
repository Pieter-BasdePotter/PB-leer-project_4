const { execSync } = require('child_process');
const path = require('path');

const cwd = 'C:\\Users\\pbdep\\OneDrive\\Documenten\\PB-leer-project_4';

const checks = [
  {
    name: '1. node --check server/models/Follows.js',
    command: 'node --check server/models/Follows.js'
  },
  {
    name: '2. node --check server/routes/profile.js',
    command: 'node --check server/routes/profile.js'
  },
  {
    name: '3. node --check server/models/Users.js',
    command: 'node --check server/models/Users.js'
  },
  {
    name: '4. node --check server/index.js',
    command: 'node --check server/index.js'
  },
  {
    name: '5. cd server && node -e "const r = require(\'./routes/profile\'); console.log(\'loaded:\', typeof r);"',
    command: 'cd server && node -e "const r = require(\'./routes/profile\'); console.log(\'loaded:\', typeof r);"'
  }
];

checks.forEach((check, index) => {
  console.log(`\n===== ${check.name} =====`);
  try {
    const output = execSync(check.command, { 
      cwd: cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(output);
    console.log(`Exit Code: 0`);
  } catch (error) {
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    console.log(`Exit Code: ${error.status}`);
  }
});
