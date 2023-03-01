<script lang="ts">
  /**
   * This page draws a preview of the video.
   */
  import { onMount } from "svelte";
  import Setting from "$lib/components/Setting.svelte";
  import Primary from "$lib/components/button/Primary.svelte";
  import Text from "$lib/components/input/Text.svelte";
  import Range from "$lib/components/input/Range.svelte";
  import { VIDEO_APP_PROXY_PATH } from "$lib/video";
  import Tag from "$lib/components/content/Tag.svelte";
  
  let overlay: { heading: string; message: string } | null = {
    heading: 'Loading...',
    message: `Please wait while we load your video...`,
  };
  let scaleSetting: number = 0.2;

  let width: number;
  let height: number;
  let framerate: number;
  let frameCount: number;
  
  let timeline: HTMLDivElement;
  let scrubbing = false;

  let videoInterval: NodeJS.Timer;
  let video: HTMLIFrameElement;
  type VideoPlayback = {
    playing: boolean;
    frame: number;
  };
  let videoPlayback: VideoPlayback = {
    playing: false,
    frame: 0,
  };

  function getVideoApp() {
    if(!video.contentWindow)
      throw new Error('Video app not loaded');

    return video.contentWindow.videobrew;
  }

  async function drawCurrentFrame() {
    await getVideoApp().tick(videoPlayback.frame);
  }

  function play() {
    videoPlayback.playing = true;

    if(videoInterval)
      clearInterval(videoInterval);

    if (hasReachedEnd())
      reset();

    videoInterval = setInterval(async () => {
      if(!videoPlayback.playing)
        return;
    
      await drawCurrentFrame();

      nextFrame();
    }, 1000 / framerate);
  }

  function pause() {
    videoPlayback.playing = false;
  }

  function startScrubbing(event: MouseEvent) {
    scrubbing = true;
    scrub(event);
  }

  function finishScrubbing() {
    scrubbing = false;
  }

  async function scrub(event: MouseEvent) {
    if(!scrubbing)
      return;

    if(!event.buttons){
      finishScrubbing();
      return;
    }

    const { left, width } = timeline.getBoundingClientRect();
    const x = event.clientX - left;
    const percent = x / width;

    videoPlayback.frame = Math.max(0, Math.min(frameCount - 1, Math.floor(percent * frameCount)));
    await drawCurrentFrame();
  }

  function hasReachedStart() {
    return videoPlayback.frame - 1 <= 0;
  }

  function hasReachedEnd() {
    return videoPlayback.frame + 1 >= frameCount;
  }

  function nextFrame() {
    if(hasReachedEnd())
      pause();
    else
      videoPlayback.frame++;
  }

  function previousFrame() {
    if(hasReachedStart())
      pause();
    else
      videoPlayback.frame--;
  }

  function reset() {
    videoPlayback.frame = 0;
  }

  async function stop() {
    if(videoInterval)
      clearInterval(videoInterval);

    pause();
    reset();
    await drawCurrentFrame();
  }

  async function onVideoLoad() {
    console.log('Video loaded');

    const setup = await getVideoApp().init();
    
    ({ width, height, framerate, frameCount } = setup);
    
    video.classList.remove('hidden');
    overlay = null;

    await drawCurrentFrame();
  }

  onMount(() => {
    let videoUrl = window.VIDEOBREW_VIDEO_APP_URL;

    video.src = VIDEO_APP_PROXY_PATH;

    overlay = {
      heading: 'Loading...',
      message: `Please wait while we load your video @ <a href="${videoUrl}" target="_new">${videoUrl}</a>`,
    };
    
    const loadError = () => {
      overlay = {
          heading: 'Video not found',
          message: `We couldn't find your video @ <a href="${videoUrl}" target="_new">${videoUrl}</a><br>You should check that you are serving your video correctly.`,
        };
    };

    fetch(videoUrl)
      .then((response) => {
        if (!response.ok)
          return loadError();
      })
      .catch((error) => loadError());
  });
</script>

<svelte:window
  on:mousemove={scrub}
  on:mouseup={finishScrubbing} />

<main class="flex flex-col gap-4">
  <div
    class="flex flex-col bg-slate-700 border-inside border-2 border-slate-600"
  >
    <div class="flex flex-row justify-end p-4 items-center">
      <div class="flex-1">
        <Setting>
          Zoom
          <Range
            slot="input"
            step={0.1}
            min={0.1}
            max={1}
            bind:value={scaleSetting}
          />
        </Setting>
      </div>
      <Primary shrink
        title="Refresh video app"
        on:click={() => video.contentWindow?.location.reload()}>
        ⭯
      </Primary>
    </div>
    <div class="flex flex-col items-center p-4 bg-slate-800 rounded">
      <div class="overflow-hidden"
        style="width: {width*scaleSetting}px; height: {height*scaleSetting}px;"
        >
        <div
          class="relative overflow-hidden inline-block bg-white"
          style="width: {width}px; height: {height}px; transform: scale({scaleSetting}); transform-origin: top left;"
        >
          <iframe bind:this={video} 
            on:load={onVideoLoad}
            title="Video described by web-app"
            class="hidden"
            id="video"
            {width}
            {height}>
          </iframe>
        </div>
      </div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="flex flex-row gap-2 justify-items-stretch">
    <Primary shrink
      title="Previous frame"
      on:click={() => {
        previousFrame();
        drawCurrentFrame();
      }}>❮</Primary>
    <div class="relative flex-1 flex flex-row"
      bind:this={timeline}
      on:mousedown={startScrubbing}>
      <div
        class="bg-slate-700 rounded-lg"
        style="width: {videoPlayback.frame / (frameCount - 1) * 100}%;"
      ></div>
      <div class="grid place-content-center text-sm absolute inset-0 select-none">
        {videoPlayback.frame} / {frameCount - 1}
      </div>
    </div>
    <Primary shrink
      title="Next frame"
      on:click={() => {
        nextFrame();
        drawCurrentFrame();
      }}>❯</Primary>
  </div>

  {#if videoPlayback.playing}
    <div class="flex flex-row gap-2">
      <Primary on:click={pause}>Pause</Primary>
      <Primary on:click={stop}>Stop</Primary>
    </div>
  {:else}
    <Primary on:click={play}>Play</Primary>
  {/if}

  <div class="rounded bg-slate-700 p-4">
    <h2 class="text-xl">How to render</h2>
    <p>You can render this video by running this command in the root of your video project:</p>
    <pre>videobrew render</pre>
  </div>
  
  <div class="flex flex-col gap-2 rounded bg-slate-700 p-4">
    <h2 class="text-xl">Video Setup</h2>
    <div class="flex flex-row flex-wrap gap-2 list-disc list-inside">
      <Tag>
        <span>📺</span>
        <span>{width} x {height}</span>
      </Tag>
      <Tag>
        <span>⌚</span>
        <span>{framerate} frames per second</span>
      </Tag>
      <Tag>
        <span>🎞</span>
        <span>{frameCount} frames</span>
      </Tag>
    </div>
  </div>
</main>

{#if overlay}
<div class="fixed text-black bg-black bg-opacity-50 inset-0 z-50 flex flex-col items-center justify-center">
  <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow w-64">
    <h1 class="text-2xl font-bold">{overlay.heading}</h1>
    <p class="text-gray-600">{@html overlay.message}</p>
  </div>
</div>
{/if}