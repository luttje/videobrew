import { IVideoBrewArguments, main } from '../src/cli';
import { Buffer } from 'buffer';
import { join } from 'path';
import fs from 'fs';
import 'core-js'; // Polyfill needed for chromium.launch() at src/rendering/record-frames.ts
import { getContainerFormats } from '../src/rendering/video-from-frames';

const videoAppPath = join(__dirname, '..', '..', '..', 'examples', '0-dependencies');
const outputPath = join(__dirname, 'output');
const expectedBasePath = join(outputPath, 'expected');
const actualBasePath = join(outputPath, 'actual');

const mockHelpFunction = jest.fn();

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
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    await callMain({
      action: 'render-formats',
    });

    const containerFormats = await getContainerFormats();

    // Go through all container formats and check if they are listed
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
    
    const actual = fs.readFileSync(actualPath);
    const expected = fs.readFileSync(join(expectedBasePath, '0-dependencies.mp4'));
    expect(Buffer.compare(expected, actual)).toBe(0);
  });
  
  it('should render a local video app with the highest quality by serving it', async () => {
    const actualPath = join(actualBasePath, '0-dependencies-hq.mp4');
    
    await callMain({
      action: 'render',
      videoAppPathOrUrl: videoAppPath,
      output: actualPath,
      renderQuality: 100,
    });
    
    const actual = fs.readFileSync(actualPath);
    const expected = fs.readFileSync(join(expectedBasePath, '0-dependencies-hq.mp4'));
    expect(Buffer.compare(expected, actual)).toBe(0);
  });
});

