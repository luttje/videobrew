#!/usr/bin/env node
import { buildVideoConfigFromFrames, renderVideo } from './rendering/video-from-frames';
import { recordFrames } from './rendering/record-frames';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { startEditor } from './editor';
import { cwd } from 'process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const DEFAULT_VIDEO_APP_PATH = '.';
const DEFAULT_OUTPUT_PATH = 'out';

const workingDirectory = cwd();

interface IVideoBrewArguments {
  action: string;
  videoAppPath?: string;
  outputPath?: string;
  help?: boolean;
}

export const argumentConfig: ArgumentConfig<IVideoBrewArguments> = {
  action: { type: String, defaultOption: true, description: 'The action to perform. Either "preview", "render" or "help"' },
  videoAppPath: { type: String, alias: 'i', optional: true, description: `The path to the video app. Defaults to "${DEFAULT_VIDEO_APP_PATH}"` },
  outputPath: { type: String, alias: 'o', optional: true, description: `The path to the output directory. Defaults to "${DEFAULT_OUTPUT_PATH}"` },
  help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
};

export const args = parse(argumentConfig, {
  hideMissingArgMessages: true,
  stopAtFirstUnknown: true,
}, true, true);

const log = console.log;

function inform(message: string, chalkFn = chalk.white) {
  log(
    chalkFn.underline('[📼 Videobrew]') +
    chalkFn(` ${message}`)
  );
}

function debug(message: string) {
  inform(message, chalk.gray);
}

function panic(message: string) {
  log(chalk.red(message));
  process.exit(1);
}

async function render(videoAppPath: string, outputPath: string) {
  inform(`Rendering Video app at path: ${videoAppPath}`);
  
  const framesOutputPath = path.join(outputPath, 'frames');
  const {
    framerate,
  } = await recordFrames(videoAppPath, framesOutputPath);

  const videoConfig = await buildVideoConfigFromFrames(framesOutputPath, framerate, outputPath);
  debug(`Rendering with command: ${videoConfig.command}`);

  const output = await renderVideo(videoConfig);

  debug(output);

  await fs.rmSync(framesOutputPath, { recursive: true });

  inform(`Video rendered to ${outputPath}`);
}

async function preview(videoAppPath: string) {
  inform(`Previewing video app at path: ${videoAppPath}`);

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
  let relativeVideoAppPath = args.videoAppPath;

  if (!relativeVideoAppPath) {
    if (args._unknown?.length > 0) {
      relativeVideoAppPath = args._unknown[0];

      inform(`No video app path explicitly provided. Using unnamed argument: ${relativeVideoAppPath}`);
    } else {
      relativeVideoAppPath = DEFAULT_VIDEO_APP_PATH;
      
      inform(`No video app path explicitly provided. Defaulting to: ${relativeVideoAppPath}`);
    }
  }

  let relativeOutputPath = args.outputPath;

  if (!relativeOutputPath) {
    if (args._unknown?.length > 1) {
      relativeOutputPath = args._unknown[1];

      inform(`No output path explicitly provided. Using unnamed argument: ${relativeOutputPath}`);
    } else {
      relativeOutputPath = DEFAULT_OUTPUT_PATH;

      inform(`No output path explicitly provided. Defaulting to: ${relativeOutputPath}`);
    }
  }
  
  const videoAppPath = path.join(workingDirectory, relativeVideoAppPath);
  const videoAppFilePath = path.join(videoAppPath, 'index.html');
  const outputPath = path.join(workingDirectory, relativeOutputPath);

  if (!fs.existsSync(videoAppPath)) {
    panic(`Video app path ${videoAppPath} does not exist! Please provide a valid path to where your video website is located.`);
  }

  if (!fs.existsSync(videoAppFilePath)) {
    panic(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
  }

  if (args.action === 'render') {
    await render(videoAppPath, outputPath);
  } else if (args.action === 'preview') {
    await preview(videoAppPath);
  } else if (args.action === 'help') {
    args._commandLineResults.printHelp();
    process.exit(0);
  } else {
    panic(`Unknown action "${args.action}"! Use "preview" or "render"`);
  }
}

main();