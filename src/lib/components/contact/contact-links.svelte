<script lang="ts">
	import { ArrowUpRight, Download, Mail } from '@lucide/svelte';
	import CopyEmailButton from '$lib/components/ui/copy-email-button.svelte';
	import { profile } from '$lib/data/profile';

	let {
		heading,
		line,
		headingId,
		index
	}: { heading: string; line: string; headingId: string; index?: string } = $props();

	const linkClass =
		'group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground';
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-4">
		{#if index}
			<span class="font-mono text-xs text-primary">{index}</span>
		{/if}
		<h2
			id={headingId}
			class="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl"
		>
			{heading}
		</h2>
		<p class="max-w-xl text-lg text-pretty text-muted-foreground">{line}</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<a
			href="mailto:{profile.email}"
			class="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 py-2 font-medium break-all text-primary-foreground transition-opacity hover:opacity-90"
		>
			<Mail class="size-4 shrink-0" aria-hidden="true" />
			{profile.email}
		</a>
		<CopyEmailButton email={profile.email} />
	</div>

	<ul
		class="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8"
		aria-label="Social profiles"
	>
		{#each profile.socials as social (social.label)}
			<li>
				<a href={social.href} target="_blank" rel="noreferrer" class={linkClass}>
					{social.label}
					<ArrowUpRight
						class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						aria-hidden="true"
					/>
				</a>
			</li>
		{/each}
		<li>
			<a href={profile.resume.href} download={profile.resume.filename} class={linkClass}>
				Résumé (PDF)
				<Download class="size-3.5" aria-hidden="true" />
			</a>
		</li>
	</ul>
</div>
