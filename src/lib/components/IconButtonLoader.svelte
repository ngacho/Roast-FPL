<script lang="ts">
    export let svgUrl: string;
    export let loadingSvgUrl: string;
    export let name: string;
    export let bgColor: string;
    export let additionalClasses: string = '';
    export let onClick;
    export let processingStatus : boolean;
    
  
  </script>

<button
type="button"
class="mb-2 flex items-center justify-center rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg {bgColor} {additionalClasses}"
on:click={onClick}>
{#if !processingStatus}
<span class="inline-flex items-center [&>img]:h-4 [&>img]:w-4 mr-2">
  <img src="{svgUrl}" alt="{name} icon" />
</span>
{name}
{:else}
<span class="spinner">
  <img width="16" src="{loadingSvgUrl}" alt="spinner" />
</span>
{/if}
</button>
