<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import ArchitectureDiagram from '$lib/components/case-study/architecture-diagram.svelte';
	import CaseStudySection from '$lib/components/case-study/case-study-section.svelte';
	import ContactLinks from '$lib/components/contact/contact-links.svelte';
	import Seo from '$lib/components/site/seo.svelte';

	let { data } = $props();

	const project = $derived(data.project);
	const study = $derived(data.study);
	const number = $derived(String(data.index).padStart(2, '0'));

	const linkClass =
		'group inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary';
</script>

<Seo
	title="{project.title} — Case study · Emma Long"
	description={project.summary}
	path="/work/{project.slug}"
/>

<main class="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-12 md:gap-20 md:px-8 md:py-20">
	<div class="flex flex-col gap-10">
		<a
			href="/#work"
			class="w-fit font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
			>← All work</a
		>

		<header class="flex flex-col gap-4">
			<span class="font-mono text-xs text-primary-text">{number} / {project.year}</span>
			<h1 class="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
				{project.title}
			</h1>
			<p class="max-w-3xl text-lg text-pretty text-muted-foreground">{project.summary}</p>
		</header>

		<dl
			class="grid gap-x-8 gap-y-6 border-y border-border py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
		>
			<div class="flex flex-col gap-1.5">
				<dt class="font-mono text-xs text-muted-foreground">Role</dt>
				<dd>{project.role}</dd>
			</div>
			<div class="flex flex-col gap-1.5">
				<dt class="font-mono text-xs text-muted-foreground">Status</dt>
				<dd>{study.status}</dd>
			</div>
			<div class="flex flex-col gap-1.5">
				<dt class="font-mono text-xs text-muted-foreground">Stack</dt>
				<dd>
					<ul class="flex flex-wrap gap-1.5">
						{#each project.tags as tag (tag)}
							<li
								class="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
							>
								{tag}
							</li>
						{/each}
					</ul>
				</dd>
			</div>
			<div class="flex flex-col gap-1.5">
				<dt class="font-mono text-xs text-muted-foreground">Links</dt>
				<dd>
					<ul class="flex flex-col gap-1.5">
						{#if project.liveUrl}
							<li>
								<a href={project.liveUrl} target="_blank" rel="noreferrer" class={linkClass}>
									Live site
									<ArrowUpRight class="size-3.5" aria-hidden="true" />
								</a>
							</li>
						{/if}
						{#if project.repoUrl}
							<li>
								<a href={project.repoUrl} target="_blank" rel="noreferrer" class={linkClass}>
									Source
									<ArrowUpRight class="size-3.5" aria-hidden="true" />
								</a>
							</li>
						{:else}
							<li>
								<a href="/#contact" class={linkClass}>Private repo · walkthrough on request</a>
							</li>
						{/if}
					</ul>
				</dd>
			</div>
		</dl>
	</div>

	<div class="flex flex-col gap-12">
		<CaseStudySection label="Problem & constraints" id="problem">
			{#each study.problem as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</CaseStudySection>

		<CaseStudySection label="My role" id="role">
			{#each study.role as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</CaseStudySection>

		<section
			id="architecture"
			aria-labelledby="architecture-title"
			class="flex flex-col gap-5 border-t border-border pt-8"
		>
			<h2 id="architecture-title" class="font-mono text-sm text-primary-text">Architecture</h2>
			<ArchitectureDiagram
				caption={study.architecture.caption}
				description={study.architecture.description}
				columns={study.architecture.columns}
			/>
		</section>

		<CaseStudySection label="Key decisions" id="decisions">
			<ol class="flex flex-col gap-8">
				{#each study.decisions as item, i (i)}
					<li class="flex flex-col gap-2">
						<h3 class="text-lg font-semibold text-foreground">{item.decision}</h3>
						{#if item.rejected.length > 0}
							<p class="font-mono text-xs">
								Rejected: {item.rejected.join(' · ')}
							</p>
						{/if}
						<p>{item.why}</p>
					</li>
				{/each}
			</ol>
		</CaseStudySection>

		<CaseStudySection label="Testing & verification" id="testing">
			{#each study.testing as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</CaseStudySection>

		<CaseStudySection label="Outcome" id="outcome">
			{#each study.outcome as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</CaseStudySection>

		{#if study.compliance}
			<CaseStudySection label="Compliance" id="compliance">
				{#each study.compliance as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</CaseStudySection>
		{/if}
	</div>

	<section
		aria-labelledby="case-study-contact-title"
		class="flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 md:p-14"
	>
		<ContactLinks
			heading="Want the full walkthrough? Get in touch."
			line="I'm happy to walk through the architecture and decisions in more detail."
			headingId="case-study-contact-title"
		/>
		<a
			href="/#contact"
			class="w-fit text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
			>Or send a message from the contact form</a
		>
	</section>
</main>
