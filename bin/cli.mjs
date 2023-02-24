import { spawn } from 'child_process';
import { cwd } from 'node:process';
import { fileURLToPath } from 'url';
import path from 'node:path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const action = args[0];

if (action === 'render') {
  console.log('Rendering...');
  console.log('TODO! (not implemented yet)');
  process.exit(0);
}

if (action !== 'preview') {
  console.log('Please provide an action: preview or render');
  process.exit(1);
}

const relativeVideoAppPath = args[1] ?? '.';

const workingDirectory = cwd();
const videoAppPath = path.join(workingDirectory, relativeVideoAppPath);
const videoAppFilePath = path.join(videoAppPath, 'index.html');

if (!fs.existsSync(videoAppPath)) {
  console.log(`Video app path ${videoAppPath} does not exist! Please provide a valid path to where your video website is located.`);
  process.exit(1);
}

if (!fs.existsSync(videoAppFilePath)) {
  console.log(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
  process.exit(1);
}

// We want to run videobrew with HMR enabled, so we can trigger a rebuild when the video app changes
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit', 
  shell: true,
  env: {
    'VIDEOBREW_TARGET': videoAppPath,
  },
});

devServer.on('close', (code) => {
  console.log(`DevServer exited with code ${code}`);
  process.exit(code);
});

devServer.on('error', (err) => {
  console.error(`Build error: ${err}`);
  process.exit(1);
});