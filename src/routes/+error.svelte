<script>
	import { page } from '$app/stores';
</script>

<div>
    {#if $page.error}
    <h1>{$page.error.message}</h1>
{:else}
    <h1>Something went wrong</h1>
{/if}

</div>

