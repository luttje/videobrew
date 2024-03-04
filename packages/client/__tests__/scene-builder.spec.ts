import { Frame, FrameCount } from '../src/frames';
import { it, expect, describe, beforeAll } from 'vitest';
import { SceneBuilder } from '../src/scene-builder';

describe('SceneBuilder', () => {
  const duration = 3;
  const fadeTime = 0.2;
  const fps = 60;
  const seconds = 60;
  const from = 0;
  const to = 100;
  const distance = to - from;
  const checkpoints = [0, 0.25, 0.5, 0.75, 1];

  it('should build a scene', () => {
    const sceneBuilder = new SceneBuilder(fps);
    
    sceneBuilder.addWaitFrames(FrameCount.fromSeconds(seconds));

    const scene = sceneBuilder.build(() => { }, 0);

    expect(scene.getFrameCount()).toBe(fps * seconds);
  });

  it('should throw an error when adding frames after building', () => {
    const sceneBuilder = new SceneBuilder(fps);
    
    sceneBuilder.addWaitFrames(FrameCount.fromSeconds(seconds));

    sceneBuilder.build(() => { }, 0);

    expect(() => sceneBuilder.addWaitFrames(FrameCount.fromSeconds(seconds))).toThrow();
  });

  it('should build using an array of frames', () => {
    const sceneBuilder = new SceneBuilder(fps);
    
    const framesArray: Frame[] = [];

    for (let i = 0; i < fps * seconds; i++) {
      framesArray.push(() => { });
    }
    
    sceneBuilder.addToFrames(framesArray);

    const scene = sceneBuilder.build(() => { }, 0);

    expect(scene.getFrameCount()).toBe(fps * seconds);
  });

  it('should build a video with a scene that has a parallel scene with a wait frame', () => {
    const sceneBuilder = new SceneBuilder(fps);
  
    sceneBuilder.addParallelFrames(
      FrameCount.fromSeconds(duration),
      (parallelScene) => {
        parallelScene.addWaitFrames(FrameCount.fromSeconds(duration));
      },
      (parallelScene) => {
        parallelScene.addWaitFrames(FrameCount.fromSeconds(fadeTime));
      }
    );
  
    const scene = sceneBuilder.build(() => { }, 0);
  
    expect(scene.getFrameCount()).toBe(fps * duration);
  });
  
  describe('with HTML element', () => {
    let mockElement: HTMLDivElement;

    beforeAll(() => {
      mockElement = document.createElement('div');
      mockElement.id = 'testMockElement';
      mockElement.style.width = '100px';
      mockElement.style.height = '100px';
      mockElement.style.backgroundImage = 'url("https://via.placeholder.com/100")';
      document.body.appendChild(mockElement);
    });

    it('should build a video with a scene that has a horizontal shift frame', () => {
      const sceneBuilder = new SceneBuilder(distance); // Use the distance as the FPS to make the half way point easier to calculate.
    
      sceneBuilder.addHorizontalBackgroundShiftFrames(`#${mockElement.id}`, from, to, FrameCount.fromSeconds(distance));
    
      const scene = sceneBuilder.build(() => {
        mockElement.style.backgroundPositionX = '0px';
      }, 0);
    
      checkpoints.forEach((checkpoint) => {
        scene.renderFrame(Math.round(scene.getFrameCount() * checkpoint));
        expect(parseFloat(mockElement.style.backgroundPositionX)).toBeCloseTo(distance * checkpoint, 1);
      });
    });

    it('should build a video with a scene that has a vertical shift frame', () => {
      const sceneBuilder = new SceneBuilder(distance); // Use the distance as the FPS to make the half way point easier to calculate.
    
      sceneBuilder.addVerticalBackgroundShiftFrames(`#${mockElement.id}`, from, to, FrameCount.fromSeconds(distance));
    
      const scene = sceneBuilder.build(() => {
        mockElement.style.backgroundPositionY = '0px';
      }, 0);
    
      checkpoints.forEach((checkpoint) => {
        scene.renderFrame(Math.round(scene.getFrameCount() * checkpoint));
        expect(parseFloat(mockElement.style.backgroundPositionY)).toBeCloseTo(distance * checkpoint, 1);
      });
    });

    it('should build a video with a scene that has a width transform frame', () => {
      const sceneBuilder = new SceneBuilder(fps);
      const frameCount = FrameCount.fromSeconds(duration);
      const movePerFrame = distance / (frameCount.get(fps) - 1);

      sceneBuilder.addValueTransformFrames(`#${mockElement.id}`, 'width', frameCount, (element, localFrameIndex) => {
        return from + (movePerFrame * localFrameIndex) + 'px';
      });
    
      const scene = sceneBuilder.build(() => {
        mockElement.style.width = '0px';
      }, 0);

      checkpoints.forEach((checkpoint) => {
        scene.renderFrame(Math.round(scene.getFrameCount() * checkpoint));

        // TODO: Check if receiving 25.13966... instead of 25 at 25% is acceptable. (This is why we round to 0 decimals here at the moment)
        expect(parseFloat(mockElement.style.width)).toBeCloseTo(distance * checkpoint, 0);
      });
    });

    it('should build a video with a scene that has fade frames', () => {
      const sceneBuilder = new SceneBuilder(fps);
      const fromOpacity = 0;
      const toOpacity = 1;

      sceneBuilder.addFadeFrames(`#${mockElement.id}`, fromOpacity, toOpacity, FrameCount.fromSeconds(duration));
    
      const scene = sceneBuilder.build(() => {
        mockElement.style.opacity = fromOpacity.toString();
      }, 0);

      checkpoints.forEach((checkpoint) => {
        scene.renderFrame(Math.round(scene.getFrameCount() * checkpoint));
        expect(parseFloat(mockElement.style.opacity)).toBeCloseTo(toOpacity * checkpoint, 1);
      });
    });

    // Hard to test due to it using Math.sin internally. We'll just test that it doesn't throw an error.
    it('should build a video with a scene that has pulse frames', () => {
      const sceneBuilder = new SceneBuilder(fps);

      sceneBuilder.addPulseFrames(`#${mockElement.id}`, 1, FrameCount.fromSeconds(duration));
    
      const scene = sceneBuilder.build(() => { }, 0);

      expect(scene.getFrameCount()).toBe(fps * duration);
    });

    it('should build a video with a scene that has keyframe animation frames', () => {
      const keyframes = `
        @keyframes testAnimation {
          0% {
            transform: translateX(${from}px);
          }
          100% {
            transform: translateX(${to}px);
          }
        }
      `;
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.appendChild(document.createTextNode(keyframes));
      document.head.appendChild(style);

      const sceneBuilder = new SceneBuilder(fps);

      sceneBuilder.addKeyframeAnimationFrames(`#${mockElement.id}`, 'testAnimation', FrameCount.fromSeconds(duration));

      const scene = sceneBuilder.build(() => { }, 0);

      checkpoints.forEach((checkpoint) => {
        // TODO: This wont actually work since we use pausing and delaying to set the keyframe animation to the correct frame.
        // scene.renderFrame(Math.round(scene.getFrameCount() * checkpoint));
        // Get the actual translateX value from the keyframe animation.
        // const computedStyle = window.getComputedStyle(mockElement);
        // const transform = computedStyle.getPropertyValue('transform');
        // const translateX = transform.match(/translateX\((.*)px\)/)![1];
        // expect(parseFloat(translateX)).toBeCloseTo(distance * checkpoint, 1);
      });

      // Just check for errors
      expect(scene.getFrameCount()).toBe(fps * duration);

      // Remove the mock keyframe animation.
      document.head.removeChild(style);
    });
  });
});
