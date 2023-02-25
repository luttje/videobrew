import pathToFfmpeg from 'ffmpeg-static';
import { shell } from '../utils/shell';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

export async function videoFromFrames(framesPath: string, framerate: number, outputPath: string) {
  const output = `${outputPath}/output.mp4`;
  const videoConfig = shell([
    `${pathToFfmpeg}`,
    `-framerate`, `${framerate}`,
    `-i`, path.join(framesPath, '%08d.jpeg'),
    `-vf`, `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    `-c:v`, `libx264`,
    `-pix_fmt`, `yuv420p`,
    `-y`,
    `${output}`
  ]);

  console.log(`Rendering with command: ${videoConfig}`);

  const { stdout, stderr } = await util.promisify(exec)(videoConfig, {
    cwd: __dirname,
  });
  
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);

  await fs.rmSync(framesPath, { recursive: true });

  return output;
}