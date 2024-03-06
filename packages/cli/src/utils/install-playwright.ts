import { packageDirectory } from 'pkg-dir';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { run } from './shell.js';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type BrowserInstallationResult = {
  installedOrUpdated: boolean;
  output?: string;
}

export async function ensurePlaywrightInstalled(): Promise<BrowserInstallationResult> {
  const rootDir = await packageDirectory({ cwd: __dirname });
  const output = run('npx playwright install', rootDir);

  if (output.trim().length === 0) {
    return {
      installedOrUpdated: false,
    };
  }
  
  return {
    installedOrUpdated: true,
    output,
  };
}

export async function testPlaywrightInstallationWorking(): Promise<boolean> {
  try {
    const browser = await chromium.launch();
    await browser.close();

    return true;
  } catch (error) {
    return false;
  }
}