import { cwd } from 'process';
import {
  convertWindowsToUnixNewline,
  convertWindowsToUnixPath,
  runNpm,
  run,
} from './run.mjs';

describe('convertWindowsToUnixNewline', () => {
  it('should convert Windows newlines to Unix newlines', () => {
    const windowsString = 'Hello\r\nWorld';
    const unixString = convertWindowsToUnixNewline(windowsString);

    expect(unixString).toBe('Hello\nWorld');
  });

  it('should convert Windows newlines to Unix newlines with a trailing newline', () => {
    const windowsString = 'Hello\r\nWorld\r\n';
    const unixString = convertWindowsToUnixNewline(windowsString);

    expect(unixString).toBe('Hello\nWorld\n');
  });
});

describe('convertWindowsToUnixPath', () => {
  it('should convert a Windows path to a Unix path', () => {
    const windowsPath = 'C:\\Users\\me\\Documents\\file.txt';
    const unixPath = convertWindowsToUnixPath(windowsPath);

    expect(unixPath).toBe('/c/Users/me/Documents/file.txt');
  });

  it('should convert a Windows path to a Unix path with a space in the path', () => {
    const windowsPath = 'C:\\Users\\me\\Documents\\My Folder\\file.txt';
    const unixPath = convertWindowsToUnixPath(windowsPath);

    expect(unixPath).toBe('/c/Users/me/Documents/My Folder/file.txt');
  });

  it('should convert a Windows path to a Unix path with a space in the file name', () => {
    const windowsPath = 'C:\\Users\\me\\Documents\\file name.txt';
    const unixPath = convertWindowsToUnixPath(windowsPath);

    expect(unixPath).toBe('/c/Users/me/Documents/file name.txt');
  });

  it('should convert a Windows path to a Unix path with a trailing newline', () => {
    const windowsPath = 'C:\\Users\\me\\Documents\\file.txt\r\n';
    const unixPath = convertWindowsToUnixPath(windowsPath);

    expect(unixPath).toBe('/c/Users/me/Documents/file.txt\n');
  });
});

describe('runNpm', () => {
  it('should run to check the npm version', () => {
    const version = runNpm('--version', cwd());

    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });
});

describe('run', () => {
  it('should run to check the node version', () => {
    const version = run('node --version', cwd());

    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should work without specifying a working directory', () => {
    let expectedWorkingDirectory = convertWindowsToUnixPath(cwd());
    let actualWorkingDirectory = run('pwd');

    expect(actualWorkingDirectory.trimEnd()).toBe(expectedWorkingDirectory);
  });
});
