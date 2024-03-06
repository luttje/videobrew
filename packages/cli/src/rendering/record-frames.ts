import { Browser, chromium, Page, PageScreenshotOptions } from 'playwright';
import { inform } from '../utils/logging.js';
import chalk from 'chalk';
import { VideoAppSetup } from '@videobrew/client';

type RecordingResult = {
  width: number,
  height: number,
  framerate: number,
  frameCount: number,
  frameFiles: string[],
}

type FrameProgressCallback = (currentFrame: number, totalFrames: number) => void;

export function getExtensionByQuality(quality: number) {
  return quality < 100 ? 'jpeg' : 'png';
}

export async function recordFrames(
  videoAppUrl: string,
  framesOutputPath: string,
  renderQuality: number,
  onFrameProgress?: FrameProgressCallback,
): Promise<RecordingResult> {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', (message) => inform(`Video App Browser Log: ${message.text()}`));
    page.on('pageerror', (message) => inform(`Video App Browser Error: ${message}`, chalk.red));

    await page.goto(videoAppUrl, {
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
      frameFiles.push(await captureFrame(page, frame, framesOutputPath, renderQuality));

      onFrameProgress?.(frame, frameCount);
      frame++;
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

async function captureFrame(page: Page, frameIndex: number, outputPath: string, renderQuality: number) {
  await page.evaluate(`(async (frameIndex) => {
    await window.videobrew.tick(frameIndex);
  })(${frameIndex})`);
  
  const extension = getExtensionByQuality(renderQuality);
  const output = `${outputPath}/${String(frameIndex).padStart(8, '0')}.${extension}`;

  const options: PageScreenshotOptions  = {
    path: output,
    fullPage: true,
    type: extension,
  };

  if (extension === 'jpeg')
    options.quality = renderQuality;

  await page.screenshot(options);

  return output;
}

async function teardown(browser: Browser) {
  await browser.close();
}