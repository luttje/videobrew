# 📼 Videobrew

Create videos using any web technologies (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. Animate your web page and have Videobrew render it to a video.

## 🚀 Quickstart

> ⚠ **This software is under construction. Things may work or not work and possibly different from the documentation.**

1. Install the Command Line Interface `@videobrew/cli` globally:

    ```bash
    $ npm i -g @videobrew/cli
    ```

2. Create a web page that describes the video. We call this your video app. *See [our examples](#examples) for more information.*

3. Serve your video app by either:

    - **Letting Videobrew serve your video app for you** 

      Simply point Videobrew to your video app directory when using the `preview` or `render` commands.

    - **Serving it yourself** 
    
      *Be sure to allow it to be viewed from any origin ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) so the editor can preview your video app.*

4. Open a command prompt in the directory of your video app where your `index.html` is.

5. Preview your video app in the browser @ [`http://localhost:8087`](http://localhost:8087):
  
    ```bash
    $ videobrew preview
    ```

6. Render your video app into an `mp4` file:
  
    ```bash
    $ videobrew render my-video.mp4
    ```

## 📦 Packages

- [@videobrew/cli](./cli) - The command line interface that allows rendering videos. It will install the editor automatically to allow previewing your videos.
- [@videobrew/editor](./editor) - The editor app that previews your videos.
- [@videobrew/svelte](./svelte) - A Svelte component library that allows you to create videos using pre-made Svelte components.

## 📚 Terminology

- **Video App** - A web page that describes the video. It can be written in any web technology (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript.
- **Editor** - The app that previews your video app. It is a web page that can be viewed in any browser.
- **Renderer** - The app that renders your video app to a video. It is a command line interface that can be run in any terminal.

## 🧪 Example Video Apps
- [Zero Dependencies](./examples/0-dependencies/) - Just plain old HTML, CSS and Javascript.
- [Sveltekit](./examples/sveltekit/) - A Sveltekit app.

## 📃 Features

### Rendering
- [x] `videobrew render [videoAppPathOrUrl=.] [output=out/my-video.mp4]`: Render videos from local HTML, CSS and Javascript.
- [ ] Render videos from hosted HTML, CSS and Javascript.
- [ ] Provide Svelte components to build videos.
- [ ] Provide Vue components to build videos.
- [ ] Provide React components to build videos.

### Previewing
- [x] `videobrew preview [videoAppPathOrUrl=.] [output=out/my-video.mp4]`:  Preview videos from hosted HTML, CSS and Javascript.
- [ ] Show a timeline of the video.
- [ ] Show a list of all the elements in the video.
- [ ] Show a list of all the transitions in the video.
- [ ] Allow scrubbing through the video.

## License

You can find the license for this project [here](./LICENSE). All third-party licenses can be found [here](./LICENSES-THIRD-PARTY) (generated with [`license-checker-rseidelsohn --plainVertical > LICENSES-THIRD-PARTY`](https://www.npmjs.com/package/license-checker-rseidelsohn)).