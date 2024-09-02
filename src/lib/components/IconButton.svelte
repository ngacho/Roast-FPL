<script>
    export let bgColor = 'bg-[#128c7e]'; // Default background color using TailwindCSS
    export let svgUrl;
    export let name;
    export let additionalClasses = ''; // Allow additional classes to be passed
    export let onClick;
  </script>
  
  <button
    type="button"
    data-twe-ripple-init
    data-twe-ripple-color="light"
    class="mb-2 flex items-center justify-center rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg {bgColor} {additionalClasses}"
    on:click={onClick}>
    <span class="inline-flex items-center [&>img]:h-4 [&>img]:w-4 mr-2">
      <img src="{svgUrl}" alt="{name} icon" />
    </span>
    {name}
  </button>
  