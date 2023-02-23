<script lang="ts">
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  type Ball = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };

  export const width: number = 1080;
  export const height: number = 1920;
  export const framerate: number = 30;
  export const estimatedFrameCount: number = 2 * framerate;

  let ballStart: Ball[] = [];
  const radius = width / 10;
  const maxSpeed = width / 100;
  for (let i = 0; i < 4; i++) {
    ballStart.push({
      x: Math.random() * (width - radius * 2),
      y: Math.random() * (height - radius * 2),
      dx: Math.random() * maxSpeed - 1,
      dy: Math.random() * maxSpeed - 1,
      radius: radius,
    });
  }
  let balls: Ball[] = [];

  function move() {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      ball.x += ball.dx;
      ball.y += ball.dy;

      const diameter = ball.radius * 2;

      if (ball.x + diameter > width) {
        ball.x = width - diameter;
        ball.dx *= -1;
      } else if (ball.x < 0) {
        ball.x = 0;
        ball.dx *= -1;
      } else if (ball.y + diameter > height) {
        ball.y = height - diameter;
        ball.dy *= -1;
      } else if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
      }

      for (let j = 0; j < balls.length; j++) {
        if (i === j) {
          continue;
        }

        const other = balls[j];
        const dx = ball.x - other.x;
        const dy = ball.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + other.radius) {
          const angle = Math.atan2(dy, dx);
          const sine = Math.sin(angle);
          const cosine = Math.cos(angle);

          // Rotate ball position
          const x = 0;
          const y = 0;

          // Rotate ball velocity
          const xVelocity = ball.dx * cosine + ball.dy * sine;
          const yVelocity = ball.dy * cosine - ball.dx * sine;

          // Rotate other ball velocity
          const otherXVelocity =
            other.dx * cosine + other.dy * sine;
          const otherYVelocity =
            other.dy * cosine - other.dx * sine;

          // Swap ball velocities for realistic bounce effect
          ball.dx = otherXVelocity * cosine - otherYVelocity * sine;
          ball.dy = otherYVelocity * cosine + otherXVelocity * sine;

          other.dx = xVelocity * cosine - yVelocity * sine;
          other.dy = yVelocity * cosine + xVelocity * sine;

          // Move balls apart
          ball.x = other.x + Math.cos(angle) * (ball.radius + other.radius);
          ball.y = other.y + Math.sin(angle) * (ball.radius + other.radius);
        }
      }
    }

    balls = balls;
  }

  export function tick(frame: number) {
    if (frame === 0) {
      // copy the initial state into balls
      balls = ballStart.map((ball) => ({ ...ball }));
    } else if (frame === estimatedFrameCount) {
      dispatch('end');
    }
    move();
  }
</script>

<!-- 4 balls that are positioned absolutely -->
{#each balls as ball}
  <div
    style="top: {ball.y}px; left: {ball.x}px; width: {ball.radius * 2}px; height: {ball.radius * 2}px;"
    class="absolute bg-red-500 rounded-full"
  />
{/each}