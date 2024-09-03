<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { SSE } from 'sse.js';
	import { browser } from '$app/environment';

	$: webShareAPISupported = browser && typeof navigator.share !== 'undefined';
	const siteTitle = 'Roast MY FPL';
    const siteUrl = 'https://roastmyfpl.com';

	let loading = false;
	let error = false;

	let inputText = '';

	let answer = '';

	$: handleWebShare;


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

	// Function to calculate the required canvas height based on the text
    function calculateCanvasHeight(text : string, context : CanvasRenderingContext2D, width : number) {
        context.font = '16px Arial'; // Set the font to be used
        const lineHeight = 24; // Set line height
        let lines = 0;
        let line = '';
        const words = text.split(' ');

        words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;
            if (testWidth > width && index > 0) {
                lines++;
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines++; // Account for the last line

        return lines * lineHeight + 300; // Calculate total height (including some padding)
    }


	function captureResponse(){
		let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
		let context = canvas.getContext("2d") as CanvasRenderingContext2D;
		// Get the device pixel ratio, falling back to 1.
		var dpr = window.devicePixelRatio || 1;


		// Get the content from the <p> tag
		const text = document.getElementById('roast-response')?.innerText;
		if(text){

		// Set canvas dimensions
        const width = 600;
        const height = calculateCanvasHeight(text, context, width);

        canvas.width = width * dpr;
        canvas.height = height * dpr;


		context.scale(dpr, dpr);
        
		// Set the background color
		context.fillStyle = 'rgb(29, 35, 42)';
		// Clear the canvas
        context.clearRect(0, 0, width, height);
		context.fillRect(0, 0, width, height);
		
		

		 // Set font styles
		context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillStyle = 'rgb(166, 173, 186)';
		// Draw the title at the top
        context.fillText('Roast My FPL ⚽︎', width / 2, 50);

		

		 // Set font for the content
		 context.font = '16px Arial';
        context.textAlign = 'left';

		

		// Define the starting point for the content text
        const x = 50;
        let y = 100;
        const lineHeight = 24;

		// Break the text into lines that fit within the canvas
		
        const words = text.split(' ');
        let line = '';
        const maxWidth = width - 100;

		words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth && index > 0) {
                context.fillText(line, x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        });
        context.fillText(line, x, y);
		// Draw the webpage at the bottom right
		context.font = 'italic 14px Arial';
        context.textAlign = 'right';
        context.fillText('https://roast-fpl.pages.dev/', width - 50, height - 30);
	}

	 

		// Export the canvas to its data URI representation
		var roastImage = canvas.toDataURL("image/png");



		return roastImage;
	}

	const handleWebShare = async () => {
    const image = captureResponse();

    try {
        // Convert the data URI to a Blob
        const response = await fetch(image);
        const blob = await response.blob();

        // Create a File from the Blob
        const file = new File([blob], "roast.png", { type: "image/png" });

        // Check if the Web Share API is supported
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Roast My FPL',
                text: 'Check out this roast from Roast My FPL ⚽︎',
            });
        } else {
			webShareAPISupported = false;
            console.log("File sharing on Web Share API is not supported");
        }
    } catch (error) {
        console.log('Error sharing', error);
    }
};

const copyToClipboard = async () => {
    const image = captureResponse();

    try {
        const response = await fetch(image);
        const blob = await response.blob();
        const item = new ClipboardItem({ "image/png": blob });

        await navigator.clipboard.write([item]);
    } catch (error) {
        console.log('Failed to copy image', error);
    }
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
			{#if answer}
			<div class="max-w-md mx-auto sm:p-4">
				<p id="roast-response" class="sm:p-4">{answer}</p>
			</div>
				{#if webShareAPISupported}
				<div class="max-w-md flex flex-col lg:flex-row">
					<IconButton svgUrl="icons/share.svg" name="Share" bgColor="bg-teal-500" additionalClasses="text-white flex-1" onClick={handleWebShare}/>
				</div>
				{:else}
				<div class="max-w-md flex flex-col lg:flex-row lg:space-x-2">
					<IconButton svgUrl="icons/copy.svg" name="Copy" bgColor="bg-teal-500" additionalClasses="text-white flex-1" onClick={copyToClipboard}/>	
				</div>
				{/if}
			<canvas hidden id="myCanvas" style="background-color:black">
			</canvas>
			{/if}
		</div>
		
		
	</div>

</div>
