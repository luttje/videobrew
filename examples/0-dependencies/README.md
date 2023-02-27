# 📜 Zero Dependencies Video App Example

A video made with plain old HTML, CSS and Javascript.

[[📼 Watch the rendered video]](./out/output.mp4)

This example was rendered by running the command `videobrew render out/output.mp4` in this directory.

## From scratch

1. Create a new web page based on this example. Ensure there's a `index.html`.

2. Create a `window.videobrew` object and add the following functions:

    - `init(): Promise<VideoAppSetup> | VideoAppSetup`:
      - Should return the video specifications:
       ```js
       interface VideoAppSetup {
         width: number;
         height: number;
         framerate: number;
         frameCount: number;
       }
       ```
      - Can be asynchronous (return a `Promise`) to preload data, call api's, etc... 
      - When this function returns, the renderer is signalled that the video app is ready to start rendering frames.

    - `tick(frame): Promise<void> | void`:
      - Should draw the specified frame.
      - Can be asynchronous (return a `Promise`) to take your time drawing the frame
      - When this function returns, the renderer is signalled that the frame has been rendered and the next frame can be drawn (it will send another `tick` for that).

    **For example:**

    ```js
    window.videobrew = {
      init: () => {
        return {
          width: width,
          height: height,
          framerate: framerate,
          frameCount: frameCount,
        };
      },
      tick: (frame) => {
        // run all frames up to the and including the current frame
        for (let i = 0; i <= frame; i++) {
          frames[i]();
        }
      }
    };
    ```

   **Do not use transitions or animations!** Rendering wont be in sync with the real time framerate. Instead each frame will render as fast as possible. For this reason you must know exactly what to draw for each frame.

3. Run `videobrew preview` to test your video in the browser. You can view it @ `http://localhost:8087`.

4. Render it with `videobrew render my-video.mp4`
