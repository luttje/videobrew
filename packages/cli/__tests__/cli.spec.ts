import { getContainerFormats } from '../src/rendering/video-from-frames';
import { IVideoBrewArguments, main } from '../src/cli';
import { it, expect, describe, vi } from 'vitest';
import pathToFfmpeg from 'ffmpeg-static';
import { exec } from 'child_process';
import { join } from 'path';
import util from 'util';
import 'core-js'; // Polyfill needed for chromium.launch() at src/rendering/record-frames.ts

const execAsync = util.promisify(exec);

const videoAppPath = join(__dirname, '..', '..', '..', 'examples', '0-dependencies');
const outputPath = join(__dirname, 'output');
const expectedBasePath = join(outputPath, 'expected');
const actualBasePath = join(outputPath, 'actual');

const mockHelpFunction = vi.fn();

const callMain = async (args: IVideoBrewArguments) => {
  return await main({
    ...args,
    _unknown: [],
    _commandLineResults: {
      missingArgs: [],
      printHelp: mockHelpFunction,
    },
  });
};

const getVideoSsim = async (expectedPath: string, actualPath: string) => {
  const command = `${pathToFfmpeg} -i ${expectedPath} -i ${actualPath} -lavfi ssim -f null -`;
  const result = (await execAsync(command)).stderr;

  const regex = /All:(\d+\.\d+)/;
  const match = result.match(regex);

  return parseFloat(match![1]);
};

describe('CLI', () => {
  it('should show help', async () => {
    await callMain({
      action: 'help',
    });

    expect(mockHelpFunction).toHaveBeenCalled();
  });

  it('should show available render-formats', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

    await callMain({
      action: 'render-formats',
    });

    const containerFormats = await getContainerFormats();

    for (const containerFormat of containerFormats) {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(containerFormat.name));
    }
  });

  it('should render a local video app with default quality by serving it', async () => {
    const actualPath = join(actualBasePath, '0-dependencies.mp4');
    
    await callMain({
      action: 'render',
      videoAppPathOrUrl: videoAppPath,
      output: actualPath,
    });
    
    const expectedPAth = join(expectedBasePath, '0-dependencies.mp4');
    const ssim = await getVideoSsim(expectedPAth, actualPath);
    expect(ssim).toBeCloseTo(1.0, 1);
  }, 60 * 1000);
  
  it('should render a local video app with the highest quality by serving it', async () => {
    const actualPath = join(actualBasePath, '0-dependencies-hq.mp4');
    
    await callMain({
      action: 'render',
      videoAppPathOrUrl: videoAppPath,
      output: actualPath,
      renderQuality: 100,
    });
    
    const expectedPAth = join(expectedBasePath, '0-dependencies-hq.mp4');
    const ssim = await getVideoSsim(expectedPAth, actualPath);
    expect(ssim).toBeCloseTo(1.0, 1);
  }, 60 * 1000);
});

