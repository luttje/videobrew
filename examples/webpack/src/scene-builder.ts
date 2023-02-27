import { Frame } from './make-frames';
import { Scene } from './scene';

export class SceneBuilder {
  private readonly frames: Frame[] = [];
  private isBuilt = false;

  public addToFrames(frame: Frame | Frame[]) {
    if (this.isBuilt) {
      throw new Error('Cannot add frames to a scene after it has been built');
    }

    if (frame instanceof Function) {
      this.frames.push(frame);
      frame();
    } else if (frame instanceof Array) {
      for (let f of frame) {
        this.addToFrames(f);
      }
    } else {
      this.frames.push(null);
    }
  }

  public build(resetFrame: Frame, firstFrameIndex: number) {
    this.isBuilt = true;
    return new Scene(resetFrame, firstFrameIndex, this.frames);
  }
}