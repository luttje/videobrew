<script>
  import { createEventDispatcher } from "svelte";
</script>

<div class="flex flex-row gap-4 items-center" role="setting">
  <span class="text-sm italic">
    <slot />:
  </span>
  <slot name="input" />
</div>
