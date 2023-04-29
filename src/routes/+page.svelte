<script>
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin } from '$lib/utils/utils.js';
	// import { fonts } from '$lib/fonts.js';
	import { popularFonts } from '$lib/popularFonts.js';
	import { onMount } from 'svelte';

	console.log(popularFonts.length);

	let options = { duration: 300, easing: cubicOut };

	let charSet = 'abcdefghijklmnopqrstuvwxyz';
	let charIndex = Math.floor(Math.random() * charSet.length);
	let fontIndex = Math.floor(Math.random() * popularFonts.length);

	$: selectedChar = charSet[charIndex];
	$: selectedFont = popularFonts[fontIndex];

	let selectedCharKey = {};
	let spinKey = {};

	const reload = () => {
		charIndex = Math.floor(Math.random() * charSet.length);
		fontIndex = Math.floor(Math.random() * popularFonts.length);

		selectedCharKey = {};
		spinKey = {};
	};

	const keyReload = (e) => {
		if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
			reload();
		}
	};

	$: fontName = selectedFont.family;
	$: fontUrls = selectedFont.files;

	let fontWeight = 700;

	function getXHeight(font) {
		const text = 'ax';
		const canvas = document.querySelector('canvas');
		canvas.width = 500;
		canvas.height = 400;

		const ctx = canvas.getContext('2d');
		const fontSize = 100;

		ctx.font = `${fontSize}px ${fontName}`;
		// top is critical to the fillText() calculation
		// you can use other positions, but you need to adjust the calculation
		// ctx.textBaseline = 'top';
		// ctx.textAlign = 'center';
		const metrics = ctx.measureText(text);
		const width = metrics.width;
		const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		// fallback to using fontSize if fontBoundingBoxAscent isn't available, like in Firefox. Should be close enough that you aren't more than a pixel off in most cases.
		const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent ?? fontSize;
		console.log(metrics.actualBoundingBoxAscent);

		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetical';

		ctx.font = `${fontSize}px ${fontName}`;
		ctx.fillText('ax', width / 2, height / 2);
		ctx.beginPath(); //
		ctx.moveTo(0, height / 2);
		ctx.lineTo(150, height / 2);
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.beginPath(); //
		ctx.moveTo(0, metrics.actualBoundingBoxAscent);
		ctx.lineTo(150, metrics.actualBoundingBoxAscent);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	$: if (visible) {
		console.log('mierdon');
		for (const [key, value] of Object.entries(fontUrls)) {
			if (key.match(regex) || key === 'regular') {
				document.fonts.add(new FontFace(fontName, `url(${value})`, { weight: key }));
			}
		}
	}

	let visible = false;
	const regex = /^\d{3}/g; //must only have 3 starting digits
	onMount(() => {
		for (const [key, value] of Object.entries(fontUrls)) {
			if (key.match(regex) || key === 'regular') {
				document.fonts.add(new FontFace(fontName, `url(${value})`, { weight: key }));
			}
		}
		visible = true;
		console.log('X height for ' + fontName + ': ' + getXHeight(fontName));
	});
</script>

{#if visible}
	<div in:fly={{ y: 100, duration: 1000 }} class="flex flex-col items-center">
		{#key selectedCharKey}
			<div
				in:fly={{ y: 20 }}
				class="glyph text-9xl max-w-sm mx-auto text-center my-20"
				style:font-family={fontName}
				style:font-weight={fontWeight}
			>
				{selectedChar}
			</div>
		{/key}
		<div>{fontName}</div>
		<input type="range" min={100} max={900} bind:value={fontWeight} />
		{#key spinKey}
			<button on:click={reload} in:spin={options} class="text-3xl font-semibold"
				><ArrowCounterClockwise weight="bold" size={40} /></button
			>
		{/key}
	</div>
{/if}

<canvas class="border-2" id="fontCanvas" />

<svelte:head>
	<title>Font Guesser</title>
</svelte:head>

<svelte:window on:keypress|preventDefault={keyReload} />
