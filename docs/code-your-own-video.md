# 📹 Code your own video

Before you get started, you might want to read about [how Videobrew works](./how-it-works.md). In short it takes screenshots of your video app, instructing it to draw each frame. **Your video app must implement the correct methods, so Videobrew can call them.**

## Implementing the VideoApp API

Your video app must create an object called `window.videobrew` which the Videobrew renderer will call upon. This API will look something like this:
```js
window.videobrew = {
  init: () => {
    return {
      width: 800,
      height: 600,
      framerate: 30,
      frameCount: 6 * 30, // 6 seconds
    };
  },
  tick: (frame) => {
    // draw frame
  }
};
```

### VideoApp API methods

#### `init(): Promise<VideoAppSetup> | VideoAppSetup`
- Should return the video specifications as an object.
- The object properties should match this interface:
  ```js
  interface VideoAppSetup {
    width: number;
    height: number;
    framerate: number;
    frameCount: number;
  }
  ```
- The method can be asynchronous to preload data, call api's, etc... (return a `Promise`)
- When this method returns, the renderer is signalled that the video app is ready. It will immediately start rendering frames.

#### `tick(frame): Promise<void> | void`
- Should draw the specified frame.
- Can be asynchronous (return a `Promise`)
- When this method returns, the renderer is signalled that the frame has been rendered. It will take a screenshot and immediately send a `tick` for the next frame.

## Code to draw frames

Videobrew will call the `tick` method and specify the frame number to be drawn. Your code must know exactly what to draw.

In the simplest example (without dependencies) you can build a frames array on setup, and then just draw the frame from that array when `tick` is called:
```js
const framerate = 30;
const frameCount = 2 * framerate; // 2 seconds
const frames = [];
const hueChange = 360 / frameCount;

let hues = [null, 180, 270, 360];

// Build the frames once
for (let frame = 0; frame < frameCount; frame++) {
  frames[frame] = () => {
    squares.forEach((square, i) => {
      square.style.backgroundColor = `hsl(${hues[i] + hueChange * frame}, 100%, 50%)`;
    });
  };
}

window.videobrew = {
  /* ... */
  tick: (frame) => {
    // Run all frames up to and including the current frame
    for (let i = 0; i <= frame; i++) {
      frames[i]();
    }
  }
};
```
*The above code is based on the [0-dependencies example](../examples/0-dependencies/). Check that out for more information.*

### Using the Client Library

To make it easier to build your video app, you can use the `@videobrew/client` library. It will help you build a frames array and provide some methods to transition css properties.

1. Create a new web project with your favorite framework and ensure that there is a main script that is loaded by the web page. We use webpack and TypeScript in this example, but you can use any framework you like.

2. Install the Videobrew Client library in your project:

    ```bash
    $ npm i @videobrew/client
    ``` 

3. Create a `div` with the id `screen` in your HTML.

4. Create a main script file and include it in your HTML.

5. Inside your main script add these imports:

    ```typescript
    import { VideoBuilder, FrameCount } from '@videobrew/client';
    ```

6. Create a new `VideoBuilder` instance:

    ```typescript    
    const videoBuilder = new VideoBuilder('#screen', 60); // 60 frames per second (optional, defaults to 30)
    ```

7. Create a function that will setup HTML for the beginning of the first scene:

    ```typescript
    const screen = document.getElementById('screen');

    function startIntroScene() {
      screen.style.backgroundImage = `url('./mbenna-unsplash-vancouver.jpg')`;
      screen.innerHTML = `
      <div class="container">
        <div class="text">
          <h1>Vancouver</h1>
          <h2>British Columbia</h2>
        </div>
      </div>`;
    }
    ```

8. Instruct the `VideoBuilder` to add the scene to the video and provide a function to modify that scene:

    ```typescript
    videoBuilder.addScene(startIntroScene, (scene) => {
      const duration = 3;
      const fadeTime = 0.2;
      
      scene.addParallelFrames(
        FrameCount.fromSeconds(duration),
        (parallelScene) => {
          parallelScene.addHorizontalBackgroundShiftFrames('#screen', 0, -100, FrameCount.fromSeconds(duration));
        },
        (parallelScene) => {
          parallelScene
            .addWaitFrames(FrameCount.fromSeconds(duration - fadeTime))
            .addFadeFrames('#screen', 1, 0, FrameCount.fromSeconds(fadeTime));
        }
      )
    });
    ```

9. Add this code to build the frames into a final video:

    ```typescript
    const video = videoBuilder.build();
    ```

10. Setup your video by implementing the Videobrew API:

    ```typescript
    window.videobrew = {
      async init() {
        return {
          width: 360,
          height: 640,
          framerate: video.getFramerate(),
          frameCount: video.getFrameCount(),
        };
      },
      async tick(frame: number) {
        video.renderFrame(frame);
      }
    }
    ```

*For more information check out the [<img src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" height="12px" alt="Webpack Logo" /> Webpack + <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201" height="12px" alt="TypeScript Logo" /> TypeScript example](../examples/webpack) or [other examples](../README.md#examples).*

