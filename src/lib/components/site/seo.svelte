<script lang="ts">
	import { profile } from '$lib/data/profile';
	import { jsonLdScript } from '$lib/seo';

	let {
		title,
		description,
		path,
		jsonLd
	}: { title: string; description: string; path: string; jsonLd?: Record<string, unknown> } =
		$props();

	const url = $derived(profile.siteUrl + path);
	const image = `${profile.siteUrl}/og.png`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	{#if jsonLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- output of jsonLdScript escapes `<` -->
		{@html jsonLdScript(jsonLd)}
	{/if}
</svelte:head>
