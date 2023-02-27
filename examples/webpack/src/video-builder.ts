import { Frame, FrameCount } from "./make-frames";
import { Video } from './video';

export class VideoBuilder {
  private readonly videoFrames: Frame[] = [];
  private readonly videoResetFrames: Map<number, Frame> = new Map();

  constructor(
    private readonly screenElementSelector: string,
    private readonly framerate: number = 30,
  ) { }

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

  public build() {
    return new Video(this.videoFrames, this.videoResetFrames);
  }
}