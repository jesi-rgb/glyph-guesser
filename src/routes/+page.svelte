<script>
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin } from '$lib/utils/utils.js';

	let options = { duration: 300, easing: cubicOut };

	let charSet = 'abcdefghijklmnopqrstuvwxyz';
	let charIndex = Math.floor(Math.random() * charSet.length);
	$: selectedChar = charSet[charIndex];

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
