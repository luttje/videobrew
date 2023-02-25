# Videobrew Documentation

> ## 🚧 Work in progress
> 
> This documentation is a work in progress. If you have any questions, please [open an issue](https://github.com/luttje/videobrew/issues/new).

* [How to serve your video app yourself](./serving-video-apps.md)

## 📦 Packages

| Package | Description |
| --- | --- |
| [@videobrew/cli](../cli) | The command line interface that allows rendering videos. It will install the editor automatically to allow previewing your videos. |
| [@videobrew/editor](../editor) | The editor app that previews your videos. |
| <s>[@videobrew/svelte](../svelte)</s> (wip) | A Svelte component library that allows you to create videos using pre-made Svelte components. |

## 📚 Terminology

| Term | Description |
| --- | --- |
| **Video App** | A web page that describes your video. It can be written in any web technology (like Svelte, Vue and React) or just plain old HTML, CSS and Javascript. |
| **Editor** | Our app that previews your video app in an iframe. You can use it to test what your video will look like. |
| **Renderer** | Our app that renders your video app to a video. |
