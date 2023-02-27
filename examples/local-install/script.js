/*
  This example is identical to 0-dependencies. The only difference is that 
  we are showing a local installation of the library instead of a global
  installation.
 */
const squares = document.querySelectorAll('.colored-block');

const width = 360;
const height = 640;
const framerate = 30;
const frameCount = 2 * framerate; // 2 seconds

// A list of functions that will be run to render each frame
const frames = [];

// We go all around the color wheel
const hueChange = 360 / frameCount;

// Generate functions that will set the background color of each square for each frame
let hues = [null, 180, 270, 360];

for (let frame = 0; frame < frameCount; frame++) {
  frames[frame] = () => {
    squares.forEach((square, i) => {
      const hue = hues[i] + hueChange * frame;

      square.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    });
  };
}

window.videobrew = {
  init: () => {
    return {
      width: width,
      height: height,
      framerate: framerate,
      frameCount: frameCount,
    };
  },
  tick: (frame) => {
    // run all frames up to the and including the current frame
    for (let i = 0; i <= frame; i++) {
      frames[i]();
    }
  }
};