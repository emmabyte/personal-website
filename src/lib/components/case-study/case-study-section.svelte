<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, id, children }: { label: string; id: string; children: Snippet } = $props();
</script>

<section {id} aria-labelledby="{id}-title" class="flex flex-col gap-5 border-t border-border pt-8">
	<h2 id="{id}-title" class="font-mono text-sm text-primary-text">{label}</h2>
	<div class="flex max-w-3xl flex-col gap-4 text-pretty text-muted-foreground">
		{@render children()}
	</div>
</section>
