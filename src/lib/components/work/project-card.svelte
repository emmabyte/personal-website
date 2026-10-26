<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import SpotlightCard from '$lib/components/ui/spotlight-card.svelte';
	import type { FeaturedProject } from '$lib/data/types';

	let { project, index }: { project: FeaturedProject; index: number } = $props();

	const linkClass =
		'relative z-10 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline';
</script>

<SpotlightCard
	class="group flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:p-8"
>
	<div class="flex items-start justify-between gap-4">
		<div class="flex flex-col gap-1">
			<span class="font-mono text-xs text-muted-foreground">
				{String(index + 1).padStart(2, '0')} / {project.year}
			</span>
			<h3 class="text-2xl font-semibold tracking-tight">
				<a
					href="/work/{project.slug}"
					class="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
				>
					{project.title}
				</a>
			</h3>
		</div>
		<span
			aria-hidden="true"
			class="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
		>
			<ArrowUpRight class="size-4" />
		</span>
	</div>

	<p class="leading-relaxed text-pretty text-muted-foreground">{project.summary}</p>

	<dl class="grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="font-mono text-xs tracking-wider text-muted-foreground uppercase">Role</dt>
			<dd>{project.role}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="font-mono text-xs tracking-wider text-muted-foreground uppercase">Impact</dt>
			<dd>{project.impact}</dd>
		</div>
	</dl>

	<div class="mt-auto flex flex-wrap items-center justify-between gap-3">
		<ul class="flex flex-wrap gap-2" aria-label="Technologies">
			{#each project.tags as tag (tag)}
				<li class="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground">
					{tag}
				</li>
			{/each}
		</ul>
		<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
			{#if project.liveUrl}
				<a href={project.liveUrl} target="_blank" rel="noreferrer" class={linkClass}>
					Live site<span class="sr-only"> for {project.title}</span>
				</a>
			{/if}
			{#if project.repoUrl}
				<a href={project.repoUrl} target="_blank" rel="noreferrer" class={linkClass}>
					Source code<span class="sr-only"> for {project.title}</span>
				</a>
			{:else if project.walkthrough}
				<a href="#contact" class={linkClass}>
					Private repo · walkthrough on request<span class="sr-only"> for {project.title}</span>
				</a>
			{:else}
				<span class="font-mono text-xs text-muted-foreground">Proprietary</span>
			{/if}
		</div>
	</div>
</SpotlightCard>
