<script lang="ts">
  import {
    createContext,
    destroyContext,
    domToBlob,
    type Context,
  } from 'modern-screenshot';
  import workerUrl from 'modern-screenshot/worker?url';
  import * as videoBuilder from '$lib/video-from-frames';
  import { onMount } from 'svelte';

  let recordStartButton: HTMLButtonElement;
  let recordStopButton: HTMLButtonElement;
  let framerateInput: HTMLInputElement;
  let canvas: HTMLCanvasElement;
  let context: Context | null = null;
  let frames: Blob[] = [];

  onMount(() => {
    recordStartButton.addEventListener('click', async () => {
      context = await createContext(document.body, {
        // @ts-ignore 2322
        workerUrl,
        workerNumber: 1,
        type: 'image/jpeg',
      });
      frames = [];
    });

    recordStopButton.addEventListener('click', async () => {
      destroyContext(context!);
      context = null;
      const videoBlob = await videoBuilder.fromFrames(
        frames,
        parseInt(framerateInput.value)
      );
      const videoUrl = URL.createObjectURL(videoBlob);

      // Download video
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.target = '_blank';
      a.href = videoUrl;
      a.click();
    });

    const radius = 20;
    const x = canvas.width / 2;
    let y = canvas.height - radius;
    const ctx = canvas.getContext('2d')!;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }

    let lastFrameTime = 0;
    let frameCount = 0;

    async function animate() {
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      const framerate = parseInt(framerateInput.value, 10);
      const frameDuration = 1000 / framerate;

      if (elapsed > frameDuration) {
        lastFrameTime = now - (elapsed % frameDuration);
        draw();
        y -= 1;
        if (y < 0) {
          y = canvas.height;
        }

        if (context) {
          const frame = await domToBlob(context);
          frames.push(frame);
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  });
</script>

<header>
  <h1 class="font-bold text-lg">Web Video Maker</h1>
  <p class="italic">
    Use Javascript to render something in this canvas. It will be turned into a
    video with FFMPEG.
  </p>
</header>
<main class="flex flex-col gap-4">
  <div>
    <canvas bind:this={canvas}
      class="border border-gray-400"
      width="300"
      height="300"
    />
  </div>

  <input
    bind:this={framerateInput}
    type="text"
    class="rounded border border-gray-400 p-2"
    placeholder="Framerate"
    value="30"
  />

  <button
    bind:this={recordStartButton}
    class="rounded bg-gray-700 text-white p-2"
  >
    Start Recording
  </button>

  <button
    bind:this={recordStopButton}
    class="rounded bg-gray-700 text-white p-2"
  >
    Stop Recording
  </button>
</main>
