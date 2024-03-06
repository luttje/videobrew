#!/usr/bin/env node
import { buildVideoConfigFromFrames, getContainerFormats, renderVideo, VideoFormat } from './rendering/video-from-frames.js';
import { ensurePlaywrightInstalled, testPlaywrightInstallationWorking } from './utils/install-playwright.js';
import { startEditor, getEditorInstallPath, getEditorInstaller, EDITOR_PACKAGE_NAME } from './editor.js';
import { getExtensionByQuality, recordFrames } from './rendering/record-frames.js';
import { createLocalWebServer, LocalWebServerInstance } from './server.js';
import { inform, debug, panic, newlines } from './utils/logging.js';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { isVideoAppUrl } from './utils/is-video-url.js';
import { AsciiTable3 } from 'ascii-table3';
import { SingleBar } from 'cli-progress';
import nodeCleanup from 'node-cleanup';
import { exec } from 'child_process';
import prompts from 'prompts';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export const CLI_PACKAGE_NAME = '@videobrew/cli';

const DEFAULT_VIDEO_APP_PATH = '.';
const DEFAULT_OUTPUT_PATH = 'out/my-video.mp4';
const DEFAULT_QUALITY = 90;

const EXAMPLE_VIDEO_APP_PATH = './video';
const EXAMPLE_VIDEO_APP_URL = 'https://example.test/video';
const EXAMPLE_OUTPUT_PATH = './rendered/video.mp4';

export interface IVideoBrewArguments {
  action: string;
  videoAppPathOrUrl?: string;
  output?: string;
  renderQuality?: number;
  help?: boolean;
}

export const argumentConfig: ArgumentConfig<IVideoBrewArguments> = {
  action: { type: String, defaultOption: true, description: 'Action to perform. Either "preview", "render", "render-formats" or "help"' },
  videoAppPathOrUrl: { type: String, alias: 'i', optional: true, description: `Relative path or absolute URL to the video app. Defaults to "${DEFAULT_VIDEO_APP_PATH}"` },
  output: { type: String, alias: 'o', optional: true, description: `Relative path to the output directory. Defaults to "${DEFAULT_OUTPUT_PATH}"` },
  renderQuality: { type: Number, alias: 'q', optional: true, description: `Quality of the rendered video. 0 is the lowest quality, 100 is the highest quality. Defaults to ${DEFAULT_QUALITY}` },
  help: { type: Boolean, optional: true, alias: 'h', description: 'Causes this usage guide to print' },
};

function parseArguments() {
  const actionsTable =
  new AsciiTable3()
    .addRowMatrix([
      [chalk.bold('preview'), 'Preview the video app in the browser'],
      [chalk.bold('render'), 'Render the video app to a video file'],
      [chalk.bold('render-formats'), 'List all supported video render formats'],
    ])
      .setStyle('none');
  
    console.log(chalk.bold.bgRedBright('‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ \n  📼 Videobrew  \n‌‌ ‌‌ ‌‌  ‌‌ ‌‌ ‌‌‌‌ ‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ ‌‌ \n'));

  return parse(argumentConfig, {
    hideMissingArgMessages: true,
    stopAtFirstUnknown: true,
    showHelpWhenArgsMissing: true,

    headerContentSections: [
      {
        content: 'Create videos using web technologies.',
      },
      {
        header: 'Usage',
        content: [
          '$ videobrew <action> [options]',
        ],
      },
      {
        header: 'Actions',
        content: actionsTable.toString().split('\n'),
      },
    ],
    footerContentSections: [
      {
        header: 'Examples',
        content: [
          chalk.bold('Open a video app located in the current working directory in the browser:'),
          '$ videobrew preview',
          '',
          chalk.bold('Open a video app being served at an URL in the browser:'),
          `$ videobrew preview ${EXAMPLE_VIDEO_APP_URL}`,
          chalk.bgRed('Note:') + ' This will only work if the video app server has CORS enabled.',
          '',
          chalk.bold(`Render a video app in the current working directory to ${DEFAULT_OUTPUT_PATH}:`),
          '$ videobrew render',
          '',
          chalk.bold(`Render a low quality video app in a subdirectory to "${EXAMPLE_OUTPUT_PATH}":`),
          `$ videobrew render --renderQuality 0 ${EXAMPLE_VIDEO_APP_PATH} ${EXAMPLE_OUTPUT_PATH}`,
          chalk.bold('or:'),
          `$ videobrew render -i ${EXAMPLE_VIDEO_APP_PATH} -o ${EXAMPLE_OUTPUT_PATH}`,
          chalk.bold('or:'),
          `$ videobrew render --videoAppPathOrUrl ${EXAMPLE_VIDEO_APP_PATH} --output ${EXAMPLE_OUTPUT_PATH}`,
          '',
          chalk.bold('Render a video app, currently being served at a URL, to a video file:'),
          `$ videobrew render ${EXAMPLE_VIDEO_APP_URL}`,
        ],
      },
      {
        content: [
          'For more information, see https://github.com/luttje/videobrew/',
        ],
      },
    ],
  }, true, true);
}

async function showRenderFormats(containerFormats: VideoFormat[]) {
  const formatTable =
  new AsciiTable3()
      .setStyle('none');
  
  containerFormats
    .forEach(format => {
      formatTable.addRow(format.extension, format.name);
    });
  
  inform('Supported render formats:');
  inform(formatTable.toString(), undefined, true);
  inform('To render as one of these formats suffix the output path with the desired format extension.', undefined, true);
  inform('\n(These are the container formats as reported by ffmpeg)', chalk.italic.gray, true);
}

async function render(videoAppUrl: string, outputPath: string, renderQuality: number) {  
  const outputDirectory = path.resolve(path.dirname(outputPath));
  fs.mkdirSync(outputDirectory, { recursive: true });

  newlines();
  inform(`Step (1/2) Rendering frames:`);
  const progressBarFrames = new SingleBar({
    format: 'Rendering frames [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} frames',
    hideCursor: true,
  });

  const framesOutputPath = fs.mkdtempSync(path.join(outputDirectory, '~tmp-'));
  let totalFrames = 0;
  const {
    framerate,
  } = await recordFrames(videoAppUrl, framesOutputPath, renderQuality, (currentFrame, max) => {
    if (currentFrame === 0) {
      totalFrames = max;
      progressBarFrames.start(max, currentFrame);
    }
    
    progressBarFrames.update(currentFrame);
  });

  progressBarFrames.update(totalFrames);
  progressBarFrames.stop();

  const videoConfig = await buildVideoConfigFromFrames(
    framesOutputPath,
    framerate,
    outputPath,
    getExtensionByQuality(renderQuality),
  );
  
  newlines();
  inform(`Step (2/2) Rendering video from frames:`);
  const progressBarRender = new SingleBar({
    format: 'Rendering video [{bar}] {percentage}% | ETA: {eta}s',
    hideCursor: true,
  });
  
  debug(`Rendering with command: ${videoConfig.command}`);
  
  progressBarRender.start(100, 0);

  const output = await renderVideo(videoConfig, (percentage) => {
    progressBarRender.update(percentage);
  });

  progressBarRender.update(100);
  progressBarRender.stop();

  debug(output);

  fs.rmSync(framesOutputPath, { recursive: true });

  newlines();
  inform(
    `Video rendered successfully! 🎉
    \nYou can find your video here:\n> ` +
    chalk.underline(`${outputPath}`),
    chalk.green
  );
}

async function getCliInstalledGlobally() {
  return new Promise<boolean>((resolve, reject) => {
    exec(`npm list -g ${CLI_PACKAGE_NAME} --json`, (exception, stdout, stderr) => {
      if (exception) {
        resolve(false);
        return;
      }

      if (stderr) {
        resolve(false);
        return;
      }

      const installed = JSON.parse(stdout).dependencies[CLI_PACKAGE_NAME];
      resolve(installed !== undefined);
    });
  });
}

async function confirmPreview() {
  const cliInstalledGlobally = await getCliInstalledGlobally();
  const executePreview = async (videoAppUrl: string) => await preview(videoAppUrl, cliInstalledGlobally);

  if (await getEditorInstallPath(cliInstalledGlobally))
    return executePreview;
  
  inform(`To preview your video app, you need to install the '${chalk.green(EDITOR_PACKAGE_NAME)}' package`, chalk.red);
  const installer = getEditorInstaller(cliInstalledGlobally);
  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: `Would you like to install the '${chalk.green(EDITOR_PACKAGE_NAME)}' package now? (Runs '${chalk.green(installer.command)}')`,
    initial: true,
  });

  if (!response.confirmed)
    return null;
  
  await installer.install();

  return executePreview;
}

async function preview(videoAppUrl: string, cliInstalledGlobally: boolean) {
  const { server, host, port } = await startEditor(videoAppUrl, cliInstalledGlobally);
  let interval: NodeJS.Timeout;
  let isRestarting = false;

  // When the server fails, restart it (this is a workaround for errors caused by `watch` rebuilding the editor with different filenames)
  const restart = async () => {
    clearInterval(interval);

    if (isRestarting) return;
    isRestarting = true;
    
    inform(`Restarting server...`, chalk.yellow);
    server.kill();

    await preview(videoAppUrl, cliInstalledGlobally);
  };

  // While the server is running, keep checking it to see if it crashed
  interval = setInterval(async () => {
    try {
      const result = await fetch(`http://${host}:${port}/health`);

      if (result.status !== 200)
        restart();
    } catch (e) {
      restart();
    }
  }, 1000);


  server.stdout!.on('data', (data) => {
    if (!data.includes('http://') && !data.includes('https://')) {
      data = data.toString().replace(`${host}:${port}`, `http://${host}:${port}`);
    }

    inform(`Editor Server: ${data}`, chalk.yellow);
  });

  server.stderr!.on('data', (data) => {
    inform(`Editor Server Error: ${data}`, chalk.red);
    restart();
  });

  server.on('close', (code) => {
    inform(`Editor Server exited with code ${code}`);
  });
}

export async function main(args: ReturnType<typeof parseArguments>) {
  if (args.action === 'help') {
    args._commandLineResults.printHelp();
    return;
  }

  inform('Checking Playwright browsers installation (this may take a minute)...');
  const result = await ensurePlaywrightInstalled();

  if (result.installedOrUpdated) {
    inform('Playwright browsers installation or update complete!', chalk.green);
    inform('Checking if Playwright installation is working...');

    const isWorking = await testPlaywrightInstallationWorking();

    if (!isWorking) {
      panic('Playwright installation is not working! Please try running the command again.');
    }
    
    inform('Playwright installation is working!', chalk.green);
  }

  const containerFormats = await getContainerFormats();
  
  if (args.action === 'render-formats') {
    return await showRenderFormats(containerFormats);
  }

  let relativeVideoAppPath = args.videoAppPathOrUrl;

  if (!relativeVideoAppPath) {
    if (args._unknown?.length > 0) {
      const videoAppPathOrUrl = args._unknown.find(arg => {
        const extension = path.extname(arg);

        return !containerFormats.some(format => `.${format.extension}` === extension);
      });

      if (videoAppPathOrUrl) {
        relativeVideoAppPath = videoAppPathOrUrl;

        inform(`Video app path chosen: ${relativeVideoAppPath}`);
      }
    }
    
    if (!relativeVideoAppPath) {
      relativeVideoAppPath = DEFAULT_VIDEO_APP_PATH;
      
      inform(`Video app path chosen: ${relativeVideoAppPath} (default)`);
    }
  }
  
  const isVideoAppAtUrl = isVideoAppUrl(relativeVideoAppPath);
  let videoAppPathOrUrl = relativeVideoAppPath;

  if (isVideoAppAtUrl) {
    const response = await fetch(videoAppPathOrUrl);

    if (!response.ok)
      panic(`Video app URL ${videoAppPathOrUrl} is not responding with 200 OK! Please provide a valid URL to where your video app is being served.`);
  } else {
    videoAppPathOrUrl = path.resolve(relativeVideoAppPath);
    debug(`Video app full path: ${videoAppPathOrUrl}`);
    
    const videoAppFilePath = path.join(videoAppPathOrUrl, 'index.html');
    
    if (!fs.existsSync(videoAppPathOrUrl)) {
      panic(`Video app path ${videoAppPathOrUrl} does not exist! Please provide a valid path to where your video app is located.`);
    }

    if (!fs.existsSync(videoAppFilePath)) {
      panic(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video app is located.`);
    }
  }

  let videoAppUrl = videoAppPathOrUrl;
  let serverInstance: LocalWebServerInstance | undefined;

  const startLocalServer = async () => {
    if (isVideoAppAtUrl)
      return;
    
    serverInstance = await createLocalWebServer(videoAppPathOrUrl);
    videoAppUrl = serverInstance.url;

    debug(`Serving video app at URL: ${videoAppUrl}`);
  }

  const stopLocalServer = async () => {
    if (!serverInstance)
      return;
    
    serverInstance.close();
    debug(`Stopped local server`);
  }

  nodeCleanup(function (exitCode, signal) {
    stopLocalServer();
  });

  if (args.action === 'render') {
    let relativeOutputPath = args.output;
  
    if (!relativeOutputPath) {
      if (args._unknown?.length > 0) {
        const outputPath = args._unknown.find(arg => {
          const extension = path.extname(arg);
  
          return containerFormats.some(format => `.${format.extension}` === extension);
        });
  
        if (outputPath) {
          relativeOutputPath = outputPath;
  
          inform(`Output path chosen: ${relativeOutputPath}`);
        }
      }
      
      if (!relativeOutputPath){
        relativeOutputPath = DEFAULT_OUTPUT_PATH;
  
        inform(`Output path chosen: ${relativeOutputPath} (default)`);
      }
    }
  
    const quality = args.renderQuality ?? DEFAULT_QUALITY;
  
    if (quality < 0 || quality > 100)
      panic(`Render quality must be between 0 and 100! (Provided: ${quality})`);
    
    inform(`Render quality chosen: ${quality}% ${(args.renderQuality === undefined ? '(default)' : '')}`);
  
    const output = path.resolve(relativeOutputPath);
    debug(`Output full path: ${output}`);
  
    await startLocalServer();

    await render(videoAppUrl, output, quality);

    await stopLocalServer();
  } else if (args.action === 'preview') {
    inform(`Preparing @videobrew/editor...`);
  
    const executePreview = await confirmPreview();
    
    if (!executePreview) {
      return panic('Aborting preview');
    }

    await startLocalServer();

    await executePreview(videoAppUrl);
  } else {
    panic(`Unknown action "${args.action}"! Use "preview", "render" or "render-formats`);
  }
}

if (!process.env.VIDEOBREW_UNIT_TESTING)
  main(parseArguments());