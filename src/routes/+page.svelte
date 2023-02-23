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

  let framerateSetting: string = "30";
  let widthSetting: string = "1080";
  let heightSetting: string = "1920";
  let scaleSetting: number = 0.2;
  let oldScaleSetting: number = 0.2;

  let width: number;
  let height: number;

  $: width = parseInt(widthSetting);
  $: height = parseInt(heightSetting);

  let canvas: HTMLElement;
  let renderContext: Context | null = null;
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

  function previousFrame() {
    videoPlayback.frame--;
  }

  function reset() {
    videoPlayback.frame = 0;
  }

  function stop() {
    videoPlayback.playing = false;
    videoPlayback.frame = 0;
  }

  async function recordStart() {
    frames = [];
    oldScaleSetting = scaleSetting;
    scaleSetting = 1;
    renderContext = await createContext(canvas, {
      // @ts-ignore 2322
      workerUrl,
      workerNumber: 1,
      type: "image/jpeg",
    });
  }

  async function recordStop() {
    destroyContext(renderContext!);
    renderContext = null;
    scaleSetting = oldScaleSetting;
    const videoBlob = await videoBuilder.fromFrames(
      frames,
      parseInt(framerateSetting)
    );
    const videoUrl = URL.createObjectURL(videoBlob);

    // Download video
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.target = "_blank";
    a.href = videoUrl;
    a.click();
  }

  onMount(() => {
    let lastFrameTime = 0;

    async function animate() {
      requestAnimationFrame(animate);

      if (!canvas) return;

      if (!videoPlayback.playing) return;

      const now = performance.now();
      const elapsed = now - lastFrameTime;
      const frameDuration = 1000 / parseInt(framerateSetting);

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
        <Text slot="input" disabled bind:value={framerateSetting} />
      </Setting>
      <Setting>
        Resolution
        <div slot="input" class="flex flex-row gap-2">
          <Text small disabled bind:value={widthSetting} />
          x
          <Text small disabled bind:value={heightSetting} />
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
        style="width: {widthSetting}px; height: {heightSetting}px; transform: scale({scaleSetting}); transform-origin: top left;"
      >
        <Video bind:this={video} {width} {height} />
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

  <Primary on:click={recordStart}>Start Recording</Primary>

  <Primary on:click={recordStop}>Stop Recording</Primary>
</main>
