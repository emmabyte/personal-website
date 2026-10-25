<script lang="ts">
	import SectionHeading from '$lib/components/ui/section-heading.svelte';
	import { featuredProjects } from '$lib/data/projects';
	import MoreProjects from './more-projects.svelte';
	import ProjectCard from './project-card.svelte';
</script>

<section
	id="work"
	aria-labelledby="work-title"
	class="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
>
	<SectionHeading
		index="01"
		id="work-title"
		title="Selected work"
		description="Products I've designed, built, and shipped, from schema to deploy."
	/>
	<div class="grid gap-5 md:grid-cols-2">
		{#each featuredProjects as project, i (project.slug)}
			<ProjectCard {project} index={i} />
		{/each}
	</div>
	<MoreProjects />
</section>
