<script lang="ts">
  /**
   * This page draws a preview of the video on a canvas and records it.
   */
  import {
    createContext,
    destroyContext,
    domToBlob,
    type Context,
  } from "modern-screenshot";
  import workerUrl from "modern-screenshot/worker?url";
  import * as videoBuilder from "$lib/video-from-frames";
  import { onMount } from "svelte";
  import Setting from "$lib/components/Setting.svelte";
  import Primary from "$lib/components/button/Primary.svelte";
  import Text from "$lib/components/input/Text.svelte";
  import Video from "$lib/components/Video.svelte";
  import Range from "$lib/components/input/Range.svelte";

  let scaleSetting: number = 0.2;
  let oldScaleSetting: number = 0.2;

  let width: number;
  let height: number;
  let framerate: number;
  let estimatedFrameCount: number;

  let canvas: HTMLElement;
  let renderContext: Context | null = null;
  let renderEncodingProgress: number | null = null;
  let frames: Blob[] = [];

  let video: Video;
  type VideoPlayback = {
    playing: boolean;
    frame: number;
  };
  let videoPlayback: VideoPlayback = {
    playing: false,
    frame: 0,
  };

  function play() {
    videoPlayback.playing = true;
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
    video.tick(videoPlayback.frame);
  }

  async function render() {
    reset();
    frames = [];
    oldScaleSetting = scaleSetting;
    scaleSetting = 1;
    renderContext = await createContext(canvas, {
      // @ts-ignore 2322
      workerUrl,
      workerNumber: 1,
      type: "image/jpeg",
    });
    play();
  }

  async function renderEnd() {
    stop();
    destroyContext(renderContext!);
    const renderEncodingStart = performance.now();
    const estimatedDuration = frames.length * 100;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - renderEncodingStart;
      renderEncodingProgress = Math.min((elapsed / estimatedDuration) * 100, 99);
    }, 100);

    renderContext = null;
    scaleSetting = oldScaleSetting;
    const videoBlob = await videoBuilder.fromFrames(
      frames,
      framerate
    );
    const videoUrl = URL.createObjectURL(videoBlob);

    // Download video
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.target = "_blank";
    a.href = videoUrl;
    a.click();

    clearInterval(interval);
    renderEncodingProgress = null;
  }

  onMount(() => {
    let lastFrameTime = 0;
    
    video.tick(videoPlayback.frame);

    async function animate() {
      requestAnimationFrame(animate);

      if (!canvas) {
        return;
      }

      if (!videoPlayback.playing) {
        return;
      }

      const now = performance.now();
      const elapsed = now - lastFrameTime;
      const frameDuration = 1000 / framerate;

      if (elapsed > frameDuration) {
        video.tick(videoPlayback.frame);
        nextFrame();

        lastFrameTime = now - (elapsed % frameDuration);

        if (renderContext) {
          const frame = await domToBlob(renderContext);
          frames.push(frame);
        }
      }
    }

    animate();
  });
</script>

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
        bind:this={canvas}
        class="relative overflow-hidden inline-block bg-white"
        style="width: {width}px; height: {height}px; transform: scale({scaleSetting}); transform-origin: top left;"
      >
        <Video bind:this={video} 
          bind:width={width} 
          bind:height={height} 
          bind:framerate={framerate} 
          bind:estimatedFrameCount={estimatedFrameCount}
          on:end={renderEnd}
        />
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

  <Primary on:click={render}>Render</Primary>
</main>

{#if renderContext || renderEncodingProgress}
<div class="fixed text-black bg-black bg-opacity-50 inset-0 z-50 flex flex-col items-center justify-center">
  <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow w-64">
    <h1 class="text-2xl font-bold">Rendering</h1>
    <p class="text-gray-600">This may take a while.</p>

    <h2 class="flex flex-row gap-2">
      <span>
      {#if renderContext}
      📽
      {:else}
      ✔
      {/if}
      </span>
      Rendering frames:
    </h2>
    {#if renderContext}
    <div class="relative w-full h-5 bg-gray-400 rounded">
      <div
        class="absolute top-0 left-0 h-full bg-blue-500 rounded"
        style="width: {videoPlayback.frame / estimatedFrameCount * 100}%;"
      ></div>

      <div class="absolute inset-0 h-full flex items-center justify-center">
        <p class="text-xs font-semibold text-white">
          {videoPlayback.frame} / {estimatedFrameCount}
        </p>

        <p class="text-xs font-semibold text-white ml-2">
          {Math.round(videoPlayback.frame / estimatedFrameCount * 100)}%
        </p>
      </div>
    </div>
    {/if}

    <h2 class="flex flex-row gap-2">
      <span>
      {#if renderContext}
      ⏳
      {:else if renderEncodingProgress}
      💾
      {:else}
      ✔
      {/if}
      </span>
      Encoding frames:
    </h2>
    <div class="relative w-full h-5 bg-gray-400 rounded">
      {#if renderEncodingProgress}
      <!-- A progress bar that grows as it gets nearer to the ETA -->
      <div
        class="absolute top-0 left-0 h-full bg-blue-500 rounded"
        style="width: {renderEncodingProgress}%;"
      ></div>
      {/if}
    </div>
  </div>
</div>
{/if}