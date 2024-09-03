<script lang="ts">
    export let svgUrl: string;
    export let name: string;
    export let bgColor: string;
    export let additionalClasses: string = '';
    export let onClick;
    export let processingStatus : boolean;
    
  
  </script>
  
  <button
    class={`flex items-center justify-center p-2 rounded ${bgColor} ${additionalClasses}`}
    on:click={onClick}
    disabled={processingStatus}
  >
    {#if processingStatus}
      <svg
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    {:else}
      <img src={svgUrl} alt={name} class="h-5 w-5" />
      <span class="ml-2">{name}</span>
    {/if}
  </button>
  
  <style>
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  </style>
  