<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin } from '$lib/utils/utils.js';
	// import { fonts } from '$lib/fonts.js';
	import { fonts } from '$lib/fonts.js';
	import { onMount } from 'svelte';

	let options = { duration: 300, easing: cubicOut };

	let charSet = 'abcdefghijklmnopqrstuvwxyz1234567890.,:;-';
	let charIndex = Math.floor(Math.random() * charSet.length);
	let fontIndex = Math.floor(Math.random() * fonts.length);

	$: selectedChar = charSet[charIndex];
	$: selectedFont = fonts[fontIndex];

	let selectedCharKey = {};
	let spinReloadChar = {};
	let spinReloadFont = {};

	const reloadFont = () => {
		charIndex = Math.floor(Math.random() * charSet.length);
		fontIndex = Math.floor(Math.random() * fonts.length);

		selectedCharKey = {};
		spinReloadFont = {};
	};

	const reloadChar = () => {
		charIndex = Math.floor(Math.random() * charSet.length);

		selectedCharKey = {};
		spinReloadChar = {};
	};

	const keyReload = (e) => {
		if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
			reloadChar();
		}
		if (e.key === 'Space' || e.key === 'f' || e.key === 'F') {
			reloadFont();
		}
	};

	function createFontUrl(fontObject) {
		let apiUrl = [];

		apiUrl.push('https://fonts.googleapis.com/css2?family=');
		apiUrl.push(fontObject.family.replace(/ /g, '+'));

		if (fontObject.variants.length > 1) {
			apiUrl.push(':wght@');

			apiUrl.push(
				fontObject.variants
					.filter((v) => !v.match(/\D/g) || v === 'regular')
					.join(';')
					.replace('regular', '400')
			);
		}
		apiUrl.push('&display=swap');
		console.log(apiUrl.join(''));
		return apiUrl.join('');
	}

	function loadFont(fontName, fontUrls) {
		for (const [key, value] of Object.entries(fontUrls)) {
			if (!key.match(/\D/g) || key === 'regular') {
				// console.log(key, value);
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1706648
				// this ended up being a different error: when passing the weight,
				// 'regular' was being used and that causes problems. we need to make sure
				// the weights are only numbers.
				const font = new FontFace(`\"${fontName}\"`, `url(${value})`, {
					weight: key === 'regular' ? '400' : key
				});
				document.fonts.add(font);

				font.load().then(
					() => {
						// selectedCharKey = {};
						console.log('succesfully loaded font: ', font);
					},
					(e) => {
						console.log('error loading font: ', fontName, font, e);
					}
				);
			}
		}
	}

	$: fontUrls = selectedFont.files;
	$: fontName = selectedFont.family;

	let fontWeight = 700;

	let visible = false;

	$: if (visible) {
		loadFont(fontName, fontUrls);
	}

	onMount(() => {
		loadFont(fontName, fontUrls);
		visible = true;
	});
</script>

{#if visible}
	<div in:fly={{ y: 100, duration: 1500 }} class="flex flex-col items-center">
		{#key selectedCharKey}
			<div
				in:fly={{ y: 20, duration: 500 }}
				class="glyph max-w-sm mx-auto text-center my-20"
				style:font-family={fontName}
				style:font-weight={fontWeight}
				style:font-size={'200px'}
			>
				{selectedChar}
			</div>
		{/key}
		<div>{fontName}</div>
		<input type="range" min={100} max={900} bind:value={fontWeight} />
		<div>
			{#key spinReloadChar}
				<button on:click={reloadChar} in:spin={options} class="text-3xl font-semibold"
					><ArrowCounterClockwise weight="bold" size={100} /></button
				>
			{/key}
			{#key spinReloadFont}
				<button on:click={reloadFont} in:spin={options} class="text-3xl font-semibold"
					><ArrowCounterClockwise weight="bold" size={100} /></button
				>
			{/key}
		</div>
	</div>
{/if}

<svelte:head>
	<title>Font Guesser</title>
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
</svelte:head>

<svelte:window on:keypress|preventDefault={keyReload} />
