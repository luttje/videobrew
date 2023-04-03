import { FrameCount } from '../src/frames';
import { VideoBuilder } from '../src/video-builder';

describe('VideoBuilder', () => {
  const fps = 60;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.id = 'mockElement';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  it('should build a video with a single scene', () => {
    let videoBuilder = new VideoBuilder(`#${mockElement.id}`, fps);
    const resetFrame = jest.fn();
    const videoFrame = jest.fn();

    videoBuilder.addScene(resetFrame, (sceneBuilder) => {
      sceneBuilder.addToFrames(videoFrame);
    });

    const video = videoBuilder.build();
    
    expect(video.getFrameCount()).toBe(1);

    video.renderFrame(0);

    expect(resetFrame).toBeCalled();
    expect(videoFrame).toBeCalled();
  });

  it('should build a video with multiple scenes', () => {
    let videoBuilder = new VideoBuilder(`#${mockElement.id}`, fps);
    const resetFrame = jest.fn();
    const videoFrame = jest.fn();

    videoBuilder.addScene(resetFrame, (sceneBuilder) => {
      sceneBuilder.addToFrames(videoFrame);
    });

    videoBuilder.addScene(resetFrame, (sceneBuilder) => {
      sceneBuilder.addToFrames(videoFrame);
    });

    const video = videoBuilder.build();
    
    expect(video.getFrameCount()).toBe(2);

    video.renderFrame(0);

    expect(resetFrame).toBeCalled();
    expect(videoFrame).toBeCalled();

    video.renderFrame(1);

    expect(resetFrame).toBeCalled();
    expect(videoFrame).toBeCalled();
  });

  it('should throw an error when adding a scene after building', () => {
    let videoBuilder = new VideoBuilder(`#${mockElement.id}`, fps);

    videoBuilder.addScene(() => { }, (sceneBuilder) => {
      sceneBuilder.addToFrames(() => { });
    });

    videoBuilder.build();

    expect(() => videoBuilder.addScene(() => { }, (sceneBuilder) => {
      sceneBuilder.addToFrames(() => { });
    })).toThrow();
  });
});
