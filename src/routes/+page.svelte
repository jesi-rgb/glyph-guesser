<script>
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin } from '$lib/utils/utils.js';
	import { fonts } from '$lib/fonts.js';

	let options = { duration: 300, easing: cubicOut };

	let charSet = 'abcdefghijklmnopqrstuvwxyz';
	let charIndex = Math.floor(Math.random() * charSet.length);
	let fontIndex = Math.floor(Math.random() * fonts.length);

	$: selectedChar = charSet[charIndex];
	let selectedFont = fonts[fontIndex];
	$: selectedFont = selectedFont;

	let selectedCharKey = {};
	let spinKey = {};

	const reload = () => {
		charIndex = Math.floor(Math.random() * charSet.length);
		fontIndex = Math.floor(Math.random() * fonts.length);

		selectedCharKey = {};
		spinKey = {};
	};

	const keyReload = (e) => {
		console.log(e);
		if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
			reload();
		}
	};

	console.log(fontIndex, selectedFont);

	let fontName = selectedFont.family;
	let fontUrl = selectedFont.files['regular'];
	let fontFace = `
@font-face {
  font-family: ${fontName}
  font-style: normal;
  src: local('${fontName}'), url(${fontUrl}) format('ttf');
};
`;
	let glyphStyle = fontFace + `font-family: "${fontName}";`;
	$: console.log(glyphStyle);
</script>

<svelte:head>
	<title>Font Guesser</title>
	<link href={fontUrl} as="font" type="font/ttf" crossorigin="anonymous" />
</svelte:head>

<div class="flex flex-col items-center">
	{#key selectedCharKey}
		<div in:fly={{ y: 20 }} class="text-9xl max-w-sm mx-auto text-center my-20" style={glyphStyle}>
			{selectedChar}
		</div>
	{/key}
	{#key spinKey}
		<button on:click={reload} in:spin={options} class="text-3xl font-semibold"
			><ArrowCounterClockwise weight="bold" size={40} /></button
		>
	{/key}
</div>
<svelte:window on:keypress|preventDefault={keyReload} />
