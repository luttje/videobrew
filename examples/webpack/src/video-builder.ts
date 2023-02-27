import { Frame, FrameCount } from './make-frames';
import { SceneBuilder } from './scene-builder';
import { Video } from './video';
import { Scene } from './scene';

export class VideoBuilder {
  private readonly scenes: Scene[] = [];
  private currentFrameIndex = 0;
  private isBuilt = false;

  constructor(
    private readonly screenElementSelector: string,
    private readonly framerate: number = 30,
  ) { }

  public frameCountFromSeconds(seconds: number): FrameCount {
    return {
      get: () => seconds * this.framerate
    }
  }

  // Creates a frame whilst also storing the html element state before the frame, so it can be reset later
  public addScene(frame: Frame, sceneBuilderCallback: (scene: SceneBuilder) => void) {
    if (this.isBuilt) {
      throw new Error('Cannot add scenes to a video after it has been built');
    }

    const element = document.querySelector(this.screenElementSelector) as HTMLElement;
    
    // Store the state of the element so we can track anything that changes
    const originalElementState = {
      innerHTML: element.innerHTML,
      style: element.style.cssText,
    };

    // Pre-render the frame as the first of the scene
    frame();

    // Call the scene builder to add frames to the scene (pre-rendering them)
    const sceneBuilder = new SceneBuilder();
    sceneBuilderCallback(sceneBuilder);

    // Construct a reset frame that will reset the element to its original state
    const resetFrame = () => {
      element.innerHTML = originalElementState.innerHTML;
      element.style.cssText = originalElementState.style;

      frame();
    }

    const scene = sceneBuilder.build(resetFrame, this.currentFrameIndex);
    this.currentFrameIndex += scene.getFrameCount();

    this.scenes.push(scene);

    return this;
  }

  public build() {
    this.isBuilt = true;
    return new Video(this.scenes);
  }
}