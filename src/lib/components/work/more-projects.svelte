<script lang="ts">
	import { moreProjects } from '$lib/data/projects';

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<div class="mt-16 md:mt-20">
	<h3 class="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
		More projects
	</h3>
	<ul>
		{#each moreProjects as project (project.title)}
			<li
				data-more-project
				class="flex flex-col gap-3 border-t border-border py-5 last:border-b md:flex-row md:items-baseline md:gap-8"
			>
				<div class="flex items-baseline gap-3 md:w-64 md:shrink-0">
					<h4 class="font-semibold tracking-tight">{project.title}</h4>
					{#if project.year}
						<span class="font-mono text-xs text-muted-foreground">{project.year}</span>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-3">
					<p class="text-pretty text-muted-foreground">{project.description}</p>
					<ul class="flex flex-wrap gap-2" aria-label="Technologies">
						{#each project.tags as tag (tag)}
							<li
								class="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
							>
								{tag}
							</li>
						{/each}
					</ul>
				</div>
				<div class="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
					{#each project.links as link (link.href)}
						{#if isExternal(link.href)}
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer"
								class="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline"
							>
								{link.label}<span class="sr-only"> for {project.title}</span>
							</a>
						{:else}
							<a
								href={link.href}
								class="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline"
							>
								{link.label}<span class="sr-only"> for {project.title}</span>
							</a>
						{/if}
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</div>
