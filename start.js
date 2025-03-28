const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const startCommand = `node --openssl-legacy-provider ./node_modules/react-scripts/bin/react-scripts.js start`;

try {
  execSync(startCommand, { stdio: 'inherit', env: { ...process.env, PORT } });
} catch (error) {
  console.error('Error starting the server:', error);
}