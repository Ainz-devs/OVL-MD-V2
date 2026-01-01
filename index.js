const { spawnSync, spawn } = require('child_process');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

// Ajoutez ici vos variables d'environnement
const env_file = ``;

if (!env_file.trim()) {
  console.error("❌ 'env_file' est vide. Veuillez renseigner vos variables d'environnement avant de lancer le script.");
  process.exit(1);
}

let crashCount = 0;
const crashLimit = 5;
let lastCrashTime = Date.now();
const crashResetDelay = 30000;

function setupProject() {
  if (!existsSync('ovl')) {
    const clone = spawnSync('git', ['clone', 'https://github.com/Ainz-devs/OVL-MD-V2', 'ovl'], { stdio: 'inherit' });
    if (clone.status !== 0) process.exit(1);
  }

  if (!existsSync('ovl/.env')) {
    mkdirSync('ovl', { recursive: true });
    writeFileSync('ovl/.env', env_file);
    console.log("✅ Fichier .env créé avec succès.");
  }

  const install = spawnSync('npm', ['install'], { cwd: 'ovl', stdio: 'inherit' });
  if (install.status !== 0) process.exit(1);
}

function validateSetup() {
  if (!existsSync('ovl/package.json')) {
    process.exit(1);
  }

  const check = spawnSync('npm', ['ls'], { cwd: 'ovl', stdio: 'ignore' });

  if (check.status !== 0) {
    const reinstall = spawnSync('npm', ['install'], { cwd: 'ovl', stdio: 'inherit' });
    if (reinstall.status !== 0) {
      process.exit(1);
    }
  }
}

function launchApp() {
  const pm2 = spawn('npx', ['pm2', 'start', 'Ovl.js', '--name', 'ovl-md', '--attach'], {
    cwd: 'ovl',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let restartAttempts = 0;

  pm2.stdout?.on('data', (chunk) => {
    const output = chunk.toString();
    console.log(output);
    if (output.includes('Connexion') || output.includes('ready')) {
      restartAttempts = 0;
    }
  });

  pm2.stderr?.on('data', (chunk) => {
    const output = chunk.toString();
    if (output.includes('restart')) {
      restartAttempts++;
      if (restartAttempts > 3) {
        spawnSync('npx', ['pm2', 'delete', 'ovl-md'], { cwd: 'ovl', stdio: 'inherit' });
        startNodeFallback();
      }
    }
  });

  pm2.on('exit', () => {
    startNodeFallback();
  });

  pm2.on('error', () => {
    startNodeFallback();
  });
}

function startNodeFallback() {
  const child = spawn('node', ['Ovl.js'], { cwd: 'ovl', stdio: 'inherit' });

  child.on('exit', (code) => {
    const now = Date.now();
    if (now - lastCrashTime > crashResetDelay) crashCount = 0;
    crashCount++;
    lastCrashTime = now;

    if (crashCount > crashLimit) {
      return;
    }

    startNodeFallback();
  });
}

setupProject();
validateSetup();
launchApp();
