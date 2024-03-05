import { execSync, ChildProcess } from 'child_process';
import { spawn } from 'cross-spawn';
import { cwd } from 'process';
import treeKill from 'tree-kill';

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

/**
 * Sets up process listeners on a process.
 * 
 * @param {ChildProcess} process The process to set up listeners on.
 * @param {string} successMessage The message to log when the process exits successfully.
 * @param {string} errorMessagePrefix The prefix for the message to log when the process exits with an error.
 */
export function setupProcessListeners(process, successMessage, errorMessagePrefix) {
  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  process.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  process.on('exit', (code, signal) => {
    if (code) {
      console.error(`${errorMessagePrefix} exited with code ${code}`);
    } else if (signal) {
      console.log(`${errorMessagePrefix} was killed with signal ${signal}`);
    } else {
      console.log(successMessage);
    }
  });

  process.on('error', (error) => {
    console.error(`Error in ${errorMessagePrefix}:`, error);
  });
}

/**
 * Spawns a command, returning a promise that resolves when the process exits successfully and rejects when the process exits with an error.
 * 
 * @param {string} command The command to run.
 * @param {string[]} args The arguments to pass to the command.
 * @param {string} successMessage The message to log when the process exits successfully.
 * @param {string} errorMessagePrefix The prefix for the message to log when the process exits with an error.
 */
export async function spawnCommand(command, args, successMessage, errorMessagePrefix) {
  console.log(`Running ${command}...`);
  
  const process = spawn(command, args);
  setupProcessListeners(process, successMessage, errorMessagePrefix);

  return new Promise((resolve, reject) => {
    process.on('exit', (code) => {
      if (code) {
        reject(new Error(`${errorMessagePrefix} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Spawns a command, moving on right away and giving a callback to kill the process.
 * 
 * @param {string} command The command to run.
 * @param {string[]} args The arguments to pass to the command.
 * @param {string} successMessage The message to log when the process exits successfully.
 * @param {string} errorMessagePrefix The prefix for the message to log when the process exits with an error.
 */
export async function spawnCommandAndMoveOn(command, args, successMessage, errorMessagePrefix) {
  console.log(`Running ${command}...`);

  const process = spawn(command, args);
  setupProcessListeners(process, successMessage, errorMessagePrefix);

  return () => treeKill(process.pid);
}