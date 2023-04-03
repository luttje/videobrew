# 📼 Videobrew 

[![CLI npm version](https://img.shields.io/npm/v/@videobrew/cli)](https://www.npmjs.com/package/@videobrew/cli)
[![Coverage Status](https://coveralls.io/repos/github/luttje/videobrew/badge.svg?branch=main)](https://coveralls.io/github/luttje/videobrew?branch=main)

Create videos using any web technologies (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. Animate your web page and have Videobrew render it to a video.

<div align="center">

<hr>

## 🚧 Work in progress
This project is a work in progress. If you have any questions, please [open an issue](https://github.com/luttje/videobrew/issues/new).

</div>

<hr>

> <div align="center">
>
> ## 🚀 <span id="quickstart">Quickstart</span>
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
> Let's **build the webpack example Video App:**
> 
> ```bash
> $ cd examples/webpack
> $ npm run build
> ```
> *The webpack example video app is built to `dist/`*
> 
> <hr> 
>
> ### Preview your video
> See your video app in action by letting Videobrew know where it is:
> ```bash
> $ videobrew preview dist/
> ```
> Open the editor in your browser @ http://localhost:8087
> 
> [<img src="./docs/editor-previewing-video-app.png" alt="Previewing a video app" width="150" />](./docs/editor-previewing-video-app.png)
>
> <hr> 
>
> ### Render your video
>   
> ```bash
> $ videobrew render dist/ my-video.mp4
> ```
>   
> [<img src="./docs/cli-rendering-video-app.png" alt="Rendering a video app" align="middle" width="500" />](./docs/cli-rendering-video-app.png)
> 
> <hr> 
>
> ### Done 🎉
>   
> Watch [📼 the video that Videobrew rendered](./examples/webpack/out/weather.mp4)
>
> <hr> 
>
> ### Next Steps
>
> Check out the [🧪 Example Video Apps](#examples) to see how your favorite web technologies work with Videobrew.
>
> Read the [📖 Documentation](#documentation) to learn [how Videobrew works](./docs/how-it-works.md) and how to start [coding your own video](./docs/code-your-own-video.md)
>
> </div>

<hr>

## <span id="documentation">📖 Documentation</span>

### Guides
* [Code your own video](./docs/code-your-own-video.md)
* [Serve your video app yourself](./docs/serving-video-apps.md)

### Technical background
* [How it works](./docs/how-it-works.md)
* [The different `@videobrew/*` packages](./docs/packages.md)
* [`@videobrew/client` API Reference](./docs/api/client.md)

### 📚 Terminology

| Term | Description |
| --- | --- |
| **Video App** | A web page that describes your video. It can be written in any web technology (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. |
| **Editor** | Our app that previews your video app in an iframe. You can use it to test what your video will look like. |
| **Renderer** | Our app that renders your video app to a video. |

<hr>

## <span id="examples">🧪 Example Video Apps</span>
| Example | Description | Uses `@videobrew/client`
| ---: | --- | --- |
| [Zero Dependencies](./examples/0-dependencies/) | Just plain old HTML, CSS and Javascript. | |
| [Local Installation](./examples/local-install/) | Shows how to install and use Videobrew with `--save-dev` instead of globally with `-g`. | |
| <s>[<img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg" height="12px" alt="Svelte Logo" /> Sveltekit](./examples/sveltekit/)</s> (wip) | A Sveltekit video app example. | ✔ |
| [<img src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" height="12px" alt="Webpack Logo" /> Webpack + <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201" height="12px" alt="TypeScript Logo" /> TypeScript](./examples/webpack) | Use Webpack and TypeScript to make your video app. | ✔ |

<hr>

## 😍 Special Thanks

Videobrew wouldn't be here without these awesome projects:
[Playwright](https://playwright.dev/), [FFmpeg](https://ffmpeg.org/), [Chalk](https://www.npmjs.com/package/chalk), [Prompts](https://www.npmjs.com/package/prompts), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), [Svelte](https://svelte.dev/) and more!

<hr>

## License

> Videobrew - Create videos using any web technologies.
> 
> Copyright (C) 2023  Luttje
> 
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU Affero General Public License as published
> by the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.
> 
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
> GNU Affero General Public License for more details.
> 
> A copy of the GNU Affero General Public License can be found [here](./LICENSE). 
> The full license text can also be found on <https://www.gnu.org/licenses/>.

### Third Party Licenses
> Licenses of third parties we are directly depending on can be found [here](./LICENSES-THIRD-PARTY). This file was automatically generated with [`license-checker-rseidelsohn`](https://www.npmjs.com/package/license-checker-rseidelsohn) upon running `npm run build`.