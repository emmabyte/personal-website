<script lang="ts">
	import JobQa from '$lib/components/experience/job-qa.svelte';
	import SectionHeading from '$lib/components/ui/section-heading.svelte';
	import { experience } from '$lib/data/experience';
	import { profile } from '$lib/data/profile';
</script>

<section
	id="experience"
	aria-labelledby="experience-title"
	class="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
>
	<SectionHeading
		index="04"
		id="experience-title"
		title="Experience"
		description={experience.description}
	>
		<a
			href={profile.resume.href}
			download={profile.resume.filename}
			class="rounded-sm font-mono text-sm text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline"
		>
			Full résumé (PDF) ↓
		</a>
	</SectionHeading>
	<ol class="flex flex-col border-t border-border">
		{#each experience.jobs as job (job.period + job.company)}
			<li class="grid gap-2 border-b border-border py-8 md:grid-cols-[180px_1fr_1.4fr] md:gap-8">
				<span class="font-mono text-sm text-muted-foreground">{job.period}</span>
				<div class="flex flex-col">
					<h3 class="text-lg font-medium">
						{#if job.companyUrl}
							<a
								href={job.companyUrl}
								target="_blank"
								rel="noreferrer"
								class="rounded-sm underline-offset-4 hover:text-primary-text hover:underline"
							>
								{job.company}
							</a>
						{:else}
							{job.company}
						{/if}
					</h3>
					<p class="text-sm text-muted-foreground">{job.title}</p>
				</div>
				<div class="flex flex-col items-start">
					<p class="leading-relaxed text-pretty text-muted-foreground">{job.summary}</p>
					{#if job.link}
						<a
							href={job.link.href}
							class="mt-3 rounded-sm font-mono text-xs text-primary-text underline-offset-4 hover:underline"
						>
							{job.link.label}
						</a>
					{/if}
					<JobQa faqs={job.faqs} company={job.company} />
				</div>
			</li>
		{/each}
	</ol>
</section>
