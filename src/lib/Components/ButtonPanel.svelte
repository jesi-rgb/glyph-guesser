<script>
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';

	export let fontNames = ['a', 'b', 'c'];
	export let correctOption;
</script>

<div class="mx-auto w-fit flex flex-col space-y-6 justify-evenly">
	{#each fontNames as f}
		<Button {correctOption} text={f} />
	{/each}
</div>
