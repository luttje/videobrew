// TODO: De-duplicate
// TODO: also exists @ packages/cli/src/types.d.ts
// TODO: also exists @ packages/editor/src/types.d.ts
/**
 * Video App API that the renderer and editor will use to communicate with the video app.
 */
declare interface VideoAppSetup {
  width: number;
  height: number;
  framerate: number;
  frameCount: number;
}

declare interface VideoApp {
  init(): Promise<VideoAppSetup> | VideoAppSetup;
  tick(frame: number): Promise<void> | void;
}

declare interface Window {
  VIDEOBREW_VIDEO_APP_URL: string;

  videobrew: VideoApp;
}