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

Create a component in `Video.svelte` that describes a sequence of scenes. Each scene is a web page that can later be rendered into frames.

```html
<Sequence>
  <!-- Because this is the first scene, it will by default start at frame 0 -->
  <Scene timeline={{ duration: TimeSpan.fromSeconds(2) }}
    transitionIn={ Transition.fadeIn({ duration: TimeSpan.fromMilliseconds(500) }) }>
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
      to={{ x: 0 }}
      easing={Easing.Linear}
    />
  </Scene>
  <!-- The next scene will immediately follow, unless offset with a transition -->
  <Scene timeline={{ duration: TimeSpan.fromSeconds(2) }}
    transitionIn={ Transition.fadeIn({ 
      duration: TimeSpan.fromMilliseconds(500),
      overlap: TimeSpan.fromMilliseconds(500)
    }) }
    transitionOut={ Transition.fadeOut({ duration: TimeSpan.fromMilliseconds(500) }) }>
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
    <!-- A title that slides in from the right -->
    <Text
      x={width}
      y={height / 2}
      text="Hello World"
      to={{ x: 0 }}
      easing={Easing.Linear}
    />
  </Scene>
</Sequence>
```