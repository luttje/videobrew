/**
 * Video App API that the renderer and editor will use to communicate with the video app.
 */
export interface VideoAppSetup {
  width: number;
  height: number;
  framerate: number;
  frameCount: number;
}

export interface VideoApp {
  init(): Promise<VideoAppSetup> | VideoAppSetup;
  tick(frame: number): Promise<void> | void;
}
