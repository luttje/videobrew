import { Frame } from './make-frames';

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
   
  public renderFrame(frame: number) {
    // Reset to how the scene started
    this.resetFrame();

    // Then activate all frames up to and including the given frame
    for (let i = 0; i <= frame; i++) {
      if (this.frames[i])
        this.frames[i]?.();
    }
  }
}