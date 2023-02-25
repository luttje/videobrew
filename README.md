```
 ___________________________________________________
/                                                   \
|---------------------------------------------------|
|   ____________                     ____________   |
|  /            |    Video Brew     |            \  |
| (             |                   |             ) |
| |             |                   |             | |
| (             |                   |             ) |
|  \____________|                   |____________/  |
|                                                   |
\___________________________________________________/
```
# Videobrew

Create videos using any web technologies. Animate a web page with your favorite web framework and have Videobrew render it to a video.

## Usage

⚠ **This software is under construction. Things may work or not work and possibly different from the documentation.**

1. Install the `@videobrew/cli` globally with `npm i -g @videobrew/cli`.

### Pure HTML

1. Create a new web page named `index.html` based on the [Pure HTML Example](./editor/static/tests/pure-html/). *You are free to include css, javascript and any other <u>local</u> content.*

2. Run `videobrew preview` in the directory of the created `index.html`. A preview of the video can be viewed in your preferred browser @ [`http://localhost:3000`](http://localhost:3000).

3. You can render the video by running `videobrew render . out/` to render the video to the specified path.

### Svelte

1. Create a new [Svelte](https://svelte.dev/) project with `npm create svelte@latest my-video-project`.

2. Require `@videobrew/svelte` in your project by running `npm i @videobrew/svelte`. *This contains useful components to help construct your video and communicate with the renderer.*

3. Create a web page that describes the video. For example change the `routes/+page.svelte` file to the [Svelte Example Video](#svelte) below.

4. Run `npm run build` to render your webpage to a static site.

5. Run `videobrew preview build/` with the path to the webpage files. A preview of the video can be viewed in your preferred browser @ [`http://localhost:3000`](http://localhost:3000).

6. You can render the video by running `videobrew render . out/` to render the video to the specified path.

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

## License

You can find the license for this project [here](./LICENSE). All third-party licenses can be found [here](./LICENSES-THIRD-PARTY) (generated with [`license-checker-rseidelsohn --plainVertical > LICENSES-THIRD-PARTY`](https://www.npmjs.com/package/license-checker-rseidelsohn)).