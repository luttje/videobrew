<script lang="ts">
	import type { 
    shared,
  } from "solommo-transport";
	import Secondary from "../button/Secondary.svelte";

  export let item: shared.ItemMessage;
</script>

<Secondary square on:click>
  <img src={`${item.asset?.rootUrl}${item.asset?.pathContent}`} 
    class="w-8 h-8"
    alt={item.name} />
</Secondary>