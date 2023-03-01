import { Frame } from "./frames";

export class Scene {
  constructor(
    private readonly resetFrame: Frame,
    private readonly firstFrameIndex: number,
    private readonly frames: Frame[],
  ) { }
  
  public getFrameCount() {
    return this.frames.length;
  }

  public normalizeFrameIndex(videoFrame: number) {
    return videoFrame - this.firstFrameIndex;
  }
  
  // Reset to how the scene started
  public reset() {
    this.resetFrame();
  }
   
  public renderFrame(frame: number) {
    this.reset();

    // Then activate all frames up to and including the given frame
    for (let i = 0; i <= frame; i++) {
      if (this.frames[i])
        this.frames[i]?.();
    }
  }
}