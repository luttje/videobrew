<script lang="ts">
	import { onMount } from "svelte";

  export let id: string|undefined = undefined;
  export let placeholder: string|undefined = undefined;
  export let value: string = "";
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let small: boolean = false;
	let inputEl: HTMLElement;

  onMount(() => {
    if(!placeholder && inputEl)
      placeholder = <string>inputEl.textContent;
  });
</script>

<div class="flex flex-col gap-1">
  {#if $$slots.default}
    <label for={id} 
      class="text-sm font-bold text-gray-700"
      bind:this={inputEl}>
      <slot />
    </label>
  {/if}

  <input
    id={id}
    class="flex-1 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent {small ? 'w-20' : 'w-auto'}"
    {placeholder}
    type="text"
    {disabled}
    {required}
    on:input
    bind:value />
</div>