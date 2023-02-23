<script lang="ts">
	import { onMount } from "svelte";

  export let id: string|undefined = undefined;
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let required: boolean = false;

  onMount(() => {
    if(!id)
      id = `checkbox-${Math.random().toString(36).substring(2, 15)}`;
  });
</script>

<div class="flex flex-row items-center gap-2">
  <input type="checkbox"
    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:border-transparent focus:ring-blue-600 focus:ring-2 focus:ring-offset-1"
    {id}
    {checked} 
    {disabled} 
    {required} />

  <label for="{id}"><slot /></label>
</div>