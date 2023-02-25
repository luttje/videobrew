#!/usr/bin/env node
import { buildVideoConfigFromFrames, getContainerFormats, renderVideo } from './rendering/video-from-frames';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { recordFrames } from './rendering/record-frames';
import { inform, debug, panic } from './utils/logging';
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
          chalk.bold('Render a video app being served at an URL to a video file:'),
          `$ videobrew render ${EXAMPLE_VIDEO_APP_URL}`,
          chalk.bgRed('Note:') + ' This will only work if the video app server has CORS enabled.',
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

async function showRenderFormats() {
  const formatTable =
  new AsciiTable3()
      .setStyle('none');
  
  const containerFormats = await getContainerFormats();

  containerFormats
    .split('\r\n')
    .filter(line => line.includes('E '))
    .map(line => line.match(/E\s+(\w+)\s+(.*)/))
    .filter(match => match)
    .map(match => match as RegExpMatchArray)
    .forEach(match => {
      formatTable.addRow(match[1], match[2]);
    });
  
  inform('Supported render formats:');
  inform(formatTable.toString(), undefined, true);
  inform('To render as one of these formats suffix the output path with the desired format extension.', undefined, true);
  inform('\n(These are the container formats as reported by ffmpeg)', chalk.italic.gray, true);
}

async function render(videoAppPathOrUrl: string, outputPath: string) {
  inform(`Rendering Video app at path: ${videoAppPathOrUrl}`);
  
  const framesOutputPath = path.join(outputPath, 'frames');
  const {
    framerate,
  } = await recordFrames(videoAppPathOrUrl, framesOutputPath);

  const videoConfig = await buildVideoConfigFromFrames(framesOutputPath, framerate, outputPath);
  debug(`Rendering with command: ${videoConfig.command}`);

  const output = await renderVideo(videoConfig);

  debug(output);

  await fs.rmSync(framesOutputPath, { recursive: true });

  inform(`Video rendered to ${output}`);
}

async function preview(videoAppPathOrUrl: string) {
  inform(`Previewing video app at path: ${videoAppPathOrUrl}`);

  // TODO: Serve the video app @ http://localhost:8088

  const editorServer = await startEditor();

  editorServer.stdout!.on('data', (data) => {
    inform(`Editor Server: ${data}`);
  });

  editorServer.on('close', (code) => {
    inform(`Editor Server exited with code ${code}`);
    process.exit(code ?? 0);
  });

  editorServer.on('error', (err) => {
    inform(`Editor Server ${err}`, chalk.red);
  });
}

async function main() {
  const args = await parseArguments();
  
  if (args.action === 'render-formats') {
    return await showRenderFormats();
  }

  let relativeVideoAppPath = args.videoAppPathOrUrl;

  if (!relativeVideoAppPath) {
    if (args._unknown?.length > 0) {
      // Find an unnamed argument that looks like a path or URL, and does not end in one of the known file extensions
      relativeVideoAppPath = args._unknown[0];

      inform(`No video app path explicitly provided. Using unnamed argument: ${relativeVideoAppPath}`);
    } else {
      relativeVideoAppPath = DEFAULT_VIDEO_APP_PATH;
      
      inform(`No video app path explicitly provided. Defaulting to: ${relativeVideoAppPath}`);
    }
  }

  let relativeOutputPath = args.output;

  if (!relativeOutputPath) {
    if (args._unknown?.length > 1) {
      relativeOutputPath = args._unknown[1];

      inform(`No output path explicitly provided. Using unnamed argument: ${relativeOutputPath}`);
    } else {
      relativeOutputPath = DEFAULT_OUTPUT_PATH;

      inform(`No output path explicitly provided. Defaulting to: ${relativeOutputPath}`);
    }
  }
  
  const videoAppPathOrUrl = path.join(workingDirectory, relativeVideoAppPath);
  const videoAppFilePath = path.join(videoAppPathOrUrl, 'index.html');
  const output = path.join(workingDirectory, relativeOutputPath);

  if (!fs.existsSync(videoAppPathOrUrl)) {
    panic(`Video app path ${videoAppPathOrUrl} does not exist! Please provide a valid path to where your video website is located.`);
  }

  if (!fs.existsSync(videoAppFilePath)) {
    panic(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
  }

  if (args.action === 'render') {
    await render(videoAppPathOrUrl, output);
  } else if (args.action === 'preview') {
    await preview(videoAppPathOrUrl);
  } else if (args.action === 'help') {
    args._commandLineResults.printHelp();
    process.exit(0);
  } else {
    panic(`Unknown action "${args.action}"! Use "preview", "render" or "render-formats`);
  }
}

main();