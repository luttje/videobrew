window.addEventListener('message', function (event) {
  if (event.origin !== document.location.origin)
    return;
  
  switch (event.data.type) {
    case 'videobrew.init':
      setup();
      break;
    case 'videobrew.tick':
      tick(event.data.frame);
      break;
  }
});

const squares = document.querySelectorAll('div');
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
let initialHues = [90, 180, 270, 360];
let hues = [];

const width = 360;
const height = 640;
const framerate = 30;
const estimatedFrameCount = 2 * framerate; // seconds

function messageRenderer(type, data) {
  parent.postMessage({ ...data, type }, document.location.origin);
}

function setup() {
  messageRenderer('videobrew.setup', {
    width: width,
    height: height,
    framerate: framerate,
    estimatedFrameCount: estimatedFrameCount,
  });
}

function tick(frame) {
  if(frame === 0) {
    hues = [...initialHues];
  } else if (frame === estimatedFrameCount) {
    messageRenderer('videobrew.end');
    return;
  }

  move();
}

function move() {
  hues = hues.map(hue => (hue + 1) % 360);
  squares.forEach((square, i) => {
    square.style.backgroundColor = `hsl(${hues[i]}, 100%, 50%)`;
  });
}