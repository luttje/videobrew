
import chalk from 'chalk';
import { newlines, inform, debug, panic } from '../../src/utils/logging';
import { it, expect, describe, vi } from 'vitest';

describe('logging', () => {
  it('should print newlines', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });
    
    newlines(2);

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith('');
    expect(mockLog).toHaveBeenCalledWith('');

    mockLog.mockRestore();
  });

  it('should print a message', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });

    inform('hello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk.white.underline('[📼 Videobrew]') + ' ' +
      chalk.white('hello')
    );

    mockLog.mockRestore();
  });

  it('should not print a debug message when debug environment is not set', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });

    debug('hello');

    expect(mockLog).toHaveBeenCalledTimes(0);

    mockLog.mockRestore();
  });

  it('should print a debug message when debug environment is set', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });
    process.env.DEBUG = 'true';

    debug('hello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk.gray.underline('[📼 Videobrew]') + ' ' +
      chalk.gray('hello')
    );

    mockLog.mockRestore();
  });

  it('should print a panic message', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit() was called');
    });
    
    expect(() => panic('hello')).toThrow('process.exit() was called');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk.red('hello')
    );

    mockExit.mockRestore();
    mockLog.mockRestore();
  });

  it('should print a message without prefix', () => {
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => { });

    inform('hello', chalk.white, true);

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk.white('hello')
    );
    
    mockLog.mockRestore();
  });
});