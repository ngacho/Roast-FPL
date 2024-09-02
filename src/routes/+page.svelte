<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import html2canvas from "html2canvas";
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


	function drawCanvas(){
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

// Open the image in a new window
window.open(roastImage , "_blank");

		
	}

	function captureResponse(){
		const element = document.querySelector("#roast-response");
		if(!answer || !element){
			alert("No response to capture");
			return;
		}

		const roastElement = element as HTMLElement;

		html2canvas(roastElement).then(canvas => {
			// Export the canvas to its data URI representation
			var roastImage = canvas.toDataURL("image/png");

			// Open the image in a new window
			window.open(roastImage , "_blank");
			
		});
		
		
	
	}
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
					<p id="roast-response" class="sm:p-4">{answer}</p>
					<div class="text-center mb-2">
						<p class="text-lg font-semibold">Share on:</p>
					</div>
					<div class="flex flex-col lg:flex-row lg:space-x-2">
						<IconButton svgUrl="icons/whatsapp.svg" name="WhatsApp" bgColor="bg-[#128c7e]" additionalClasses="text-white flex-1" onClick={drawCanvas}/>
						<IconButton svgUrl="icons/twitter.svg" name="Twitter" bgColor="bg-[#1da1f2]" additionalClasses="text-white flex-1" onClick={captureResponse}/>
					</div>
				{/if}
				<!-- <p id="roast-response">
					Well, well, well, look at ExtraPressure over here thinking they can handle the heat of Fantasy Premier League. With a total of 68 points, it's safe to say that the pressure got to them real quick. Let's start with Henderson in goal, who's only managed to scrape together 1 point. Maybe he should stick to being a backup goalkeeper in real life too. Moving on to the defense, Hall and Gvardiol are clearly just there for decoration with their measly 1 and 2 points respectively. And Pedro Porro? More like Pedro Pooro with his underwhelming 6 points. In midfield, Nkunku and Elanga might as well not even be on the pitch with their lackluster performances. And don't even get me started on Diogo J. with his paltry 6 points. Salah is carrying this team on his back with 10 points, but even he can't make up for the disaster that is Isak and Muniz up front. Seriously, who thought selecting those two would be a good idea? And finally, we have Haaland as captain, racking up an impressive 34 points. But let's be real, even he can't save this sinking ship of a team. ExtraPressure indeed - looks like the only pressure they're feeling is the pressure of being dead last in their fantasy league.

				</p> -->
				<canvas hidden id="myCanvas" style="background-color:black">
				</canvas>				
			</div>
		</div>
		
		
	</div>

</div>
