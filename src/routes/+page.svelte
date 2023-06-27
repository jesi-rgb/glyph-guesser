<script>
	import { draw, slide, fly, fade } from 'svelte/transition';
	import { cubicIn } from 'svelte/easing';
	import { ArrowCounterClockwise, TextAa } from 'phosphor-svelte';

	import {
		spin,
		niceBounce,
		typewriter,
		generateRandomOptions,
		randomChoice,
		getXHeight
	} from '$lib/utils/utils.js';
	import { fonts } from '$lib/fonts.js';
	import { onMount } from 'svelte';
	import ButtonPanel from '../lib/Components/ButtonPanel.svelte';
	import Glyph from '../lib/Components/Glyph.svelte';

	const filteredFonts = fonts.filter((f) => !f.family.startsWith('Noto '));

	let options = {
		duration: 700,
		easing: niceBounce
	};

	// not used for now...
	let charSet = 'abcdefghijklmnopqrstuvwxyz1234567890.,:;-';
	// let charIndex = randomChoice(charSet);
	let selectedFont = randomChoice(filteredFonts);

	let updateWordKey = {};
	let spinReloadChar = {};
	let updateFontKey = {};

	let fontWeight = 400;
	let fontSize = 80;
	let visible = false;

	let selectedWord = 'loading...';
	let wordStack = ['x'];

	let fontOptions;
	let xHeight, ascender, descender;

	const fetchWords = async () => {
		selectedWord = wordStack.pop();
		if (wordStack.length <= 2) {
			let object = await fetch('https://random-word-api.vercel.app/api?words=15');
			let json = await object.json();
			wordStack = [...json, ...wordStack];
		}
	};

	$: fontUrls = selectedFont.files;
	$: fontName = selectedFont.family;

	const reloadWord = () => {
		fetchWords();
		spinReloadChar = {};
		updateWordKey = {};
	};

	const reloadFont = () => {
		// charIndex = Math.floor(Math.random() * charSet.length);
		selectedFont = randomChoice(filteredFonts);
		fetchWords();
		xHeight = getXHeight(selectedFont, selectedWord, fontSize).xHeight;
		ascender = getXHeight(selectedFont, selectedWord, fontSize).ascender;
		descender = getXHeight(selectedFont, selectedWord, fontSize).descender;

		updateFontKey = {};
		updateWordKey = {};
	};

	const reloadChar = () => {
		charIndex = Math.floor(Math.random() * charSet.length);

		updateWordKey = {};
		spinReloadChar = {};

		reloadWord();
	};

	const keyReload = (e) => {
		if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
			reloadWord();
		}
		if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
			reloadFont();
		}
	};

	function createFontUrl(fontObject) {
		console.log(fontObject);

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
						// console.log('succesfully loaded font: ', font);
						xHeight = getXHeight(selectedFont, selectedWord, fontSize).xHeight;
						descender = getXHeight(selectedFont, selectedWord, fontSize).descender;
						ascender = getXHeight(selectedFont, selectedWord, fontSize).ascender;
					},
					(e) => {
						console.log('error loading font: ', fontName, font, e);
					}
				);
			}
		}
		fontOptions = generateRandomOptions(fonts, selectedFont);
		// console.log(fontOptions);
	}

	$: if (visible) {
		loadFont(fontName, fontUrls);
	}

	onMount(() => {
		loadFont(fontName, fontUrls);
		reloadWord();
		visible = true;
	});

	const resizeText = (e) => {
		e.preventDefault();
		if (e.wheelDeltaX <= -10 && selectedWord.length > 1) {
			// we are scrolling left, remove chars
			selectedWord = selectedWord.slice(0, selectedWord.length - 1);
		}

		if (e.wheelDeltaX >= 10) {
			selectedWord += charSet[Math.floor(Math.random() * charSet.length)];
		}
	};

	let width = 500,
		height = 200;
</script>

{#if visible}
	<div in:fly={{ y: 100, duration: 1500 }} class="flex flex-col items-center">
		<!-- <Glyph> -->
		<!-- 	<div -->
		<!-- 		in:fly={{ y: 20, duration: 500, easing: niceBounce }} -->
		<!-- 		class="select-none w-screen mx-auto text-center text-stone-600" -->
		<!-- 		style:font-weight={fontWeight} -->
		<!-- 		style:font-size={'80px'} -->
		<!-- 		style={`--font-name: "${fontName}"; font-family: ${fontName};`} -->
		<!-- 	> -->

		<!-- 		{selectedChar} -->
		<!-- 	</div> -->
		<Glyph>
			{#key updateFontKey}
				<svg {width} {height} viewBox="0 0 {width} {height}">
					{#key updateWordKey}
						<text
							text-anchor="middle"
							dominant-baseline="baseline"
							x={width / 2}
							y={height / 2}
							in:typewriter={{ speed: 1.3, easing: cubicIn }}
							class="fill-stone-800"
							style:font-weight={fontWeight}
							style:font-size={`${fontSize}px`}
							style={`--font-name: "${fontName}"; font-family: ${fontName};`}
						>
							{selectedWord}
						</text>
					{/key}
					<line
						in:draw={{ easing: niceBounce, duration: 600, delay: 100 }}
						x1="0"
						y1={height / 2 - ascender}
						x2={width}
						y2={height / 2 - ascender}
						stroke="black"
						stroke-opacity=".3"
					/>
					<line
						in:draw={{ easing: niceBounce, duration: 600, delay: 200 }}
						x1="0"
						y1={height / 2 - xHeight}
						x2={width}
						y2={height / 2 - xHeight}
						stroke="black"
						stroke-opacity=".3"
					/>
					<line
						in:draw={{ easing: niceBounce, duration: 600, delay: 300 }}
						x1="0"
						y1={height / 2}
						x2={width}
						y2={height / 2}
						stroke="black"
						stroke-opacity=".3"
					/>
					<line
						in:draw={{ easing: niceBounce, duration: 600, delay: 400 }}
						x1="0"
						y1={height / 2 + descender}
						x2={width}
						y2={height / 2 + descender}
						stroke="black"
						stroke-opacity=".3"
					/>
				</svg>
			{/key}
		</Glyph>
		<!-- <input type="range" min={100} max={900} bind:value={fontWeight} /> -->
		<div class="my-20">
			<ButtonPanel fontNames={fontOptions} correctOption={fontName} />
		</div>
	</div>
	<div class="text-stone-700 w-screen flex fixed bottom-0">
		{#key spinReloadChar}
			<div on:click={reloadWord} class="relative w-1/2 border py-3">
				<div class="w-max mx-auto" in:spin={options}>
					<ArrowCounterClockwise weight="bold" size={60} />
				</div>
				<div class="w-max mx-auto flex-col items-center text-center">
					<p>New Word</p>
				</div>
			</div>
		{/key}
		{#key updateFontKey}
			<div on:click={reloadFont} class="relative w-1/2 border py-3">
				<div class="w-max mx-auto flex-col items-center text-center" in:slide={{ duration: 500 }}>
					<TextAa weight="bold" size={60} />
				</div>
				<div class="w-max mx-auto flex-col items-center text-center">
					<p>New Font</p>
				</div>
			</div>
		{/key}
	</div>
{/if}

<canvas class="border hidden absolute" width="400" height="200" />

<svelte:head>
	<title>Font Guesser</title>
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
	<link rel="stylesheet" type="text/css" as="font" href={createFontUrl(selectedFont)} />
</svelte:head>

<svelte:window on:keypress|preventDefault={keyReload} />
