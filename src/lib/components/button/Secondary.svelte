<script lang="ts">
    export let href: string = "";
    export let small: boolean = false;
    export let disabled: boolean = false;
    export let selected: boolean = false;
    export let square: boolean = false;
</script>

<a on:click 
    class:px-8="{ !small }"
    class:py-8="{ !small && square }"
    class:py-4="{ (!small && !square) || (small && square) }"
    class:px-4="{ small }"
    class:py-2="{ small && !square }"
    class:opacity-50="{ disabled }"
    class:hover:bg-gray-100="{ !disabled }"
    class:focus:border-gray-900="{ !disabled }"
    class:focus:ring="{ !disabled }"
    class:ring="{ selected }"
    data-is-selected="{ selected }"
    tabindex="{ !disabled ? 0 : -1 }"
    class="flex flex-1 items-center justify-center text-center gap-2 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 text-xs uppercase tracking-widest ring-indigo-500 transition ease-in-out duration-150 aria-disabled:cursor-not-allowed aria-disabled:opacity-25 active:bg-gray-900 focus:outline-none focus:ring-offset-2"
    href={!disabled ? href : 'javascript:void(0);'}>
    <slot />
</a>
