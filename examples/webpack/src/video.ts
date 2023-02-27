import { Frame, FrameCount } from "./make-frames";

export class Video {
  constructor(
    private readonly videoFrames: Frame[],
    private readonly videoResetFrames: Map<number, Frame>,
  ) { }

  public getFrameCount() {
    return this.videoFrames.length;
  }

  // First try find the reset frame before the given frame, activate it, 
  // then activate all frames up to and including the given frame
  public renderFrame(frame: number) {
    let resetFrame = frame;

    while (resetFrame >= 0) {
      if (this.videoResetFrames.has(resetFrame)) {
        this.videoResetFrames.get(resetFrame)?.();
        break;
      }

      resetFrame--;
    }

    for (let i = resetFrame; i <= frame; i++) {
      if (this.videoFrames[i])
        this.videoFrames[i]?.();
    }
  }
}