import { cubicOut } from 'svelte/easing';

export function spin(node, options) {
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

// https://stackoverflow.com/a/65638217/12024715
export function shuffle(t) {
	let last = t.length;
	let n;
	while (last > 0) {
		n = rand(last);
		swap(t, n, --last);
	}
}
const rand = (n) => 0 | (Math.random() * n);

function swap(t, i, j) {
	let q = t[i];
	t[i] = t[j];
	t[j] = q;
	return t;
}

export function randomChoice(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export const generateRandomOptions = (fonts, selectedFont) => {
	let options = [randomChoice(fonts).family, randomChoice(fonts).family, selectedFont.family];
	shuffle(options);

	return options;
};

export const niceBounce = (x) => {
	const c1 = 0.78;
	const c3 = c1 + 1;

	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function typewriter(node, { speed = 1 }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		duration,
		tick: (t) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

export function getXHeight(selectedFont, word = 'damn', fontSize = 12) {
	const canvas = document.querySelector('canvas');
	const context = canvas.getContext('2d');

	let metrics;

	// font is not being applied. a default font is being used and that causes problems
	// we'll see!

	context.font = `${fontSize}px ${selectedFont.family}`;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillText(word, 50, 100);

	// Draw an "x" on the canvas
	metrics = context.measureText('x');
	const xHeight = metrics.actualBoundingBoxAscent;

	const descender = context.measureText('yjgpqfQ').actualBoundingBoxDescent;
	const ascender = context.measureText('AMYTEdl1I').actualBoundingBoxAscent;

	return { xHeight: xHeight, ascender: ascender, descender: descender };
}
