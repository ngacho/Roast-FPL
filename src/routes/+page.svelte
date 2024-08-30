<script lang="ts">
	import { SSE } from 'sse.js';

	let loading = false;
	let error = false;

	let inputText = '';

	let answer = '';

	const handleSubmit = async () => {
		loading = true;
		error = false;

		answer = '';

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ inputText })
		});

		inputText = '';

		eventSource.addEventListener('error', (e) => {
			console.log('error', e);
			error = true;
			loading = false;

			alert('An error occured');
		});

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false;
				const data = JSON.parse(e.data);

				if (data.choices[0].finish_reason === 'stop') {
					// End of Stream
					return;
				}

				const { content } = data.choices[0].delta;
				answer = (answer ?? '') + content;
			} catch (err) {
				error = true;
				loading = false;

				console.error(err);
				alert('Failed to read message');
			}
		});
	};
</script>

<div class="sm:m-4">
	<h1 class="text-5xl text-center py-1 mt-4">Roast my FPL ⚽︎</h1>
	<h2 class="text-md text-center py-1 mb-10">Made with 😈 by <a  class="text-sm text-blue-600 dark:text-blue-500 hover:underline" href="https://ngacho.com">Ngacho</a></h2>
</div>


<div class="flex justify-center">
	<div class="flex flex-col">
		<div class="mx-auto max-w-lg p-4">
			<form class="w-full max-w-sm bg-white p-6 shadow-lg rounded-lg" on:submit|preventDefault={handleSubmit}>
				<label for="fpl-id" class="block mb-4 text-sm font-medium text-gray-700 text-center">
				  Don't be shy, enter your FPL ID
				</label>
				<div class="flex items-center border-b border-teal-500 py-1.5">
				  <input
					name="fplID"
					id="fpl-id"
					class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
					type="text"
					placeholder="FPL ID"
					aria-label="FPL ID"
					bind:value={inputText}
				  />
				  {#if !loading} 
				  <button
					class="flex-shrink-0 bg-teal-500 disabled:bg-teal-300 disabled:border-teal-300 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-black py-1 px-2 rounded"
					type="submit"
					disabled={!inputText || inputText.length < 1 || isNaN(parseInt(inputText, 10))}
				  >
					Get Roasted
				  </button>
				  {/if}
				  {#if loading}
				  <button
					class="flex-shrink-0 bg-teal-500 disabled:bg-teal-300 hover:bg-teal-700 text-sm text-black py-1 px-2 rounded"
					disabled
						>Roasting <span class="spinner">⚡</span></button
					>
				  {/if}
				  
				</div>
			  </form>
		</div>
		<div class="mx-5">
			<div class="max-w-md mx-auto sm:p-4">
				{#if answer}
					<p class="sm:p-4">{answer}</p>
				{/if}
			</div>

		</div>
		
		
	</div>

</div>
