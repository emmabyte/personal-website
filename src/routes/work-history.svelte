<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { faBuilding, faQuestion, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { workHistory } from '$lib/data/work-history.json';

	// Check if mobile device or not
	let isTouchDevice = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined') {
			isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		}
	});
</script>

<section id="work-history" class="w-full bg-muted/20 py-12 md:py-24 lg:py-32">
	<div class="container px-4 md:px-6">
		<div class="mb-6 space-y-2 text-center">
			<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Work history</h2>
			<p
				class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
			>
				A summary of my most recent work experience.
			</p>
		</div>
		<div class="mx-auto flex flex-col items-center justify-center text-center sm:max-w-xl">
			{#each workHistory as job, index}
				<div
					class="flex flex-col items-center rounded-lg bg-background p-6 shadow-md ring-1 ring-border"
				>
					{#if job.logo}
						{#if job.includeLogoBorder}
							<div class="grid size-24 place-items-center rounded-full border-2 border-foreground">
								<img src={job.logo} alt={job.logoAltText} class="size-16" />
							</div>
						{:else}
							<img src={job.logo} alt={job.logoAltText} class="size-24" />
						{/if}
					{:else}
						<div
							class="grid size-24 place-items-center rounded-full border-2 border-foreground p-2"
						>
							<Fa icon={faBuilding} class="text-5xl text-primary" />
						</div>
					{/if}
					<div class="mb-1 mt-2 flex items-center gap-2">
						<a
							href={job.companyUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-lg font-medium hover:underline">{job.company}</a
						>
						{#if job.faqs.length > 0 && !isTouchDevice}
							<HoverCard.Root>
								<HoverCard.Trigger
									class="grid size-4 place-items-center rounded-full bg-white transition-all duration-150 hover:bg-muted-foreground/90"
								>
									<Fa icon={faQuestion} class="size-2 text-background" />
								</HoverCard.Trigger>
								<HoverCard.Content class="w-96">
									<!-- Job FAQ Hover Card -->
									<h3 class="mb-1 flex items-center text-lg font-medium">
										<Fa icon={faQuestionCircle} class="mr-2 text-primary" />
										Frequently Asked Questions
									</h3>
									<div class="rounded-md bg-background p-4 text-sm text-muted-foreground">
										<Accordion.Root type="single">
											{#each job.faqs as faq, index}
												<Accordion.Item value={`item-${index}`}>
													<Accordion.Trigger class="text-left text-foreground"
														>{faq.question}</Accordion.Trigger
													>
													<Accordion.Content>{faq.answer}</Accordion.Content>
												</Accordion.Item>
											{/each}
										</Accordion.Root>
									</div></HoverCard.Content
								>
							</HoverCard.Root>
						{/if}
					</div>
					<h3 class="mb-1 gap-2 text-3xl font-medium">
						{job.role}
					</h3>
					<p class="mb-4 text-sm text-muted-foreground">{job.startDate} - {job.endDate}</p>
					<ul
						class="flex list-inside list-disc flex-col gap-3 font-mono text-sm text-muted-foreground"
					>
						{#each job.description as description}
							<li>{description}</li>
						{/each}
					</ul>
				</div>
				{#if index < workHistory.length - 1}
					<span
						class="my-3 h-36 w-[2px] bg-[linear-gradient(to_bottom,_#fff_10%,_rgba(255,255,255,0)_0%)] bg-[length:3px_15px] bg-left bg-repeat-y"
					></span>
				{/if}
			{/each}
		</div>
	</div>
</section>
