import { chromium } from "playwright";
import { fileURLToPath } from 'url';
import util from 'util';
import { exec } from 'child_process';
import shell from 'any-shell-escape';
import pathToFfmpeg from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function fromFrames(framesPath, framerate, outputPath) {
  const output = `${outputPath}/output.mp4`;
  const videoConfig = shell([
    `${pathToFfmpeg}`,
    `-framerate`, `${framerate}`,
    `-i`, path.join(framesPath, '%08d.jpeg'),
    `-vf`, `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    `-c:v`, `libx264`,
    `-pix_fmt`, `yuv420p`,
    `-y`,
    `${output}`
  ]);

  console.log(`Rendering with command: ${videoConfig}`);

  const { stdout, stderr } = await util.promisify(exec)(videoConfig, {
    cwd: __dirname,
  });
  
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);

  await fs.rmSync(framesPath, { recursive: true });

  return output;
}

async function messageVideo(page, type, data) {
  await page.evaluate((message) => {
    window.postMessage(message);
  }, { ...data, type });
}

async function recordFrames(videoAppPath, framesOutputPath) {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', (message) => console.log('PAGE LOG:', message.text()));
    page.on('pageerror', (message) => console.log('PAGE ERROR:', message.message()));

    if (!fs.existsSync(framesOutputPath))
      fs.mkdirSync(framesOutputPath, { recursive: true });

    // TODO: Host the video so we can use a URL instead of a file path (and not get CORS problems)
    await page.goto(`file://${videoAppPath}/index.html`, {
      waitUntil: 'domcontentloaded',
    });
    
    let frame = 0;
    let framesBuffer = [];
    let width, height, framerate, frameCount;
    
    await page.exposeFunction('__messageForwarder', async (message) => {
      switch (message.type) {
        case 'videobrew.setup':
          ({ width, height, framerate, frameCount } = message);
          await page.setViewportSize({ width, height });

          for (let i = 0; i < frameCount; i++) {
            framesBuffer.push(await captureFrame(page, frame++, framesOutputPath));
          }

          teardown(browser);
          resolve({
            framesBuffer,
            framerate,
            width,
            height,
            frameCount
          });

          break;
        case 'videobrew.init':
          break; // video side only
        case 'videobrew.tick':
          break; // video side only
        default:
          console.error('Unknown message type', message.type);
      }
    });

    await page.evaluate(() => {
      window.addEventListener('message', (event) => {
        __messageForwarder(event.data);
      });
    });

    messageVideo(page, 'videobrew.init');
  });
}

async function captureFrame(page, frameIndex, outputPath) {
  await messageVideo(page, 'videobrew.tick', { frame: frameIndex });
  
  const output = `${outputPath}/${String(frameIndex).padStart(8, '0')}.jpeg`;

  await page.screenshot({
    path: output,
    fullPage: true
  });

  return output;
}

async function teardown(browser) {
  await browser.close();
}

const videoAppPath = process.argv[2];
const outputPath = process.argv[3];
const framesOutputPath = path.join(outputPath, 'frames');
const {
  framesBuffer,
  framerate,
  width,
  height,
  frameCount
} = await recordFrames(videoAppPath, framesOutputPath);

await fromFrames(framesOutputPath, framerate, outputPath);