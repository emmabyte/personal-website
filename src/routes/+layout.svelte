<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import SiteHeader from '$lib/components/site/site-header.svelte';

	let { children } = $props();
</script>

<SiteHeader />
{@render children()}
<SiteFooter />
