<script>
    import "../app.css"
	import { page } from '$app/stores';
</script>

<div class="hero min-h-[100vh]">
    <div class="hero-content text-center">
      <div class="max-w-lg">
        <h1 class="text-5xl font-bold">This is embarassing...</h1>
        {#if $page.error}
            <p class="py-6 text-2xl">{$page.error.message}</p>
        {:else}
        <div>
            <button class="flex-shrink-0 bg-teal-500 disabled:bg-teal-300 disabled:border-teal-300 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-black py-1 px-2 rounded">
                <a href="/">Return Home</a>
            </button>
        </div>
        {/if} 
      </div>
    </div>
</div>