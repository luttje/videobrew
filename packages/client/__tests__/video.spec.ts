import { Video } from '../src/video';
import { it, expect, describe, vi, Mock, beforeEach, afterEach } from 'vitest';
import { VideoBuilder } from '../src/video-builder';

describe('Video', () => {
  const fps = 60;
  let video: Video;
  let mockElement: HTMLElement;
  let resetFrame: Mock<any, any>;
  let videoFrame: Mock<any, any>;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.id = 'mockElement';
    document.body.appendChild(mockElement);

    const videoBuilder = new VideoBuilder(`#${mockElement.id}`, fps);

    resetFrame = vi.fn();
    videoFrame = vi.fn();

    videoBuilder.addScene(resetFrame, (sceneBuilder) => {
      sceneBuilder.addToFrames(videoFrame);
    });

    video = videoBuilder.build();

    // Reset them since the builder calls them in addScene
    resetFrame.mockReset();
    videoFrame.mockReset();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  it('should render a frame', () => {
    video.renderFrame(0);

    expect(resetFrame).toBeCalled();
    expect(videoFrame).toBeCalled();
  });

  it("should throw an error when rendering a frame that doesn't exist", () => {
    expect(() => video.renderFrame(1)).toThrow();
    expect(() => video.renderFrame(-1)).toThrow();
  });

  it('should return the correct framerate', () => {
    expect(video.getFramerate()).toBe(fps);
    expect(resetFrame).not.toBeCalled();
    expect(videoFrame).not.toBeCalled();
  });
});
