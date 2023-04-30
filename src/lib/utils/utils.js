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

export function getXHeight(font) {
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
