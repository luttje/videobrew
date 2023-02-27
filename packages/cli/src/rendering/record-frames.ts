import { Browser, chromium, Page, PageScreenshotOptions } from 'playwright';
import fs from 'fs';
import { isVideoAppUrl } from '../utils/is-video-url';
import { inform } from '../utils/logging';
import chalk from 'chalk';

type RecordingResult = {
  width: number,
  height: number,
  framerate: number,
  frameCount: number,
  frameFiles: string[],
}

export function getExtensionByQuality(quality: number) {
  return quality < 100 ? 'jpeg' : 'png';
}

export async function recordFrames(
  videoAppPathOrUrl: string,
  framesOutputPath: string,
  renderQuality: number
): Promise<RecordingResult> {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', (message) => inform(`Video App Browser Log: ${message.text()}`));
    page.on('pageerror', (message) => inform(`Video App Browser Error: ${message}`, chalk.red));

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
      frameFiles.push(await captureFrame(page, frame++, framesOutputPath, renderQuality));
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