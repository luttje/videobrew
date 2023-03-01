import { VideoApp } from '@videobrew/client';

declare global {
  interface Window {
    VIDEOBREW_VIDEO_APP_URL: string;

    videobrew: VideoApp;
  }
}