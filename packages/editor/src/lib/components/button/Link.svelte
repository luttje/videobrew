<script lang="ts">
    export let href: string = "";
</script>

<a on:click class="border-gray-300 p-1 rounded font-semibold text-gray-700 ring-indigo-500 transition ease-in-out duration-150 aria-disabled:cursor-not-allowed aria-disabled:opacity-25 hover:bg-gray-100  focus:outline-none hover:ring focus:ring focus:ring-offset-2"
    {href}>
    <slot />
</a>
