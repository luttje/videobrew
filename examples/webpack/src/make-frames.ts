import { modifyTransform } from './dom-utils';
export type Frame = (() => void) | null;
export type FrameCount = { get(): number };

// Makes the given amount of frames that executes the given callbacks
export function makeParallelFrames(frameCount: FrameCount, ...callbacks: (Frame[])[]): Frame[] {
  let frames: Frame[] = [];

  for (let i = 0; i < frameCount.get(); i++) {
    frames.push(() => {
      for (let callback of callbacks) {
        callback[i]?.();
      }
    });
  }

  return frames;
}

// Shift the background image from left to right
export function makeShiftBackgroundFrames(selector: string, shiftFromX: number, shiftToX: number, frameCount: FrameCount): Frame[] {
  let frames: Frame[] = [];

  for (let i = 0; i < frameCount.get(); i++) {
    frames.push(() => {
      const element = document.querySelector(selector) as HTMLElement;
      const shift = shiftFromX + (shiftToX - shiftFromX) * (i / frameCount.get());
      element.style.backgroundPositionX = `${shift}px`;
    });
  }

  return frames;
}

export function makeFadeFrames(selector: string, fadeFromOpacity: number, fadeToOpacity: number, frameCount: FrameCount): Frame[] {
  let frames: Frame[] = [];

  for (let i = 0; i < frameCount.get(); i++) {
    frames.push(() => {
      const element = document.querySelector(selector) as HTMLElement;
      let opacity = fadeFromOpacity + (fadeToOpacity - fadeFromOpacity) * (i / (frameCount.get() - 1));
      element.style.opacity = `${opacity}`;
    });
  }

  return frames;
}

export function makePulseFrames(selector: string, pulseTimes: number, frameCount: FrameCount): Frame[] {
  let frames: Frame[] = [];

  for (let i = 0; i < frameCount.get(); i++) {
    frames.push(() => {
      const element = document.querySelector(selector) as HTMLElement;
      const scale = 1 - Math.sin(i / frameCount.get() * Math.PI * pulseTimes) * 0.2;
      element.style.transform = modifyTransform(element.style.transform, 'scale', scale);
    });
  }

  return frames;
}

export function makeWaitFrames(frameCount: FrameCount): Frame[] {
  let frames: Frame[] = [];

  for (let i = 0; i < frameCount.get(); i++) {
    frames.push(null);
  }

  return frames;
}
