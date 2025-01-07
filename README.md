# 📼 Videobrew 

[![Videobrew Documentation](https://shields.io/badge/-documentation-583372)](https://github.com/luttje/videobrew/tree/main/docs)
[![CLI npm version](https://img.shields.io/npm/v/@videobrew/cli)](https://www.npmjs.com/package/@videobrew/cli)
[![License](https://img.shields.io/github/license/luttje/videobrew)](https://github.com/luttje/videobrew/blob/main/LICENSE)
[![Dependency status](https://img.shields.io/librariesio/github/luttje/videobrew)](https://libraries.io/github/luttje/videobrew)
[![GitHub Tests Action](https://github.com/luttje/videobrew/actions/workflows/tests.yml/badge.svg)](https://github.com/luttje/videobrew/actions/workflows/tests.yml)
[![Test Coverage Status](https://coveralls.io/repos/github/luttje/videobrew/badge.svg?branch=main)](https://coveralls.io/github/luttje/videobrew?branch=main)

Create videos using any web technologies (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. Animate your web page and have Videobrew render it to a video.

<div align="center">

<hr>

## 🚧 Unmaintained Proof of Concept
This project is a proof of concept that is not actively maintained. If you have any questions, feel free to [open an issue](https://github.com/luttje/videobrew/issues/new).

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
> [<img src="https://raw.githubusercontent.com/luttje/videobrew/main/docs/editor-previewing-video-app.png" alt="Previewing a video app" width="150" />](https://github.com/luttje/videobrew/blob/main/docs/editor-previewing-video-app.png)
>
> <hr> 
>
> ### Render your video
>   
> ```bash
> $ videobrew render dist/ my-video.mp4
> ```
>   
> [<img src="https://github.com/luttje/videobrew/blob/main/docs/cli-rendering-video-app.png" alt="Rendering a video app" align="middle" width="500" />](https://github.com/luttje/videobrew/blob/main/docs/cli-rendering-video-app.png)
> 
> <hr> 
>
> ### Done 🎉
>   
> Watch [📼 the video that Videobrew rendered](https://github.com/luttje/videobrew/blob/main/examples/webpack/out/weather.mp4)
>
> <hr> 
>
> ### Next Steps
>
> Check out the [🧪 Example Video Apps](#examples) to see how your favorite web technologies work with Videobrew.
>
> Read the [📖 Documentation](https://github.com/luttje/videobrew/blob/main/docs/) to learn [how Videobrew works](https://github.com/luttje/videobrew/blob/main/docs/how-it-works.md) and how to start [coding your own video](https://github.com/luttje/videobrew/blob/main/docs/code-your-own-video.md)
>
> </div>

<hr>

## <span id="examples">🧪 Example Video Apps</span>
| Example | Description | Uses `@videobrew/client`
| ---: | --- | --- |
| [Zero Dependencies](https://github.com/luttje/videobrew/blob/main/examples/0-dependencies/) | Just plain old HTML, CSS and Javascript. | |
| [Local Installation](https://github.com/luttje/videobrew/blob/main/examples/local-install/) | Shows how to install and use Videobrew with `--save-dev` instead of globally with `-g`. | |
| <s>[<img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg" height="12px" alt="Svelte Logo" /> Sveltekit](https://github.com/luttje/videobrew/blob/main/examples/sveltekit/)</s> (wip) | A Sveltekit video app example. | ✔ |
| [<img src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" height="12px" alt="Webpack Logo" /> Webpack + <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201" height="12px" alt="TypeScript Logo" /> TypeScript](https://github.com/luttje/videobrew/blob/main/examples/webpack) | Use Webpack and TypeScript to make your video app. | ✔ |

<hr>

## 😍 Special Thanks

Videobrew wouldn't be here without these awesome projects:
[Playwright](https://playwright.dev/), [FFmpeg](https://ffmpeg.org/), [Chalk](https://www.npmjs.com/package/chalk), [Prompts](https://www.npmjs.com/package/prompts), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), [Svelte](https://svelte.dev/) and more!

<hr>

## License

> The MIT License (MIT)
>
> Copyright (c) 2022-2025 Luttje
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.

### Third Party Licenses
> Licenses of third parties we are directly depending on can be found [here](https://github.com/luttje/videobrew/blob/main/LICENSES-THIRD-PARTY). This file was automatically generated with [`license-checker-rseidelsohn`](https://www.npmjs.com/package/license-checker-rseidelsohn) upon running `npm run build`.