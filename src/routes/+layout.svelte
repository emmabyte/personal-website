<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<script
		src={`https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`}
	></script>
</svelte:head>

<Toaster />
<div
	class="fixed top-0 z-30 flex h-16 w-full items-center justify-start gap-10 rounded border-b bg-zinc-900/40 p-5 text-white shadow-md"
>
	<div class="jutify-start flex items-center gap-3">
		<a href="#hero">
			<div class="my-2 border-2 border-white p-1 text-3xl font-semibold tracking-wider">SL</div>
		</a>
		<div class="flex flex-col">
			<h1 class="text-3xl font-bold">Shawn Long</h1>
			<h2 class="text-xs">Software Engineer</h2>
		</div>
	</div>
	<nav class="hidden gap-5 md:flex">
		<a href="#about"> About Me </a>
		<a href="#projects"> Projects </a>
		<a href="#work-history"> Work History </a>
		<a href="#contact"> Contact </a>
	</nav>
</div>
{@render children()}
