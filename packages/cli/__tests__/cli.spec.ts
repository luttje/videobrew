import { IVideoBrewArguments, main } from '../src/cli';
import { it, expect, describe, vi } from 'vitest';
import { getVideoSsim } from './utils.js';
import { join } from 'path';

const videoAppPath = join(__dirname, '..', '..', '..', 'examples', '0-dependencies');
const outputPath = join(__dirname, 'fixtures');
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

describe('CLI', () => {
  it('should show help', async () => {
    await callMain({
      action: 'help',
    });

    expect(mockHelpFunction).toHaveBeenCalled();
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

