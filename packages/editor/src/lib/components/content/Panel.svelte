<script lang="ts">
  import PanelHeading from "../heading/PanelHeading.svelte";
	import Separator from "./Separator.svelte";
</script>

<div class="flex flex-col rounded w-full max-w-prose bg-white gap-4 p-6 max-h-screen flex-nowrap mx-auto">
  {#if $$slots.heading}
  <div class="flex flex-col gap-4 shrink-0">
    <slot name="heading" />
    <Separator />
  </div>
  {/if}

  <div class="grow relative overflow-auto">
    <slot />
  </div>
  
  {#if $$slots.footer}
  <div class="flex flex-col gap-4 shrink-0">
    <slot name="footer" />
  </div>
  {/if}
</div>