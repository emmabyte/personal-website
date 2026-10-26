<script lang="ts">
	import SectionHeading from '$lib/components/ui/section-heading.svelte';
	import { stack } from '$lib/data/stack';
</script>

<section id="stack" aria-labelledby="stack-title" class="border-y border-border bg-card/40">
	<div class="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
		<SectionHeading
			index="03"
			id="stack-title"
			title="Tools of the trade"
			description={stack.description}
		/>
		<div
			class="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
		>
			{#each stack.groups as group (group.area)}
				<div class="flex flex-col gap-5 bg-background p-6">
					<h3 class="font-mono text-sm text-primary-text">{'// '}{group.area}</h3>
					<ul class="flex flex-col gap-2.5">
						{#each group.items as item (item)}
							<li class="flex items-center gap-3 text-sm">
								<span aria-hidden="true" class="h-px w-3 bg-muted-foreground/50"></span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
