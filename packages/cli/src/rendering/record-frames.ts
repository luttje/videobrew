import { Browser, chromium, Page } from 'playwright';
import fs from 'fs';
import { isVideoAppUrl } from '../utils/is-video-url';

type RecordingResult = {
  width: number,
  height: number,
  framerate: number,
  frameCount: number,
  frameFiles: string[],
}

export async function recordFrames(videoAppPathOrUrl: string, framesOutputPath: string) : Promise<RecordingResult> {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', (message) => console.log('PAGE LOG:', message.text()));
    page.on('pageerror', (message) => console.log('PAGE ERROR:', message.message));

    if (!fs.existsSync(framesOutputPath))
      fs.mkdirSync(framesOutputPath, { recursive: true });

    const isVideoAppAtUrl = isVideoAppUrl(videoAppPathOrUrl);
    const videoPath = isVideoAppAtUrl ? videoAppPathOrUrl : `file://${videoAppPathOrUrl}/index.html`;

    await page.goto(videoPath, {
      waitUntil: 'domcontentloaded',
    });
    
    let frame = 0;
    let frameFiles: string[] = [];
    let width, height, framerate, frameCount;
    
    const setup = <VideoAppSetup>(await page.evaluate(`(async () => {
      return await window.videobrew.init();
    })()`));

    ({ width, height, framerate, frameCount } = setup);

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
  });
}

async function captureFrame(page: Page, frameIndex: number, outputPath: string) {
  await page.evaluate(`(async (frameIndex) => {
    await window.videobrew.tick(frameIndex);
  })(${frameIndex})`);
  
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