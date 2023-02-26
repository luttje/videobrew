<script lang="ts">
  /**
   * This page draws a preview of the video.
   */
  import { onMount } from "svelte";
  import Setting from "$lib/components/Setting.svelte";
  import Primary from "$lib/components/button/Primary.svelte";
  import Text from "$lib/components/input/Text.svelte";
  import Range from "$lib/components/input/Range.svelte";
  
  let overlay: { heading: string; message: string } | null = {
    heading: 'Loading...',
    message: `Please wait while we load your video...`,
  };
  let scaleSetting: number = 0.2;

  let width: number;
  let height: number;
  let framerate: number;
  let frameCount: number;

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

  function messageVideo(type: string, data?: object) {
    if (!video.contentWindow) {
      throw new Error("Video iframe has no contentWindow");
    }

    video.contentWindow.postMessage({ ...data, type }, '*');
  }

  function play() {
    videoPlayback.playing = true;

    if(videoInterval)
      clearInterval(videoInterval);

    videoInterval = setInterval(() => {
      if(!videoPlayback.playing)
        return;
    
      if(videoPlayback.frame >= frameCount)
        stop();

      messageVideo('videobrew.tick', { frame: videoPlayback.frame });
      nextFrame();
    }, 1000 / framerate);
  }

  function pause() {
    videoPlayback.playing = false;
  }

  function nextFrame() {
    videoPlayback.frame++;
  }

  function reset() {
    videoPlayback.frame = 0;
  }

  function stop() {
    pause();
    reset();
    messageVideo('videobrew.tick', { frame: videoPlayback.frame });

    if(videoInterval)
      clearInterval(videoInterval);
  }

  function onVideoLoad() {
    console.log('Video loaded');

    messageVideo('videobrew.init');
    messageVideo('videobrew.tick', { frame: videoPlayback.frame });
  }

  function onMessage(event: MessageEvent) {
    const { data: message } = event;
    
    switch (message.type) {
      case 'videobrew.setup':
        setupVideo(message.width, message.height, message.framerate, message.frameCount);
        break;
    }
  }
  
  function setupVideo(desiredWidth: number, desiredHeight: number, desiredFamerate: number, desiredFrameCount: number) {
    width = desiredWidth;
    height = desiredHeight;
    framerate = desiredFamerate;
    frameCount = desiredFrameCount;

    console.log('Video setup', { width, height, framerate, frameCount });

    video.classList.remove('hidden');
    overlay = null;
  }

  onMount(() => {
    let videoUrl = window.VIDEOBREW_VIDEO_APP_URL;

    video.src = videoUrl;

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

<svelte:window on:message={onMessage} />

<main class="flex flex-col gap-4">
  <div
    class="flex flex-col bg-slate-700 border-inside border-2 border-slate-600"
  >
    <div class="flex flex-col gap-2 p-4 bg-slate-600 items-center">
      <Setting>
        Framerate
        <Text slot="input" disabled value="{framerate?.toString()}" />
      </Setting>
      <Setting>
        Resolution
        <div slot="input" class="flex flex-row gap-2">
          <Text small disabled value="{width?.toString()}" />
          x
          <Text small disabled value="{height?.toString()}" />
        </div>
      </Setting>
      <Setting>
        Scale
        <Range
          slot="input"
          step={0.1}
          min={0.1}
          max={1}
          bind:value={scaleSetting}
        />
      </Setting>
    </div>
    <div class="overflow-hidden m-2"
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
</main>

{#if overlay}
<div class="fixed text-black bg-black bg-opacity-50 inset-0 z-50 flex flex-col items-center justify-center">
  <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow w-64">
    <h1 class="text-2xl font-bold">{overlay.heading}</h1>
    <p class="text-gray-600">{@html overlay.message}</p>
  </div>
</div>
{/if}