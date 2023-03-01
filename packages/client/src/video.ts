import { Scene } from './scene.js';

export class Video {
  private readonly sceneLookup: { [key: number]: Scene } = {};

  constructor(
    private readonly scenes: Scene[],
    private readonly framerate: number,
  ) {
    this.buildLookup();
  }

  private buildLookup() {
    let frameIndex = 0;

    for (let scene of this.scenes) {
      for (let i = 0; i < scene.getFrameCount(); i++) {
        this.sceneLookup[frameIndex] = scene;
        frameIndex++;
      }
    }
  }

  public getFramerate() {
    return this.framerate;
  }

  public getFrameCount() {
    let frameCount = 0;

    for (let scene of this.scenes) {
      frameCount += scene.getFrameCount();
    }

    return frameCount;
  }

  public renderFrame(frame: number) {
    const scene = this.getSceneForFrame(frame);

    if (!scene) {
      throw new Error(`Frame index ${frame} is out of range`);
    }

    scene.renderFrame(
      scene.normalizeFrameIndex(frame)
    );
  }

  private getSceneForFrame(frame: number) {
    return this.sceneLookup[frame];
  }
}