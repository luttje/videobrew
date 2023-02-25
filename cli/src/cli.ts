#!/usr/bin/env node
import { spawn } from 'child_process';
import { cwd } from 'process';
import path from 'path';
import fs from 'fs';
import { showHelp } from './show-help';
import { recordFrames } from './rendering/record-frames';
import { videoFromFrames } from './rendering/video-from-frames';

const args = process.argv.slice(2);
const action = args[0];

async function main() {
  const relativeVideoAppPath = args[1] ?? '.';
  const relativeOutputPath = args[2] ?? 'out';

  const workingDirectory = cwd();
  const root = path.resolve(__dirname, '..');
  let videoAppPath = path.join(workingDirectory, relativeVideoAppPath);
  let outputPath = path.join(workingDirectory, relativeOutputPath);

  // If it is inside the videobrew root, move it up one level
  if (videoAppPath.startsWith(root + path.sep)) {
    // The directory can not be called videobrew-tests because it would start with the same name as root, causing paths to be rewritten:
    // https://github.com/vitejs/vite-plugin-vue/blob/eef8929c95d8b5cce1385a1d5e60da56a8420c0b/packages/plugin-vue/src/template.ts#L118
    const newVideoAppPath = path.resolve(root, '..', 'tests-videobrew');
    fs.mkdirSync(newVideoAppPath, { recursive: true });

    // We do this because we don't want vite to resolve inside our directory. Since most users of videobrew will be outside of the videobrew root, this is not a problem.
    console.log(`Video app path ${videoAppPath} is inside the videobrew root. Copying files outside of root.`);
    // Copy all files from videoAppPath to newVideoAppPath
    fs.readdirSync(videoAppPath).forEach(file => {
      fs.copyFileSync(path.join(videoAppPath, file), path.join(newVideoAppPath, file));
    });

    videoAppPath = newVideoAppPath;
  }

  const videoAppFilePath = path.join(videoAppPath, 'index.html');

  if (!fs.existsSync(videoAppPath)) {
    console.log(`Video app path ${videoAppPath} does not exist! Please provide a valid path to where your video website is located.`);
    showHelp();
    process.exit(1);
  }

  if (!fs.existsSync(videoAppFilePath)) {
    console.log(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
    showHelp();
    process.exit(1);
  }

  if (action === 'render') {
    const framesOutputPath = path.join(outputPath, 'frames');
    const {
      framerate,
    } = await recordFrames(videoAppPath, framesOutputPath);

    await videoFromFrames(framesOutputPath, framerate, outputPath);

    console.log(`Video rendered to ${outputPath}`);
  } else if (action === 'preview') {
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
      process.exit(code ?? 0);
    });

    devServer.on('error', (err) => {
      console.error(`Build error: ${err}`);
      process.exit(1);
    });
  } else {
    console.log('Please provide an action: preview or render');
    showHelp();
    process.exit(1);
  }
}

main();