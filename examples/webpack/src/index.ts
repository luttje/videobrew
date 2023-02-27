
import { makeFadeFrames, makeParallelFrames, makePulseFrames, makeShiftBackgroundFrames, makeWaitFrames } from './make-frames';
import { Video } from './video';
// For demonstration purposes, we are importing a JSON file
// but you could get this data from an API call or any other source
import data from './fakeapi.json';
import './index.scss';

const screen = document.getElementById('screen');

// Show an intro screen that has the city image as background and shows the city name and state name
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

// Show the weather screen that has the weather image hovering, showing the temperature and wind speed (with wind icon)
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

const video = new Video('#screen');

video.addSceneToFrames(startIntroScene);

const duration = 3;
const fadeTime = 0.2;

video.addToFrames(
  makeParallelFrames(
    // Scene lasts 3 seconds
    video.frameCountFromSeconds(duration),

    // Shifting the whole time
    makeShiftBackgroundFrames('#screen', 0, -100, video.frameCountFromSeconds(duration)),

    // But only fading out at the end
    [
      ...makeWaitFrames(video.frameCountFromSeconds(duration - fadeTime)), // fade out starts at 2.8 seconds
      ...makeFadeFrames('#screen', 1, 0, video.frameCountFromSeconds(fadeTime)) // fade out lasts 0.2 seconds
    ]
  )
)

video.addSceneToFrames(startWeatherScene);

video.addToFrames(makeFadeFrames('#screen', 0, 1, video.frameCountFromSeconds(0.2)))

video.addToFrames(
  makeParallelFrames(
    video.frameCountFromSeconds(3),
    makePulseFrames('.icon', 3, video.frameCountFromSeconds(3)),
    makeShiftBackgroundFrames('#screen', -100, -200, video.frameCountFromSeconds(3))
  )
);

video.addToFrames(makeFadeFrames('#screen', 1, 0, video.frameCountFromSeconds(0.2)));

async function main() {
  await video.play();
  console.log('Video finished');
}

main();