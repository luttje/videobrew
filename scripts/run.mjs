import { execSync } from 'child_process';

export async function runNpm(command, cwd) {
  execSync(`npm ${command}`, {
    cwd: cwd,
    stdio: 'inherit',
  });
}