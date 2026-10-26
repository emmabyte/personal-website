<script lang="ts">
	import SectionHeading from '$lib/components/ui/section-heading.svelte';
	import { howIShip } from '$lib/data/process';
	import ShipPipeline from './ship-pipeline.svelte';
</script>

<section
	id="process"
	aria-labelledby="process-title"
	class="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
>
	<SectionHeading
		index="02"
		id="process-title"
		title="How I ship"
		description={howIShip.description}
	/>
	<ShipPipeline />
	<ul
		class="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3"
	>
		{#each howIShip.principles as item, i (item.title)}
			<li class="flex flex-col gap-2 bg-background p-6">
				<span class="font-mono text-xs text-primary-text">0{i + 1}</span>
				<h3 class="font-medium">{item.title}</h3>
				<p class="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
			</li>
		{/each}
	</ul>
	<p class="mt-6 max-w-2xl text-sm text-muted-foreground">{howIShip.aiNote}</p>
</section>
