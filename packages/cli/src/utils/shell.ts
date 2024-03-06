import { execSync } from "child_process";
import { cwd } from "process";

export function shell(commands: string[]) {
  return commands.map((command) => `"${command}"`).join(' ');
}

/**
 * Runs a command, returning the output.
 * 
 * @param {string} programWithArguments The program and arguments to run.
 * @param {string} workingDirectory The working directory to run the command in. Defaults to the current working directory.
 * 
 * @returns {string} The output of the command.
 */
export function run(programWithArguments: string, workingDirectory: string|undefined = undefined) {
  if (workingDirectory === undefined)
    workingDirectory = cwd();

  return execSync(`${programWithArguments}`, {
    cwd: workingDirectory,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}