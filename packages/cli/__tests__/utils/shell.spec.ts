import { shell } from '../../src/utils/shell';

describe('shell', () => {
  it('should return a string', () => {
    expect(shell(['echo', 'hello'])).toEqual('"echo" "hello"');
  });
});