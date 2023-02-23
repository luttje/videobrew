<script lang="ts">
    export let href: string = "";
    export let disabled: boolean = false;
    export let selected: boolean = false;
    export let form: string | undefined = undefined;
</script>

<a on:click class="flex items-center justify-center px-8 py-4 gap-2 bg-slate-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest ring-gray-300 transition ease-in-out duration-150 aria-disabled:cursor-not-allowed aria-disabled:opacity-25 hover:bg-slate-500 active:bg-slate-800 focus:outline-none focus:border-slate-900 focus:ring focus:ring-offset-2"
    class:opacity-50="{ disabled }"
    class:ring="{ selected }"
    data-is-selected="{ selected }"
    data-target-form="{ form }"
    tabindex="{ !disabled ? 0 : -1 }"
    href={!disabled ? href : 'javascript:void(0);'}>
    <slot />
</a>
