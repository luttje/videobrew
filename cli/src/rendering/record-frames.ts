import { Browser, chromium, Page } from 'playwright';
import fs from 'fs';

type RecordingResult = {
  width: number,
  height: number,
  framerate: number,
  frameCount: number,
  frameFiles: string[],
}

async function messageVideo(page: Page, type: string, data?: any) {
  await page.evaluate((message) => {
    window.postMessage(message);
  }, { ...data, type });
}

export async function recordFrames(videoAppPathOrUrl: string, framesOutputPath: string) : Promise<RecordingResult> {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', (message) => console.log('PAGE LOG:', message.text()));
    page.on('pageerror', (message) => console.log('PAGE ERROR:', message.message));

    if (!fs.existsSync(framesOutputPath))
      fs.mkdirSync(framesOutputPath, { recursive: true });

    // TODO: Host the video so we can use a URL instead of a file path (and not get CORS problems)
    await page.goto(`file://${videoAppPathOrUrl}/index.html`, {
      waitUntil: 'domcontentloaded',
    });
    
    let frame = 0;
    let frameFiles: string[] = [];
    let width, height, framerate, frameCount;
    
    await page.exposeFunction('__messageForwarder', async (message: any) => {
      switch (message.type) {
        case 'videobrew.setup':
          ({ width, height, framerate, frameCount } = message);
          await page.setViewportSize({ width, height });

          for (let i = 0; i < frameCount; i++) {
            frameFiles.push(await captureFrame(page, frame++, framesOutputPath));
          }

          teardown(browser);
          resolve({
            width,
            height,
            framerate,
            frameCount,
            frameFiles,
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
        // @ts-ignore 2304
        __messageForwarder(event.data);
      });
    });

    messageVideo(page, 'videobrew.init');
  });
}

async function captureFrame(page: Page, frameIndex: number, outputPath: string) {
  await messageVideo(page, 'videobrew.tick', { frame: frameIndex });
  
  const output = `${outputPath}/${String(frameIndex).padStart(8, '0')}.jpeg`;

  await page.screenshot({
    path: output,
    fullPage: true
  });

  return output;
}

async function teardown(browser: Browser) {
  await browser.close();
}