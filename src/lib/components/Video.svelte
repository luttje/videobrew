<script lang="ts">
  import { onMount } from "svelte";

  type Ball = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };

  export let canvasWidth: number;
  export let canvasHeight: number;

  let balls: Ball[] = [];
  for (let i = 0; i < 4; i++) {
    balls.push({
      x: Math.random() * 300,
      y: Math.random() * 300,
      dx: Math.random() * 3 - 1,
      dy: Math.random() * 3 - 1,
      radius: 25,
    });
  }

  onMount(() => {
    function move() {
      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        ball.x += ball.dx;
        ball.y += ball.dy;

        const diameter = ball.radius * 2;

        if (ball.x + diameter > canvasWidth) {
          ball.x = canvasWidth - diameter;
          ball.dx *= -1;
        } else if (ball.x < 0) {
          ball.x = 0;
          ball.dx *= -1;
        } else if (ball.y + diameter > canvasHeight) {
          ball.y = canvasHeight - diameter;
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

            // Rotate other ball position
            const otherX = 0;
            const otherY = 0;

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

    setInterval(move, 1000 / 60);
  });
</script>

<!-- 4 balls that are positioned absolutely -->
{#each balls as ball}
  <div
    style="top: {ball.y}px; left: {ball.x}px; width: {ball.radius * 2}px; height: {ball.radius * 2}px;"
    class="absolute bg-red-500 rounded-full"
  />
{/each}