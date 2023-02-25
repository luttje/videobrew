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

export async function buildVideoConfigFromFrames(framesPath: string, framerate: number, outputPath: string): Promise<VideoConfig> {
  const output = `${outputPath}/output.mp4`;
  const ffmpegCommand = shell([
    `${pathToFfmpeg}`,
    `-framerate`, `${framerate}`,
    `-i`, path.join(framesPath, '%08d.jpeg'),
    `-vf`, `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    `-c:v`, `libx264`,
    `-pix_fmt`, `yuv420p`,
    `-y`,
    `${output}`
  ]);

  return {
    output,
    command: ffmpegCommand,
  }
}

export async function renderVideo(videoConfig: VideoConfig) {
  const { stderr } = await execAsync(videoConfig.command, {
    cwd: __dirname,
  });

  return stderr;
}

export async function getContainerFormats() {
  const { stdout } = await execAsync(`${pathToFfmpeg} -formats`, {
    cwd: __dirname,
  });

  return stdout;
}