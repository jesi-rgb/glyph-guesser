<script>
	import { fly } from 'svelte/transition';
	import { cubicInOut, quadInOut, sineInOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';
	let charSet = 'abcdefghijklmnopqrstuvwxyz';
	let charIndex = Math.floor(Math.random() * charSet.length);
	$: selectedChar = charSet[charIndex];

	console.log(charIndex, selectedChar);

	let selectedCharKey = {};
	let spinKey = {};
	const reload = () => {
		charIndex = Math.floor(Math.random() * charSet.length);
		selectedCharKey = {};
		spinKey = {};
	};

	const keyReload = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			reload();
		}
	};

	let options = { duration: 300, easing: cubicInOut };
	function spin(node, options) {
		const { times = 1 } = options;
		return {
			...options,
			// The value of t passed to the css method
			// varies between zero and one during an "in" transition
			// and between one and zero during an "out" transition.
			css(t) {
				// Svelte takes care of applying the easing function.
				const degrees = 360 * times; // through which to spin
				return `transform: rotate(${t * -degrees}deg);`;
			}
		};
	}
</script>

<div class="flex flex-col items-center">
	{#key selectedCharKey}
		<div in:fly={{ y: 20 }} class="font-bold text-9xl max-w-sm mx-auto text-center my-20">
			{selectedChar}
		</div>
	{/key}
	{#key spinKey}
		<button on:click={reload} in:spin={options} class="text-3xl font-semibold"
			><ArrowCounterClockwise weight="bold" size={40} /></button
		>
	{/key}
</div>

<svelte:window on:keydown|preventDefault={keyReload} />
