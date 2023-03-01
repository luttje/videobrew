
import { VideoBuilder } from './video-builder';
// For demonstration purposes, we are importing a JSON file
// but you could get this data from an API call or any other source
import data from './fakeapi.json';
import './index.scss';
import { FrameCount } from './frames';

const screen = document.getElementById('screen');

// Build the scene HTML that shows the city and state
function startIntroScene() {
  screen.style.backgroundImage = `url(${data.image})`;
  screen.innerHTML = `
  <div class="container">
    <div class="text">
      <h1>${data.city}</h1>
      <h2>${data.state}</h2>
    </div>
  </div>`;
}

// Build the scene HTML that shows the weather data
function startWeatherScene() {
  screen.innerHTML = `
  <div class="container">
    <div class="text">
      <h1>
        ${data.temperature.value}°${data.temperature.unit} -
        ${data.weather.main}
      </h1>
      <span>
        ${data.weather.description}
      </span>
    </div>
    <div class="text-detail">
      <img src="icons8-windsock-64.png" />
      <h3>${data.wind.speed} ${data.wind.unit}</h3>
    </div>
  </div>`
    + `<img class="icon" src="${data.weather.image}" style="transform: translate(-50%, -50%);" />`;
}

const videoBuilder = new VideoBuilder('#screen');

// Add the scene constructor to the video, the builder then describes how frames 
// should modify the HTML and CSS of the scene constructor
videoBuilder.addScene(startIntroScene, (scene) => {
  const duration = 3;
  const fadeTime = 0.2;
  
  scene.addParallelFrames(
    FrameCount.fromSeconds(duration),
    (parallelScene) => {
      parallelScene.addHorizontalBackgroundShiftFrames('#screen', 0, -100, FrameCount.fromSeconds(duration));
    },
    (parallelScene) => {
      parallelScene
        .addWaitFrames(FrameCount.fromSeconds(duration - fadeTime))
        .addFadeFrames('#screen', 1, 0, FrameCount.fromSeconds(fadeTime));
    }
  )
});

// Weather Scene
videoBuilder.addScene(startWeatherScene, (scene) => {
  scene.addFadeFrames('#screen', 0, 1, FrameCount.fromSeconds(0.2));

  scene.addParallelFrames(
    FrameCount.fromSeconds(3),
    (parallelScene) => {
      parallelScene.addPulseFrames('.icon', 3, FrameCount.fromSeconds(3));
    },
    (parallelScene) => {
      // parallelScene.addHorizontalBackgroundShiftFrames('#screen', -100, -200, FrameCount.fromSeconds(3));
      // or use a value translation:
      // parallelScene.addValueTranslationFrames('#screen', 'background-position-x', -100, -200, 'px', FrameCount.fromSeconds(3));
      // or use a @keyframe animation:
      parallelScene.addKeyframeAnimationFrames('#screen', 'move-background', FrameCount.fromSeconds(3));
    }
  );
  
  scene.addFadeFrames('#screen', 1, 0, FrameCount.fromSeconds(0.2));
});

// Build the video into a final object with frames that can be previewed and rendered
const video = videoBuilder.build();
const width = 360;
const height = 640;
const framerate = 30;
const frameCount = video.getFrameCount();

declare global {
  interface Window {
    videobrew: {
      init: () => Promise<{
        width: number;
        height: number;
        framerate: number;
        frameCount: number;
      }>;
      tick: (frame: number) => Promise<void>;
    };
  }
}

window.videobrew = {
  async init() {
    return {
      width: width,
      height: height,
      framerate: framerate,
      frameCount: frameCount,
    };
  },
  async tick(frame: number) {
    video.renderFrame(frame);
  }
}
