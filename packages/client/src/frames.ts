export type Frame = () => void;
export const EmptyFrame: Frame = () => { };

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

  public getSeconds(framerate: number) {
    return this.get(framerate) / framerate;
  }
  
  public getFrameStartDelay(framerate: number, frame: number): number {
    const durationInSeconds = this.getSeconds(framerate);

    // Negative animation-delay value causes animation to skip ahead in the animation.
    // For example a 10 second animation with a delay of - 1.3s would start at the frame at 13 % of the animation.
    return (frame + 1) / this.get(framerate) * -durationInSeconds;
  }
}