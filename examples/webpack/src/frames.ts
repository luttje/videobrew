export type Frame = (() => void) | null;

export class FrameCount {
  private static readonly ticksPerSecond: number = 100;

  constructor(
    private readonly ticks: number,
  ) { 
    if (ticks < 1)
      throw new Error('Frame count must be greater than 0');
  }

  public static fromFrames(frames: number) {
    return new FrameCount(frames);
  }

  public static fromMilliseconds(milliseconds: number) {
    return new FrameCount(milliseconds * this.ticksPerSecond / 1000);
  }

  public static fromSeconds(seconds: number) {
    return new FrameCount(seconds * this.ticksPerSecond);
  }

  public get(framerate: number) {
    return Math.ceil(this.ticks * (framerate / FrameCount.ticksPerSecond));
  }
}