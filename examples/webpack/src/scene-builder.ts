import { modifyTransform } from './dom-utils';
import { Frame, FrameCount } from './frames';
import { Scene } from './scene';

export type SceneBuilderCallback = (sceneBuilder: SceneBuilder) => void;

export class SceneBuilder {
  private readonly frames: Frame[] = [];
  private isBuilt = false;

  constructor(
    private readonly framerate: number,
  ) { }

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

    return this;
  }
    
  /**
   * Construct the scene by providing as many callbacks as you want. They frames built by each callback will be run in parallel in the scene.
   */
  public addParallelFrames(
    forDuration: FrameCount,
    ...sceneBuilderCallbacks: SceneBuilderCallback[]
  ) {
    const framesSets: Frame[][] = [];

    for (let i = 0; i < sceneBuilderCallbacks.length; i++) {
      const scene = new SceneBuilder(this.framerate);
      sceneBuilderCallbacks[i](scene);
      framesSets.push(scene.frames);
    }

    const parallelFrames: Frame[] = [];

    for (let i = 0; i < forDuration.get(this.framerate); i++) {
      const frames: Frame[] = [];

      framesSets.forEach(f => {
        if (i < f.length) {
          frames.push(f[i]);
        }
      });

      parallelFrames.push(() => {
        frames.forEach(f => f && f());
      });
    }

    this.addToFrames(parallelFrames);

    return this;
  }

  public addValueTranslationFrames(
    selector: string,
    property: string,
    fromValue: number,
    toValue: number,
    unit: string | null,
    forDuration: FrameCount
  ) {
    for (let i = 0; i < forDuration.get(this.framerate); i++) {
      this.addToFrames(() => {
        const element = document.querySelector(selector) as HTMLElement;
        const value = fromValue + (toValue - fromValue) * ((i + 1) / forDuration.get(this.framerate));
        element.style.setProperty(property, `${value}${unit ?? ''}`);
      });
    }
    
    return this;
  }

  public addValueTransformFrames(
    selector: string,
    property: string,
    forDuration: FrameCount,
    transformCallback: (element: HTMLElement, localFrameIndex: number) => string
  ) {
    for (let i = 0; i < forDuration.get(this.framerate); i++) {
      this.addToFrames(() => {
        const element = document.querySelector(selector) as HTMLElement;
        const value = transformCallback(element, i);
        element.style.setProperty(property, value);
      });
    }

    return this;
  }

  public addHorizontalBackgroundShiftFrames(
    selector: string,
    fromX: number,
    toY: number,
    forDuration: FrameCount
  ) {
    return this.addValueTranslationFrames(selector, 'background-position-x', fromX, toY, 'px', forDuration);
  }

  public addVerticalBackgroundShiftFrames(
    selector: string,
    fromY: number,
    toY: number,
    forDuration: FrameCount
  ) {
    return this.addValueTranslationFrames(selector, 'background-position-y', fromY, toY, 'px', forDuration);
  }

  public addFadeFrames(
    selector: string,
    fromOpacity: number,
    toOpacity: number,
    forDuration: FrameCount
  ) {
    return this.addValueTranslationFrames(selector, 'opacity', fromOpacity, toOpacity, null, forDuration);
  }

  public addPulseFrames(
    selector: string,
    times: number,
    forDuration: FrameCount
  ) {
    return this.addValueTransformFrames(selector, 'transform', forDuration, (element: HTMLElement, localFrameIndex: number) => {
      const scale = 1 - Math.sin(((localFrameIndex + 1) / forDuration.get(this.framerate)) * Math.PI * times) * 0.2;
      return modifyTransform(element.style.transform, 'scale', scale);
    });
  }

  /**
   * Adds frames to the scene that will play the specified animation for the specified duration.
   */
  public addKeyframeAnimationFrames(
    selector: string,
    animationName: string,
    forDuration: FrameCount
  ) {
    return this.addValueTransformFrames(selector, 'animation', forDuration, (element: HTMLElement, localFrameIndex: number) => {
      const durationInSeconds = forDuration.getSeconds(this.framerate);
      const startAtFraction = forDuration.getFrameStartDelay(this.framerate, localFrameIndex);
      return `${animationName} ${durationInSeconds}s linear 1 forwards normal paused ${startAtFraction}s`;
    });
  }

  // /**
  //  * Adds frames to the scene that will play the specified transition for the specified duration.
  //  * 
  //  * The goal is to have browser transition easing take care of things, but at the moment I haven't
  //  * been able to have the browser show only a specific frame in the transition.
  //  */
  // public addTransitionFrames(
  //   selector: string,
  //   transitionProperty: string,
  //   fromValue: any,
  //   toValue: any,
  //   unit: string | null,
  //   forDuration: FrameCount
  // ) {
  //   for (let i = 0; i < forDuration.get(this.framerate); i++) {
  //     this.addToFrames(() => {
  //       const element = document.querySelector(selector) as HTMLElement;

  //       // Set the initial value
  //       element.style.setProperty(transitionProperty, `${fromValue}${unit ?? ''}`);
  //       console.log('set initial value', `${fromValue}${unit ?? ''}`);

  //       // Add the transition
  //       const durationInSeconds = forDuration.getSeconds(this.framerate);
  //       const startAtFraction = forDuration.getFrameStartDelay(this.framerate, i);
  //       element.style.setProperty('transition', `${transitionProperty} ${durationInSeconds}s linear ${startAtFraction}s`);
  //       console.log('set transition', `${transitionProperty} ${durationInSeconds}s linear ${startAtFraction}s`);

  //       // Set the new value after the transition has been configured
  //       element.style.setProperty(transitionProperty, `${toValue}${unit ?? ''}`);
  //       console.log('set new value', `${toValue}${unit ?? ''}`);

  //       // current calculated value
  //       const computerValues = window.getComputedStyle(element);
  //       console.log('computed value', computerValues.getPropertyValue(transitionProperty));

  //       // set current calculated value
  //       element.style.setProperty(transitionProperty, computerValues.getPropertyValue(transitionProperty));

  //       // Remove the transition
  //       element.style.setProperty('transition', '');
  //       console.log('removed transition');
  //     });
  //   }
        
  //   return this;
  // }

  public addWaitFrames(forDuration: FrameCount) {
    for (let i = 0; i < forDuration.get(this.framerate); i++) {
      this.addToFrames(null);
    }

    return this;
  }

  public build(resetFrame: Frame, firstFrameIndex: number) {
    this.isBuilt = true;
    return new Scene(resetFrame, firstFrameIndex, this.frames);
  }
}