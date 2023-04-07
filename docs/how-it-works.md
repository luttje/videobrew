# 🔍 How Videobrew works

Here is a short overview of the process that Videobrew uses to render your video:

1. Videobrew opens the video app you provide in a headless (invisible) browser. *[(using Playwright)](https://playwright.dev/)*

2. It will ask the video app for setup specifications *(`width`, `height`, `framerate`, total `frameCount`)*.

3. After setup Videobrew starts rendering frames by calling a `tick` method on your video app with the current frame number. 

4. Your video app should draw that frame and return. 

5. Videobrew will take a screenshot (`width` x `height`) of the page and save it as a frame. 

6. It checks `frameCount` to see if all frames have been rendered. Then it will stitch all frames together into a video at the provided `framerate`. *[(using FFmpeg)](https://ffmpeg.org/)*

<div align="center">

  [Learn how to code your own video](https://github.com/luttje/videobrew/blob/main/docs/code-your-own-video.md)

</div>