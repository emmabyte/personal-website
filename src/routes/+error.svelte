<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} · Emma Long</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center gap-6 px-5 py-20 md:px-8">
	<p class="font-mono text-6xl font-semibold text-primary-text md:text-8xl">{page.status}</p>
	<h1 class="text-3xl font-semibold tracking-tight md:text-5xl">
		{page.status === 404 ? "That page doesn't exist." : 'Something went wrong.'}
	</h1>
	<div class="flex flex-wrap items-center gap-3">
		<a
			href="/"
			class="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
			>Back to home</a
		>
		<a
			href="/#work"
			class="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
			>See selected work</a
		>
	</div>
</main>
