<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.postcss';
</script>

<div class="my-20">
	<slot />
</div>
<div class="wrap">
	<SvelteToast target="new" options={{ duration: 1000, intro: { y: 0 } }} />
</div>

<style>
	.wrap {
		--toastContainerTop: 0.5rem;
		--toastBarHeight: 0;
		--toastContainerRight: 0.5rem;
		--toastContainerBottom: auto;
		--toastContainerLeft: 0.5rem;
		--toastWidth: 100%;
		--toastMinHeight: 2rem;
		--toastPadding: 0 0.5rem;
		font-size: 0.875rem;
	}
	@media (min-width: 40rem) {
		.wrap {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
	}
</style>
