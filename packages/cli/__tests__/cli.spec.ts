import { getContainerFormats } from '../src/rendering/video-from-frames';
import { IVideoBrewArguments, main } from '../src/cli';
import { it, expect, describe, vi } from 'vitest';
import { getVideoSsim } from './utils.js';
import { join } from 'path';

const videoAppPath = join(__dirname, '..', '..', '..', 'examples', '0-dependencies');
const fixturesPath = join(__dirname, 'fixtures');
const expectedBasePath = join(fixturesPath, 'expected');
const actualBasePath = join(fixturesPath, 'actual');

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
  }, 10 * 1000);

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

