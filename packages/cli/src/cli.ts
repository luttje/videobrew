#!/usr/bin/env node
import { buildVideoConfigFromFrames, getContainerFormats, renderVideo, VideoFormat } from './rendering/video-from-frames';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { recordFrames } from './rendering/record-frames';
import { inform, debug, panic } from './utils/logging';
import { createLocalWebServer, LocalWebServerInstance } from './server';
import { isVideoAppUrl } from './utils/is-video-url';
import { AsciiTable3 } from 'ascii-table3';
import { startEditor } from './editor';
import { cwd } from 'process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const DEFAULT_VIDEO_APP_PATH = '.';
const DEFAULT_OUTPUT_PATH = 'out/my-video.mp4';

const EXAMPLE_VIDEO_APP_PATH = './video';
const EXAMPLE_VIDEO_APP_URL = 'https://example.test/video';
const EXAMPLE_OUTPUT_PATH = './rendered/video.mp4';

const workingDirectory = cwd();

interface IVideoBrewArguments {
  action: string;
  videoAppPathOrUrl?: string;
  output?: string;
  help?: boolean;
}

export const argumentConfig: ArgumentConfig<IVideoBrewArguments> = {
  action: { type: String, defaultOption: true, description: 'Action to perform. Either "preview", "render", "render-formats" or "help"' },
  videoAppPathOrUrl: { type: String, alias: 'i', optional: true, description: `Relative path or absolute URL to the video app. Defaults to "${DEFAULT_VIDEO_APP_PATH}"` },
  output: { type: String, alias: 'o', optional: true, description: `Relative path to the output directory. Defaults to "${DEFAULT_OUTPUT_PATH}"` },
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

  return parse(argumentConfig, {
    hideMissingArgMessages: true,
    stopAtFirstUnknown: true,
    showHelpWhenArgsMissing: true,

    headerContentSections: [
      {
        header: '📼 Videobrew',
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
          chalk.bold(`Render a video app in a subdirectory to "${EXAMPLE_OUTPUT_PATH}":`),
          `$ videobrew render ${EXAMPLE_VIDEO_APP_PATH} ${EXAMPLE_OUTPUT_PATH}`,
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

async function render(videoAppUrl: string, outputPath: string) {  
  const outputDirectory = path.dirname(outputPath);
  await fs.mkdirSync(outputDirectory, { recursive: true });
  const framesOutputPath = await fs.mkdtempSync(path.join(outputDirectory, '~tmp-'));
  const {
    framerate,
  } = await recordFrames(videoAppUrl, framesOutputPath);

  const videoConfig = await buildVideoConfigFromFrames(framesOutputPath, framerate, outputPath);
  debug(`Rendering with command: ${videoConfig.command}`);

  const output = await renderVideo(videoConfig);

  debug(output);

  await fs.rmSync(framesOutputPath, { recursive: true });

  inform(`Video rendered to ${outputPath}`);
}

async function preview(videoAppUrl: string) {
  const { server, host, port } = await startEditor(videoAppUrl);

  server.stdout!.on('data', (data) => {
    if (!data.includes('http://')) {
      data = data.toString().replace(`${host}:${port}`, `http://${host}:${port}`);
    }

    inform(`Editor Server: ${data}`);
  });

  server.on('close', (code) => {
    inform(`Editor Server exited with code ${code}`);
  });

  server.on('error', (err) => {
    inform(`Editor Server ${err}`, chalk.red);
  });
}

async function main() {
  const args = await parseArguments();
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

  const isVideoAppAtUrl = isVideoAppUrl(relativeVideoAppPath);
  let videoAppPathOrUrl = relativeVideoAppPath;

  if (isVideoAppAtUrl) {
    const response = await fetch(videoAppPathOrUrl);

    if (!response.ok)
      panic(`Video app URL ${videoAppPathOrUrl} is not responding with 200 OK! Please provide a valid URL to where your video app is being served.`);
  } else {
    videoAppPathOrUrl = path.join(workingDirectory, relativeVideoAppPath);
    debug(`Video app full path: ${videoAppPathOrUrl}`);
    
    const videoAppFilePath = path.join(videoAppPathOrUrl, 'index.html');
    
    if (!fs.existsSync(videoAppPathOrUrl)) {
      panic(`Video app path ${videoAppPathOrUrl} does not exist! Please provide a valid path to where your video app is located.`);
    }

    if (!fs.existsSync(videoAppFilePath)) {
      panic(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video app is located.`);
    }
  }

  const output = path.join(workingDirectory, relativeOutputPath);
  debug(`Output full path: ${output}`);

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

  var nodeCleanup = require('node-cleanup');
  nodeCleanup(function (exitCode: number, signal: any) {
    stopLocalServer();
  });

  if (args.action === 'render') {
    await startLocalServer();

    inform(`Rendering...`);
    await render(videoAppUrl, output);

    await stopLocalServer();
  } else if (args.action === 'preview') {
    await startLocalServer();

    inform(`Previewing...`);
    await preview(videoAppUrl);
  } else if (args.action === 'help') {
    args._commandLineResults.printHelp();
  } else {
    panic(`Unknown action "${args.action}"! Use "preview", "render" or "render-formats`);
  }
}

main();