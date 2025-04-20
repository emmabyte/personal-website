<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import { Badge } from '$lib/components/ui/badge/index';
	import { Button } from '$lib/components/ui/button/index';
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
	import { projects } from '$lib/data/projects.json';
	import { fly } from 'svelte/transition';

	let showAll = false;

	// interface Project {
	// 	imageSrcSet: string;
	// 	imageSizes: string;
	// 	imageAltText: string;
	// 	title: string;
	// 	description: string;
	// 	badges: string[];
	// 	github_link: string;
	// 	demo_link: string;
	// }

	const MAX_ITEMS = 2;

	// Compute visible projects reactively.
	$: visibleProjects = showAll ? projects : projects.slice(0, MAX_ITEMS);
</script>

<section id="projects" class="w-full pb-6 pt-12 md:pb-12 md:pt-24 lg:pb-16 lg:pt-32">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Projects</h2>
				<p
					class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					A selection of my recent work and personal projects.
				</p>
			</div>
			<div class="relative">
				<div class="mx-auto grid max-w-5xl items-stretch gap-6 md:gap-12 lg:grid-cols-2">
					{#each visibleProjects as project (project.title)}
						<!-- Wrapping each card in a native div to apply both in and out fly transitions and enforce full height -->
						<div class="h-full" transition:fly={{ y: 16, duration: 250 }}>
							<Card.Root class="flex h-full flex-col overflow-hidden">
								{#if project.imageSrcSet}
									<img
										srcset={project.imageSrcSet}
										sizes={project.imageSizes}
										alt={project.imageAltText}
										class="aspect-video w-full object-cover"
									/>
								{:else}
									<img
										src="images/image-placeholder.svg"
										alt="Gray background with a centered icon representing visual content, used in design mockups or when content is not yet available."
										class="aspect-video w-full object-cover"
									/>
								{/if}
								<Card.Content class="flex flex-grow flex-col justify-between p-6">
									<h3 class="text-2xl font-bold">{project.title}</h3>
									<p class="mb-4 mt-2 text-muted-foreground">
										{project.description}
									</p>
									<div class="mb-4 flex flex-wrap gap-2">
										{#each project.badges as badge}
											<Badge>{badge}</Badge>
										{/each}
									</div>
									<div class="mt-auto flex gap-2">
										{#if project.github_link}
											<Button variant="outline" size="sm">
												<a href={project.github_link} class="inline-flex items-center gap-1">
													<Fa icon={faGithub} class="h-4 w-4" />
													Code
												</a>
											</Button>
										{/if}
										{#if project.demo_link}
											<Button size="sm">
												<a href={project.demo_link} class="inline-flex items-center gap-1">
													<Fa icon={faArrowUpRightFromSquare} class="h-4 w-4" />
													Live Demo
												</a>
											</Button>
										{/if}
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					{/each}
				</div>
				{#if projects.length > MAX_ITEMS}
					<div class="pt-6 text-center md:pt-12 lg:pt-16">
						<Button onclick={() => (showAll = !showAll)}>
							{showAll ? 'Show Less' : 'Show More'}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
