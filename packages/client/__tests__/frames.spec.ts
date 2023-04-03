import { FrameCount } from '../src/frames';

describe('FrameCount', () => {
  const frameCounts = [
    { fps: 60, frames: 60, seconds: 1 },
    { fps: 30, frames: 60, seconds: 2 },
    { fps: 10, frames: 1, seconds: 0.1 },
    { fps: 1, frames: 1, seconds: 1 },
  ];
  
  describe('fromX', () => {
    it('should throw an error if the number of ticks is less than 1', () => {
      expect(() => FrameCount.fromMilliseconds(0)).toThrow();
      expect(() => FrameCount.fromMilliseconds(-1)).toThrow();
      expect(() => FrameCount.fromMilliseconds(-100)).toThrow();
      expect(() => FrameCount.fromSeconds(0)).toThrow();
      expect(() => FrameCount.fromSeconds(-1)).toThrow();
      expect(() => FrameCount.fromSeconds(-100)).toThrow();
    });

    frameCounts.forEach(({ fps, frames, seconds }) => {
      it(`should return ${frames} frames at ${fps} fps for fromMilliseconds`, () => {
        const frameCount = FrameCount.fromMilliseconds(seconds * 1000);
        expect(frameCount.get(fps)).toBe(frames);
      });
    
      it(`should return ${frames} frames at ${fps} fps for fromSeconds`, () => {
        const frameCount = FrameCount.fromSeconds(seconds);
        expect(frameCount.get(fps)).toBe(frames);
      });
    });
  });
  
  describe('getSeconds', () => {
    frameCounts.forEach(({ fps, frames, seconds }) => {
      it(`should return ${seconds} seconds at ${fps} fps for fromMilliseconds`, () => {
        const frameCount = FrameCount.fromMilliseconds(seconds * 1000);
        expect(frameCount.getSeconds(fps)).toBe(seconds);
      });

      it(`should return ${seconds} seconds at ${fps} fps for fromSeconds`, () => {
        const frameCount = FrameCount.fromSeconds(seconds);
        expect(frameCount.getSeconds(fps)).toBe(seconds);
      });
    });
  });

  describe('getFrameStartDelay', () => {
    // TODO: Document this function and test if this is a valid test case. (Copilot generated it)
    it(`should return delay of -0.016666666666666666 at 60 fps for 10 seconds`, () => {
      const frameCount = FrameCount.fromSeconds(10);
      expect(frameCount.getFrameStartDelay(60, 0)).toBeCloseTo(-0.017);
    });
  });
});