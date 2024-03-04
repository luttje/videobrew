import { shell } from '../../src/utils/shell';
import { it, expect, describe, vi } from 'vitest';

describe('shell', () => {
  it('should return a string', () => {
    expect(shell(['echo', 'hello'])).toEqual('"echo" "hello"');
  });
});