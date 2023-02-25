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
# <span style="display:none">Videobrew</span>

Create videos using any web technologies. Animate a web page with your favorite web framework and have Videobrew render it to a video.

## Usage

⚠ **This software is under construction. Things may work or not work and possibly different from the documentation.**

### Pure HTML

1. Install `videobrew` globally with `npm i -g videobrew`.

2. Create a new HTML file named `index.html` based on the [Pure HTML Example](#pure-html) below. *You are free to include css, javascript and any other <u>local</u> content.*

3. Run `videobrew preview` in the directory of the created `index.html`. A preview of the video can be viewed in your preferred browser @ [`http://localhost:8080`](http://localhost:8080).

4. You can render the video by running `videobrew render . out/` to render the video to the specified path.

### Svelte

1. Create a new [Svelte](https://svelte.dev/) project with `npm create svelte@latest my-video-project` and [configure it to generate a static site](https://kit.svelte.dev/docs/adapter-static#usage).

2. Require `videobrew` in your project by running `npm i videobrew`.

3. Create a web page that describes the video. For example change the `routes/+page.svelte` file to the [Svelte Example Video](#svelte) below.

4. Run `npm run build` to render your webpage to a static site.

5. Run `videobrew preview build/` with the path to the webpage files. A preview of the video can be viewed in your preferred browser @ [`http://localhost:8080`](http://localhost:8080).

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

## License

You can find the license for this project [here](./LICENSE). All third-party licenses can be found [here](./LICENSES-THIRD-PARTY) (generated with [`license-checker-rseidelsohn --plainVertical > LICENSES-THIRD-PARTY`](https://www.npmjs.com/package/license-checker-rseidelsohn)).