<script>
	import { toast } from 'svelte-sonner';
	export let text;
	export let correctOption;
</script>

<button
	on:click={() => {
		console.log(text, correctOption);
		if (text === correctOption) {
			toast.success('Nice!');
		} else {
			toast.error('Not quite');
		}
	}}
	class="text-xl shadow-stone-700/80 shadow-sm xl:text-3xl w-full text-stone-700 hover:text-stone-600 font-semibold border-2 border-stone-500 bg-gradient-to-tr from-stone-200 to-transparent py-3 px-5 rounded-full"
>
	{text}
</button>
