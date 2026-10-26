<script lang="ts">
	import { ArrowDown, MapPin } from '@lucide/svelte';
	import PlusCorners from '$lib/components/ui/plus-corners.svelte';
	import { profile, stats } from '$lib/data/profile';
	import CodeCard from './code-card.svelte';
	import DotField from './dot-field.svelte';
	import ScrambleText from './scramble-text.svelte';
</script>

<section id="top" aria-labelledby="top-title" class="relative overflow-hidden">
	<DotField
		class="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_70%_75%_at_50%_40%,#000_35%,transparent_100%)]"
	/>
	<div class="relative mx-auto max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
		<div class="relative grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
			<div class="flex flex-col gap-8">
				{#if profile.availability}
					<p
						data-dot-clear
						class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
					>
						<span class="relative flex size-2">
							<span
								class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
						</span>
						{profile.availability}
					</p>
				{/if}

				<div class="flex flex-col gap-5">
					<h1
						data-dot-clear
						id="top-title"
						class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-7xl"
					>
						<span
							class="bg-linear-to-b from-foreground from-50% to-foreground/80 bg-clip-text text-transparent"
						>
							{profile.name}
						</span>
						<span class="block text-muted-foreground">
							<span class="sr-only">{profile.role}</span>
							<ScrambleText words={profile.roles} suffix="." suffixClass="text-primary-text" />
						</span>
					</h1>
					<p
						data-dot-clear
						class="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
					>
						{profile.intro}
					</p>
					<p
						data-dot-clear
						class="flex w-fit items-center gap-2 font-mono text-sm text-muted-foreground"
					>
						<MapPin class="size-4" aria-hidden="true" />
						{profile.location}
					</p>
				</div>

				<div data-dot-clear class="flex w-fit flex-wrap items-center gap-3">
					<a
						href="#work"
						class="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
					>
						View selected work
						<ArrowDown class="size-4" aria-hidden="true" />
					</a>
					<a
						href="#contact"
						class="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
					>
						Get in touch
					</a>
				</div>
			</div>

			<CodeCard />
		</div>

		<div class="relative mt-16">
			<PlusCorners />
			<dl
				class="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
			>
				{#each stats as stat (stat.label)}
					<div class="flex flex-col gap-1 bg-background/80 p-6 backdrop-blur-sm">
						<dt class="order-2 text-sm text-muted-foreground">{stat.label}</dt>
						<dd class="order-1 text-3xl font-semibold tracking-tight">{stat.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
