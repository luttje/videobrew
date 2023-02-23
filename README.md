# Web Video Maker

Create a video by animating a web page.

## Requirements

* [Node.js](http://nodejs.org/)
* A web browser

## Getting Started

1. Clone this repository
2. Go into the repository directory
3. Run `npm install`
4. Run `npm run dev` 

## Usage

⚠ **This usage description is how we want it to be, not yet how it is.**

1. Create a new project that uses your prefered frontend framework. For example, create a new [Svelte](https://svelte.dev/) project with `npm create svelte@latest my-video-project`.

2. Require `web-video-maker` in your project by running `npm i web-video-maker`.

3. Create a web page that describes the video. For example, with svelte you could change the `routes/+page.svelte` file to the [Svelte Example Video](#svelte) below.

4. Render your project so a webpage is created. For example, with svelte you can run `npm run build`.

5. Run `web-video-maker preview .svelte-kit/output/index.html` with the path to the webpage to preview the video. A preview of the video will open in your preferred browser.

6. You can render the video directly from the preview page or run `web-video-maker render .svelte-kit/output/index.html out/my-video-project.mp4` to render the video to the specified path.

## Example videos

### Svelte
```html
<script lang="ts">
  import { 
    Sequence, 
    Group, 
    Rectangle, 
    Text, 
    Transition, 
    TimeSpan,
    Easing
  } from 'web-video-maker';
</script>

<Sequence>
  <!-- Because this is the first group, it will by default start at frame 0, all it's children will start with it -->
  <Group 
    timing={{ 
      duration: TimeSpan.fromSeconds(2),
    }}
    transition={{
      in: Transition.fadeIn({ 
        duration: TimeSpan.fromMilliseconds(500),
      }),
    }}>
    <!-- A background that shifts hue based on the amount of seconds -->
    <Rectangle
      x={0}
      y={0}
      width={width}
      height={height}
      color="#FF0000"
      hue={0}
      to={{ hue: 360 }}
      easing={Easing.Linear}
    />
    <!-- A title that slides in from the right -->
    <Text
      x={width}
      y={height / 2}
      text="Hello World"
      font="Arial"
      size={50}
      to={{ x: 0 }}
      easing={Easing.Linear}
    />
  </Group>
  <!-- The next group will follow after the first has ended. The transition overlap may cause it to start slightly earlier to crossfade. All children of this group will start with it. -->
  <Group 
    timing={{ 
      duration: TimeSpan.fromSeconds(2),
    }}
    transition={{
      in: Transition.fadeIn({ 
        duration: TimeSpan.fromMilliseconds(500),
        overlap: TimeSpan.fromMilliseconds(500)
      }),
      out: Transition.fadeOut({ 
        duration: TimeSpan.fromMilliseconds(500) 
      }),
    }}>
    <!-- A background that shifts hue based on the amount of seconds -->
    <Rectangle
      x={0}
      y={0}
      width={width}
      height={height}
      color="#00FF00"
      hue={0}
      to={{ hue: 360 }}
      easing={Easing.Linear}
    />
    <!-- A title that slides in from the right, followed by another text. Sequences can be nested. -->
    <Sequence>
      <Text
        timing={{ duration: TimeSpan.fromSeconds(1) }}
        x={width}
        y={height / 2}
        text="Hello World Again"
        font="Arial"
        size={50}
        to={{ x: 0 }}
        easing={Easing.Linear}
      />
      <!-- All components have a timing, transition and animation (from/to) attributes. -->
      <Text
        timing={{ duration: TimeSpan.fromSeconds(1) }}
        x={width}
        y={height / 2 + 50}
        text="This is another text"
        font="Arial"
        size={50}
        to={{ x: 0 }}
        easing={Easing.Linear}
    </Sequence>
  </Group>
</Sequence>
```

### Pure HTML
**⚠ TODO!**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <div style="width: 100%; height: 100%; background-color: red; display: hidden;" 
      data-duration="2000" 
      data-transition-overlap="500"
      data-transition-in="fadeIn" data-transition-out="fadeOut">
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div style="font-family: Arial; font-size: 50px; color: white;">Hello World</div>
      </div>
    </div>

    <div style="width: 100%; height: 100%; background-color: green;">
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div style="font-family: Arial; font-size: 50px; color: white;">Hello World Again</div>
      </div>

      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div style="font-family: Arial; font-size: 50px; color: white;">This is another text</div>
    </div>

    <script>
      // TODO
    </script>
  </body>
</html>
```