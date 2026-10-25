<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		index,
		title,
		id,
		description,
		children
	}: {
		index: string;
		title: string;
		id: string;
		description?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
	<div class="flex flex-col gap-2">
		<span class="font-mono text-xs text-primary">{index}</span>
		<h2 {id} class="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
	</div>
	{#if description || children}
		<div class="flex max-w-md flex-col gap-3 md:items-end md:text-right">
			{#if description}
				<p class="text-pretty text-muted-foreground">{description}</p>
			{/if}
			{@render children?.()}
		</div>
	{/if}
</div>
