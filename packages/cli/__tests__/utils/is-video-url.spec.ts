import { isVideoAppUrl } from '../../src/utils/is-video-url';

describe('isVideoAppUrl', () => {
  it('should return true for a valid http video app url', () => {
    expect(isVideoAppUrl('http://localhost:3000')).toEqual(true);
  });

  it('should return true for a valid https video app url', () => {
    expect(isVideoAppUrl('https://localhost:3000')).toEqual(true);
  });

  it('should return false for an invalid video app url', () => {
    expect(isVideoAppUrl('localhost:3000')).toEqual(false);
  });
});