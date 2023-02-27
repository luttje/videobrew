import pathToFfmpeg from 'ffmpeg-static';
import { shell } from '../utils/shell';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);

export type VideoConfig = {
  output: string;
  command: string;
}

export type VideoFormat = {
  extension: string;
  name: string;
}

export type VideoProgressCallback = (progress: number) => void;

export async function buildVideoConfigFromFrames(
  framesPath: string,
  framerate: number,
  outputPath: string,
  frameExtension: string,
): Promise<VideoConfig> {
  const ffmpegCommand = shell([
    `${pathToFfmpeg}`,
    `-framerate`, `${framerate}`,
    `-i`, path.join(framesPath, `%08d.${frameExtension}`),
    `-vf`, `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    `-c:v`, `libx264`,
    `-pix_fmt`, `yuv420p`,
    `-y`,
    `${outputPath}`
  ]);

  return {
    output: outputPath,
    command: ffmpegCommand,
  }
}

export async function renderVideo(videoConfig: VideoConfig, onProgress?: VideoProgressCallback): Promise<string> {
  return new Promise((resolve, reject) => {
    const { stderr } = exec(videoConfig.command, {
      cwd: __dirname,
    });
    let output = '';

    stderr!.on('data', (data: string) => {
      output += data;
      const match = data.match(/frame=\s*(\d+)/);
      if (match) {
        const progress = parseInt(match[1]);
        onProgress?.(progress);
      }
    });

    stderr!.on('end', () => {
      resolve(output);
    });
  });
}

export async function getContainerFormats(): Promise<VideoFormat[]> {
  const { stdout } = await execAsync(`${pathToFfmpeg} -formats`, {
    cwd: __dirname,
  });

  return stdout
    .split('\r\n')
    .filter(line => line.includes('E '))
    .map(line => line.match(/E\s+(\w+)\s+(.*)/))
    .filter(match => match)
    .map(match => match as RegExpMatchArray)
    .map(match => {
      return {
        extension: match[1],
        name: match[2],
      }
  });
}