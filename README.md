# 📼 Videobrew

Create videos using any web technologies (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. Animate your web page and have Videobrew render it to a video.

> <div align="center">
>
> ## 🚀 Quickstart
> *Start composing your videos with code!*
> 
> <hr>
>
> ### Install the CLI
> 
> ```bash
> $ npm i -g @videobrew/cli
> ```
> 
> <hr> 
>
> ### Create your video app
> Build a web page that describes the video. *For inspiration check out the [examples](#examples).*
> 
> <hr> 
>
> ### Preview your video
> 
> ```bash
> $ videobrew preview 
> ```
> 
> [<img src="./docs/editor-previewing-video-app.png" alt="Previewing a video app" width="150" />](./docs/editor-previewing-video-app.png)
>
> *This editor is served @ http://localhost:8087*
> 
> <hr> 
>
> ### Render
>   
> ```bash
> $ videobrew render my-video.mp4
> ```
>   
> [<img src="./docs/cli-rendering-video-app.png" alt="Rendering a video app" align="middle" width="500" />](./docs/cli-rendering-video-app.png)
> 
> <hr> 
>
> ### Done 🎉
> See [the example video app](./examples/0-dependencies/) to learn how to make your own and watch [📼 the rendered video](./examples/0-dependencies/out/output.mp4) Videobrew created.
>   
> </div>

## 📖 Learn more

* [How to serve your video app yourself](./docs/serving-video-apps.md)
* [Documentation](./docs/index.md)

## 🧪 Example Video Apps
| Example | Description |
| --- | --- |
| [Zero Dependencies](./examples/0-dependencies/) | Just plain old HTML, CSS and Javascript. |
| <s>[Sveltekit](./examples/sveltekit/)</s> (wip) | A Sveltekit app. |

## 📃 Features

### Rendering
- [x] Render videos from local HTML, CSS and Javascript *(will be served by the Videobrew)* - `videobrew render`
- [x] Render videos from self-hosted HTML, CSS and Javascript - `videobrew render http://my-video-app-url.test`
- [ ] Provide Typescript core to simplify communication with the renderer.
- [ ] Provide Svelte components to build videos.
- [ ] Provide Vue components to build videos.
- [ ] Provide React components to build videos.

### Previewing
- [x] Preview videos from local HTML, CSS and Javascript *(will be served by the Videobrew)* - `videobrew preview`
- [x] Preview videos from self-hosted HTML, CSS and Javascript - `videobrew preview http://my-video-app-url.test`
- [ ] Show a timeline of the video.
- [ ] Allow scrubbing through the video.

## License

You can find the license for this project [here](./LICENSE). All third-party licenses can be found [here](./LICENSES-THIRD-PARTY) (generated with [`license-checker-rseidelsohn --plainVertical > LICENSES-THIRD-PARTY`](https://www.npmjs.com/package/license-checker-rseidelsohn)).