import { execSync } from 'child_process';
import { cwd } from 'process';

/**
 * Converts Windows newlines to Unix newlines (e.g. \r\n -> \n).
 * 
 * @param {string} windowsString The possible Windows string to convert.
 * 
 * @returns {string} The Unix string.
 */
export function convertWindowsToUnixNewline(windowsString) {
  return windowsString.replace(/\r\n/g, '\n');
}

/**
 * Converts a Windows path to a Unix path (e.g. C:\Users\me\Documents\file.txt -> /c/Users/me/Documents/file.txt).
 *
 * @param {string} windowsPath The possible Windows path to convert.
 * 
 * @returns {string} The Unix path.
 */
export function convertWindowsToUnixPath(windowsPath) {
  let unixPath = windowsPath;

  unixPath = unixPath.replace(/^[A-Z]:/, (match) => match.toLowerCase());
  unixPath = unixPath.replace(/\\/g, '/');
  unixPath = unixPath.replace(/:/, '');

  if (!unixPath.startsWith('/'))
    unixPath = '/' + unixPath;

  return convertWindowsToUnixNewline(unixPath);
}

/**
 * Runs an npm command, returning the output.
 * 
 * @param {string} command The npm command to run.
 * @param {string} workingDirectory The working directory to run the command in. Defaults to the current working directory.
 * 
 * @returns {string} The output of the command. 
 */
export function runNpm(command, workingDirectory = undefined) {
  return run(`npm ${command}`, workingDirectory);
}

/**
 * Runs a command, returning the output.
 * 
 * @param {string} programWithArguments The program and arguments to run.
 * @param {string} workingDirectory The working directory to run the command in. Defaults to the current working directory.
 * 
 * @returns {string} The output of the command.
 */
export function run(programWithArguments, workingDirectory = undefined) {
  if (workingDirectory === undefined)
    workingDirectory = cwd();

  return execSync(`${programWithArguments}`, {
    cwd: workingDirectory,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}
