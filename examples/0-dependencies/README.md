# 📜 Zero Dependencies Video App Example

A video made with plain old HTML, CSS and Javascript. 

[[ 📼 Watch the rendered video ]](./out/output.mp4)

This example was rendered by running the command `videobrew render out/output.mp4` in this directory.

## From scratch

1. Create a new web page based on this example. Ensure there's a `index.html`.

2. Write some Javascript that listens for the `message` event. The Videobrew renderer will send two events:

    * `videobrew.init` (no data) - when the renderer wants you to set up your video.
    * `videobrew.tick` (`frame`) - when the renderer wants you to render the provided frame.

    **For example:**
    
    ```js
    window.addEventListener('message', function (event) {
      switch (event.data.type) {
        case 'videobrew.init':
          setup();
          break;
        case 'videobrew.tick':
          tick(event.data.frame);
          break;
      }
    });
    ```

3. After receiving `videobrew.init` you should inform the renderer of your video specifications. Send a message to the renderer like this:

    ```js
    function setup() {
      parent.postMessage({
        type: 'videobrew.setup',
        width: 1920,
        height: 1080,
        framerate: 30,
        frameCount: 30 * 5, // 5 seconds
      }, '*');
    }
    ```

4. Now the renderer may start asking you to render a specific frame. You should draw the frame immediately:

    ```js
    function tick(frame) {
      if (frame === 0) {
        // Reset your video app to the start state
      }

      // Draw the specified frame
    }
    ```

    **Do not use transitions or animations!** Rendering wont be in sync with the frame rate, but will happen as fast as possible. For this reason you must know exactly what to draw for each frame.

5. Run `videobrew preview` to test your video in the browser. You can view it @ `http://localhost:8087`.

6. Render it with `videobrew render my-video.mp4`
