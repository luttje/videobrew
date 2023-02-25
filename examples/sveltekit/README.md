# <img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg" height="22px" alt="Svelte Logo" /> [Sveltekit](https://kit.svelte.dev/) Video App Example

**This is psuedo-code. The features below are not yet implemented.**

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
  } from 'videobrew';
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

## From scratch

1. Create a new [Svelte](https://svelte.dev/) project using `npm create svelte@latest my-video-project`.

2. Require `@videobrew/svelte` in your project by running `npm i @videobrew/svelte`. *This contains useful components to help construct your video and communicate with the renderer.*

3. Create a web page that describes the video. See the example in this directory.

4. Run `npm run dev` to test and serve your video app. Take note of the url on which Svelte is hosting your video app.

5. Run `videobrew preview http://localhost:8080` with the url where Svelte hosts your video app.

6. You can render the video by running `videobrew render http://localhost:8080 my-video.mp4` to render the video to the specified file.
