import { execSync } from 'child_process';

export function runNpm(command, cwd) {
  return run(`npm ${command}`, cwd);
}

export function run(programWithArguments, cwd) {
  execSync(`${programWithArguments}`, {
    cwd: cwd,
    stdio: 'inherit',
  });
}
