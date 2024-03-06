import pathToFfmpeg from 'ffmpeg-static';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function getVideoSsim(expectedPath: string, actualPath: string) {
  const command = `${pathToFfmpeg} -i ${expectedPath} -i ${actualPath} -lavfi ssim -f null -`;
  const result = (await execAsync(command)).stderr;

  const regex = /All:(\d+\.\d+)/;
  const match = result.match(regex);

  return parseFloat(match![1]);
};
