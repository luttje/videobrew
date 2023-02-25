# 📼 Videobrew

Create videos using any web technologies (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. Animate your web page and have Videobrew render it to a video.

## 🚀 Quickstart

1. Install the Command Line Interface `@videobrew/cli` globally:

    ```bash
    $ npm i -g @videobrew/cli
    ```

2. Create your video app (a web page that describes the video). *For inspiration check out the [examples](#examples).*

3. Preview your video app in the browser by running (in your video app's directory):
  
    ```bash
    $ videobrew preview 
    # Serves the editor @ http://localhost:8087
    # (your video app will also be served for you)
    ```

4. Render your video app into an `mp4` file:
  
    ```bash
    $ videobrew render my-video.mp4
    ```

### (Bonus) Serving your video app yourself

In the [Quickstart](#quickstart) we let Videobrew server your video app for you. But you can also serve it yourself.

If your served video app is running at `http://localhost:8080` then you can preview and render your video app by running these respective commands:

```bash
$ videobrew preview http://localhost:8080

$ videobrew render http://localhost:8080
```

Just make sure your server has [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) configured so the editor can access your video app. To do so set these headers for all requests:
  - `Cross-Origin-Embedder-Policy: require-corp` 
  - `Cross-Origin-Resource-Policy: cross-origin`

## 🧪 Example Video Apps
| Example | Description |
| --- | --- |
| [Zero Dependencies](./examples/0-dependencies/) | Just plain old HTML, CSS and Javascript. |
| [Sveltekit](./examples/sveltekit/) | A Sveltekit app. |

## 📦 Packages

| Package | Description |
| --- | --- |
| [@videobrew/cli](./cli) | The command line interface that allows rendering videos. It will install the editor automatically to allow previewing your videos. |
| [@videobrew/editor](./editor) | The editor app that previews your videos. |
| [@videobrew/svelte](./svelte) | A Svelte component library that allows you to create videos using pre-made Svelte components. |

## 📚 Terminology

| Term | Description |
| --- | --- |
| **Video App** | A web page that describes your video. It can be written in any web technology (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. |
| **Editor** | Our app that previews your video app in an iframe. You can use it to test what your video will look like. |
| **Renderer** | Our app that renders your video app to a video. |

## 📃 Features

### Rendering
- [x] `videobrew render [videoAppPathOrUrl=.] [output=out/my-video.mp4]`: Render videos from local HTML, CSS and Javascript.
- [x] Render videos from hosted HTML, CSS and Javascript.
- [ ] Provide Typescript core to simplify communication with the renderer.
- [ ] Provide Svelte components to build videos.
- [ ] Provide Vue components to build videos.
- [ ] Provide React components to build videos.

### Previewing
- [x] `videobrew preview [videoAppPathOrUrl=.] [output=out/my-video.mp4]`:  Preview videos from hosted HTML, CSS and Javascript.
- [ ] Show a timeline of the video.
- [ ] Allow scrubbing through the video.

## License

You can find the license for this project [here](./LICENSE). All third-party licenses can be found [here](./LICENSES-THIRD-PARTY) (generated with [`license-checker-rseidelsohn --plainVertical > LICENSES-THIRD-PARTY`](https://www.npmjs.com/package/license-checker-rseidelsohn)).