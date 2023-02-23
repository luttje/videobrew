<script lang="ts">
  /**
   * This page draws a preview of the video on a canvas and records it.
   */
  import {
    createContext,
    destroyContext,
    domToBlob,
    type Context,
  } from 'modern-screenshot';
  import workerUrl from 'modern-screenshot/worker?url';
  import * as videoBuilder from '$lib/video-from-frames';
  import { onMount } from 'svelte';
  import Setting from '$lib/components/Setting.svelte';
  import Primary from '$lib/components/button/Primary.svelte';
  import Text from '$lib/components/input/Text.svelte';
  import Video from '$lib/components/Video.svelte';

  let framerateSetting: string = '30';
  let widthSetting: string = '1080';
  let heightSetting: string = '1920';
  let scale: number = 1;

  let canvas: HTMLElement;
  let canvasWidth: number = 0;
  let canvasHeight: number = 0;
  let context: Context | null = null;
  let frames: Blob[] = [];

  $: canvasWidth = Math.round(parseInt(widthSetting) * scale);
  $: {
    const width = parseInt(widthSetting);
    const height = parseInt(heightSetting);
    const aspectRatio = width / height;

    // Round to at most 4 decimal places
    canvasHeight = Math.round(canvasWidth / aspectRatio * 10000) / 10000;
  }

  async function recordStart() {
    frames = [];
    context = await createContext(document.body, {
      // @ts-ignore 2322
      workerUrl,
      workerNumber: 1,
      type: 'image/jpeg',
    });
  }

  async function recordStop() {
    destroyContext(context!);
      context = null;
      const videoBlob = await videoBuilder.fromFrames(
        frames,
        parseInt(framerateSetting)
      );
      const videoUrl = URL.createObjectURL(videoBlob);

      // Download video
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.target = '_blank';
      a.href = videoUrl;
      a.click();
  }

  // Ensure the canvas fits the screen
  function calculateScale() {
    if(!canvas)
      return;

    const parent = canvas.parentElement!;
    const parentPadding =
      parseInt(getComputedStyle(parent).paddingLeft) +
      parseInt(getComputedStyle(parent).paddingRight);
    const canvasMargin =
      parseInt(getComputedStyle(canvas).marginLeft) +
      parseInt(getComputedStyle(canvas).marginRight);
    const parentWidth = parent.clientWidth - parentPadding - canvasMargin;

    const width = parseInt(widthSetting);
    scale = parentWidth / width;
  }

  onMount(() => {
    calculateScale();

    let lastFrameTime = 0;

    async function animate() {
      requestAnimationFrame(animate);

      if(!canvas)
        return;

      const now = performance.now();
      const elapsed = now - lastFrameTime;
      const frameDuration = 1000 / parseInt(framerateSetting);

      if (elapsed > frameDuration) {
        lastFrameTime = now - (elapsed % frameDuration);

        if (context) {
          const frame = await domToBlob(context);
          frames.push(frame);
        }
      }
    }

    animate();
  });
</script>

<svelte:window on:resize={calculateScale} />

<main class="flex flex-col gap-4">
  <div class="flex flex-col bg-slate-700 border-inside border-2 border-slate-600">
    <div class="flex flex-col gap-2 p-4 bg-slate-600 items-center">
      <Setting>
        Framerate
        <Text slot="input" bind:value={framerateSetting} />
      </Setting>
      <Setting>
        Resolution
        <div slot="input" class="flex flex-row gap-2">
          <Text small bind:value={widthSetting} />
          x
          <Text small bind:value={heightSetting} />
        </div>
      </Setting>
    </div>
    <div bind:this={canvas}
      class="relative overflow-hidden inline-block bg-white self-center m-2 max-w-full"
      style="width: {canvasWidth}px; height: {canvasHeight}px;">
      <Video {canvasWidth} {canvasHeight} />
    </div>
  </div>

  <Primary on:click={recordStart}>
    Start Recording
  </Primary>

  <Primary on:click={recordStop}>
    Stop Recording
  </Primary>
</main>
