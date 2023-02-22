import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export async function fromFrames(frames: Blob[]) {
  await ffmpeg.load();

  let frameIndex = 0;
  for (const frame of frames) {
    await ffmpeg.FS(
      'writeFile',
      `${String(frameIndex).padStart(5, '0')}.jpg`,
      new Uint8Array(await frame.arrayBuffer())
    );
    frameIndex++;

    console.log('Frame', frameIndex);
  }

  await ffmpeg.run(
    '-framerate',
    '30',
    '-pattern_type',
    'glob',
    '-i',
    '*.jpg',
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