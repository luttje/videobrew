import type { PluginOption } from "vite";
import path from 'path';

export const videoPathPrefix = '/video';

export function videobrew(): PluginOption {
  return {
    name: "videobrew",

    /**
     * Expand the Vite to watch the video app.
     */
    configureServer(server) {
      const videoAppPath = process.env.VIDEOBREW_TARGET;

      if (!videoAppPath) {
        return
      }
      
      console.log(`Watching video app at ${videoAppPath}`);
      server.watcher.add(videoAppPath);
    },
    
    /**
     * Expand the Vite to include the video app in rollup.
     */
    config(config) {
      const videoAppPath = process.env.VIDEOBREW_TARGET;

      if (!videoAppPath) {
        return
      }

      return {
        resolve: {
          alias: {
            ['@video']: videoAppPath,
          },
        },
        server: {
          fs: {
            allow: [videoAppPath],
          },
          headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
          },
        },
        assetsInclude: [
          path.join(videoAppPath, 'index.html'),
        ]
      }
    },
  }
} 