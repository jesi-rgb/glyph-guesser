<script>
	import { fly } from 'svelte/transition';
	import { ArrowCounterClockwise } from 'phosphor-svelte';

	import { spin, niceBounce, generateRandomOptions, randomChoice } from '$lib/utils/utils.js';
	// import { fonts } from '$lib/fonts.js';
	import { fonts } from '$lib/fonts.js';
	import { onMount } from 'svelte';
	import ButtonPanel from '../lib/Components/ButtonPanel.svelte';

	let options = {
		duration: 700,
		easing: niceBounce
	};

	let charSet = 'abcdefghijklmnopqrstuvwxyz1234567890.,:;-';
	let charIndex = randomChoice(charSet);
	let selectedFont = randomChoice(fonts);

	let selectedCharKey = {};
	let spinReloadChar = {};
	let spinReloadFont = {};

	let fontWeight = 400;
	let visible = false;

	let selectedChar = 'loading...';
	let wordStack = ['lets begin'];

	let fontOptions;

	const loadWord = async () => {
		selectedChar = wordStack.pop();
		if (wordStack.length <= 2) {
			let object = await fetch('https://random-word-api.vercel.app/api?words=15');
			let json = await object.json();
			wordStack = [...json, ...wordStack];
		}
	};

	$: fontUrls = selectedFont.files;
	$: fontName = selectedFont.family;

	const reloadFont = () => {
		// charIndex = Math.floor(Math.random() * charSet.length);
		selectedFont = randomChoice(fonts);
		loadWord();

		selectedCharKey = {};
		spinReloadFont = {};
	};

	const reloadChar = () => {
		charIndex = Math.floor(Math.random() * charSet.length);

		selectedCharKey = {};
		spinReloadChar = {};
		loadWord();
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
		console.log('fetching', apiUrl.join(''));
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
				let font = new FontFace(`\"${fontName}\"`, `url(${value})`, {
					weight: key === 'regular' ? '400' : key,
					format: 'ttf'
				});

				// let font = new FontFace(`\"${fontName}\"`, `url(${createFontUrl(selectedFont)})`);
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
		fontOptions = generateRandomOptions(fonts, selectedFont);
		console.log(fontOptions);
	}

	$: if (visible) {
		loadFont(fontName, fontUrls);
	}

	onMount(() => {
		loadFont(fontName, fontUrls);
		loadWord();
		visible = true;
	});

	const resizeText = (e) => {
		e.preventDefault();
		if (e.wheelDeltaX <= -10 && selectedChar.length > 1) {
			// we are scrolling left, remove chars
			selectedChar = selectedChar.slice(0, selectedChar.length - 1);
		}

		if (e.wheelDeltaX >= 10) {
			selectedChar += charSet[Math.floor(Math.random() * charSet.length)];
		}
	};
</script>

{#if visible}
	<div in:fly={{ y: 100, duration: 1500 }} class="flex flex-col items-center">
		{#key selectedCharKey}
			<div
				on:wheel={resizeText}
				on:scroll={resizeText}
				in:fly={{ y: 20, duration: 500, easing: niceBounce }}
				class="select-none mx-auto text-center text-stone-700"
				style:font-weight={fontWeight}
				style:font-size={'80px'}
				style={`--font-name: "${fontName}"; font-family: ${fontName};`}
			>
				{selectedChar}
			</div>
		{/key}
		<!-- <input type="range" min={100} max={900} bind:value={fontWeight} /> -->
		<div class="my-10 text-stone-700">
			{#key spinReloadChar}
				<button on:click={reloadChar} in:spin={options} class="text-3xl font-semibold"
					><ArrowCounterClockwise weight="bold" size={60} /></button
				>
			{/key}
			{#key spinReloadFont}
				<button on:click={reloadFont} in:spin={options} class="text-3xl font-semibold"
					><ArrowCounterClockwise weight="bold" size={60} /></button
				>
			{/key}
		</div>
		<ButtonPanel fontNames={fontOptions} correctOption={fontName} />
	</div>
{/if}

<svelte:head>
	<title>Font Guesser</title>
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
	<link rel="stylesheet" type="text/css" as="font" href={createFontUrl(selectedFont)} />
</svelte:head>

<svelte:window on:keypress|preventDefault={keyReload} />
