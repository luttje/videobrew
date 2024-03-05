import { cwd } from 'process';
import {
  convertWindowsToUnixNewline,
  convertWindowsToUnixPath,
  runNpm,
  run,
  setupProcessListeners,
  spawnCommand,
  spawnCommandAndMoveOn,
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

describe('setupProcessListeners', () => {
  it('logs success message on successful exit', () => {
    const process = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
    };

    jest.spyOn(global.console, "log")
    setupProcessListeners(process, 'Success!', 'Test');
    process.on.mock.calls[0][1](0, null);

    expect(console.log).toHaveBeenCalledWith('Success!');
  });
  
  it('logs error message on exit with code', () => {
    const process = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
    };

    jest.spyOn(global.console, "error")
    setupProcessListeners(process, 'Success!', 'Test');
    process.on.mock.calls[0][1](1, null);

    expect(console.error).toHaveBeenCalledWith('Test exited with code 1');
  });
    
  it('logs error message on exit with signal', () => {
    const process = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
    };

    jest.spyOn(global.console, "log")
    setupProcessListeners(process, 'Success!', 'Test');
    process.on.mock.calls[0][1](null, 'SIGTERM');

    expect(console.log).toHaveBeenCalledWith('Test was killed with signal SIGTERM');
  });
});
