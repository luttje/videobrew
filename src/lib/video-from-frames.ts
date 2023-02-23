import { createFFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export async function fromFrames(frames: Blob[], framerate: number) {
  if(!ffmpeg.isLoaded())
    await ffmpeg.load();

  let frameIndex = 0;
  for (const frame of frames) {
    await ffmpeg.FS(
      'writeFile',
      `${String(frameIndex).padStart(5, '0')}.jpeg`,
      new Uint8Array(await frame.arrayBuffer())
    );
    frameIndex++;
  }

  await ffmpeg.run(
    '-framerate',
    String(framerate),
    '-pattern_type',
    'glob',
    '-i',
    '*.jpeg',
    '-vf',
    'pad=ceil(iw/2)*2:ceil(ih/2)*2',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    'output.mp4'
  );

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const output = new Blob([data.buffer], { type: 'video/mp4' });

  return output;
}