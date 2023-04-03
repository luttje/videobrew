import { VideoAppSetup } from "./video-app-setup";

export interface VideoApp {
  init(): Promise<VideoAppSetup> | VideoAppSetup;
  tick(frame: number): Promise<void> | void;
}
