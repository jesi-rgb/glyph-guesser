<script>
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin } from '$lib/utils/utils.js';
	import { fonts } from '$lib/fonts.js';
	import { onMount } from 'svelte';

	let options = { duration: 300, easing: cubicOut };

	let charSet = 'abcdefghijklmnopqrstuvwxyz';
	let charIndex = Math.floor(Math.random() * charSet.length);
	let fontIndex = Math.floor(Math.random() * fonts.length);

	$: selectedChar = charSet[charIndex];
	$: selectedFont = fonts[fontIndex];

	let selectedCharKey = {};
	let spinKey = {};

	const reload = () => {
		charIndex = Math.floor(Math.random() * charSet.length);
		fontIndex = Math.floor(Math.random() * fonts.length);

		selectedCharKey = {};
		spinKey = {};
	};

	const keyReload = (e) => {
		if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
			reload();
		}
	};

	$: fontName = selectedFont.family;
	$: fontUrl = selectedFont.files['regular'];

	$: if (document) {
		document.fonts.add(new FontFace(fontName, `url(${fontUrl})`));
	}

	let visible = false;
	onMount(() => {
		const font = new FontFace(fontName, `url(${fontUrl})`);
		document.fonts.add(font);
		visible = true;
	});
</script>

{#if visible}
	<div in:fly={{ y: 100, duration: 1000 }} class="flex flex-col items-center">
		{#key selectedCharKey}
			<div
				in:fly={{ y: 20 }}
				class="glyph text-9xl max-w-sm mx-auto text-center my-20"
				style:font-family={fontName}
			>
				{selectedChar}
			</div>
		{/key}
		<div>{fontName}</div>
		{#key spinKey}
			<button on:click={reload} in:spin={options} class="text-3xl font-semibold"
				><ArrowCounterClockwise weight="bold" size={40} /></button
			>
		{/key}
	</div>
{/if}

<svelte:head>
	<title>Font Guesser</title>
</svelte:head>

<svelte:window on:keypress|preventDefault={keyReload} />
