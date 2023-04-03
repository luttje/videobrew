import { Scene } from '../src/scene';

describe('Scene', () => {
  it('should normalize a frame index', () => {
    const scene = new Scene(() => { }, 10, []);
    
    expect(scene.normalizeFrameIndex(10)).toBe(0);
  });

  it('should render all frames up to and including the given frame', () => {
    const frames = [
      jest.fn(),
      jest.fn(),
      jest.fn(),
    ];
    const scene = new Scene(() => { }, 10, frames);
    
    scene.renderFrame(1);
    
    expect(frames[0]).toBeCalled();
    expect(frames[1]).toBeCalled();
    expect(frames[2]).not.toBeCalled();
  });
});