import { Frame, FrameCount } from "./make-frames";

export class Video {
  private readonly videoFrames: Frame[] = [];
  private readonly videoResetFrames: Map<number, Frame> = new Map();

  constructor(
    private readonly screenElementSelector: string,
    private readonly framerate: number = 30,
  ) { }

  public getFrameCount() {
    return this.videoFrames.length;
  }

  public frameCountFromSeconds(seconds: number): FrameCount {
    return {
      get: () => seconds * this.framerate
    }
  }

  public addToFrames(frame: Frame | Frame[]) {
    if (frame instanceof Function) {
      this.videoFrames.push(frame);
      frame();
    } else if (frame instanceof Array) {
      for (let f of frame) {
        this.addToFrames(f);
      }
    } else {
      this.videoFrames.push(null);
    }
  }

  // Creates a frame whilst also storing the html element state before the frame, so it can be reset later
  public addSceneToFrames(frame: Frame) {
    const element = document.querySelector(this.screenElementSelector) as HTMLElement;
    const currentStyle = element.style.cssText;

    // Create a reset frame that will restore the element to its original state
    const resetFrame = () => {
      element.style.cssText = currentStyle;
    };

    const frameIndex = this.videoFrames.length;
    this.videoResetFrames.set(frameIndex, resetFrame);

    this.addToFrames(frame);
  }

  // First try find the reset frame before the given frame, activate it, then activate all frames up to and including the given frame
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

  public async play(): Promise<void> {
    return new Promise((resolve) => {
      let frame = 0;
      let interval = setInterval(() => {
        this.renderFrame(frame);
        frame++;

        if (frame >= this.videoFrames.length) {
          clearInterval(interval);
          resolve();
        }
      }, 1000 / this.framerate);
    });
  }
}