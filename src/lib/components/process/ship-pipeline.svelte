<script lang="ts">
	import PlusCorners from '$lib/components/ui/plus-corners.svelte';

	// Unique per instance so the <defs> ids can't collide with other inline SVGs on the page.
	const uid = $props.id();

	const targets = [
		{ id: 'preview', y: 95 },
		{ id: 'production', y: 205 }
	];

	const fanPath = (y: number) => `M528 150 C 640 150 650 ${y} 760 ${y}`;

	const LABEL =
		'Diagram: a git push triggers tests and a build on GitHub Actions, then deploys to a preview URL and to production on Vercel.';

	// Stacked drawing: the build fans out downward to two pills side by side.
	const stackedTargets = [
		{ id: 'preview', x: 95 },
		{ id: 'production', x: 265 }
	];
	const stackedFanPath = (x: number) => `M180 342 C 180 400 ${x} 390 ${x} 440`;
</script>

<figure class="relative rounded-2xl border border-border bg-background">
	<figcaption class="border-b border-border px-5 py-3 font-mono text-xs text-muted-foreground">
		{'// from commit to production, on every push'}
	</figcaption>
	<!-- Wide drawing from laptop width up; the stacked one below covers phones and tablets. -->
	<div data-pipeline="wide" class="hidden lg:block">
		<svg viewBox="0 0 1000 300" role="img" aria-label={LABEL} class="block w-full">
			<defs>
				<pattern id="{uid}-grid" width="25" height="25" patternUnits="userSpaceOnUse">
					<path d="M25 0H0V25" fill="none" class="stroke-border" stroke-width="1" />
				</pattern>
				<radialGradient id="{uid}-core" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.3" />
					<stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
				</radialGradient>
				<filter id="{uid}-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="3" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<rect width="1000" height="300" fill="url(#{uid}-grid)" opacity="0.6" />

			<path d="M220 150 H412" fill="none" class="stroke-border" stroke-width="1.5" />
			<path
				d="M220 150 H412"
				pathLength="1"
				fill="none"
				class="beam stroke-primary"
				stroke-width="2"
				stroke-linecap="round"
				filter="url(#{uid}-glow)"
			/>

			{#each targets as target, i (target.id)}
				<g>
					<path d={fanPath(target.y)} fill="none" class="stroke-border" stroke-width="1.5" />
					<path
						d={fanPath(target.y)}
						pathLength="1"
						fill="none"
						class="beam stroke-primary"
						stroke-width="2"
						stroke-linecap="round"
						filter="url(#{uid}-glow)"
						style:animation-delay="{1.15 + i * 0.08}s"
					/>
				</g>
			{/each}

			<g>
				<rect x="20" y="118" width="200" height="64" rx="12" class="fill-card stroke-border" />
				<text x="40" y="155" class="fill-foreground font-mono text-[14px]">git push</text>
			</g>

			<g>
				<circle cx="470" cy="150" r="110" fill="url(#{uid}-core)" />
				<circle
					cx="470"
					cy="150"
					r="72"
					fill="none"
					class="spin stroke-primary"
					stroke-opacity="0.5"
					stroke-dasharray="2 7"
				/>
				<circle cx="470" cy="150" r="58" class="fill-card stroke-border" />
				<text x="470" y="155" text-anchor="middle" class="fill-foreground font-mono text-[14px]">
					test &amp; build
				</text>
				<text
					x="470"
					y="270"
					text-anchor="middle"
					class="fill-muted-foreground font-mono text-[12px]"
				>
					Vitest · Playwright · GitHub Actions
				</text>
			</g>

			{#each targets as target, i (target.id)}
				<g>
					<rect
						x="760"
						y={target.y - 20}
						width="220"
						height="40"
						rx="20"
						class="fill-card stroke-border"
					/>
					<circle
						cx="782"
						cy={target.y}
						r="4"
						class="ping fill-primary"
						style:animation-delay="{1.95 + i * 0.08}s"
					/>
					<circle cx="782" cy={target.y} r="4" class="fill-primary" />
					<text x="798" y={target.y + 4} class="fill-foreground font-mono text-[12px]">
						{target.id}
					</text>
				</g>
			{/each}
		</svg>
	</div>

	<div data-pipeline="stacked" class="lg:hidden">
		<svg viewBox="0 0 360 560" role="img" aria-label={LABEL} class="mx-auto block w-full max-w-sm">
			<defs>
				<pattern id="{uid}-s-grid" width="25" height="25" patternUnits="userSpaceOnUse">
					<path d="M25 0H0V25" fill="none" class="stroke-border" stroke-width="1" />
				</pattern>
				<radialGradient id="{uid}-s-core" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.3" />
					<stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
				</radialGradient>
				<filter id="{uid}-s-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="3" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<rect width="360" height="560" fill="url(#{uid}-s-grid)" opacity="0.6" />

			<path d="M180 80 V198" fill="none" class="stroke-border" stroke-width="1.5" />
			<path
				d="M180 80 V198"
				pathLength="1"
				fill="none"
				class="beam stroke-primary"
				stroke-width="2"
				stroke-linecap="round"
				filter="url(#{uid}-s-glow)"
			/>

			{#each stackedTargets as target, i (target.id)}
				<g>
					<path d={stackedFanPath(target.x)} fill="none" class="stroke-border" stroke-width="1.5" />
					<path
						d={stackedFanPath(target.x)}
						pathLength="1"
						fill="none"
						class="beam stroke-primary"
						stroke-width="2"
						stroke-linecap="round"
						filter="url(#{uid}-s-glow)"
						style:animation-delay="{1.15 + i * 0.08}s"
					/>
				</g>
			{/each}

			<g>
				<rect x="80" y="24" width="200" height="56" rx="12" class="fill-card stroke-border" />
				<text x="180" y="57" text-anchor="middle" class="fill-foreground font-mono text-[14px]">
					git push
				</text>
			</g>

			<g>
				<circle cx="180" cy="270" r="110" fill="url(#{uid}-s-core)" />
				<circle
					cx="180"
					cy="270"
					r="72"
					fill="none"
					class="spin stroke-primary"
					stroke-opacity="0.5"
					stroke-dasharray="2 7"
				/>
				<circle cx="180" cy="270" r="58" class="fill-card stroke-border" />
				<text x="180" y="275" text-anchor="middle" class="fill-foreground font-mono text-[14px]">
					test &amp; build
				</text>
			</g>

			{#each stackedTargets as target, i (target.id)}
				<g>
					<rect
						x={target.x - 76}
						y="440"
						width="152"
						height="40"
						rx="20"
						class="fill-card stroke-border"
					/>
					<circle
						cx={target.x - 54}
						cy="460"
						r="4"
						class="ping fill-primary"
						style:animation-delay="{1.95 + i * 0.08}s"
					/>
					<circle cx={target.x - 54} cy="460" r="4" class="fill-primary" />
					<text x={target.x - 40} y="464" class="fill-foreground font-mono text-[12px]">
						{target.id}
					</text>
				</g>
			{/each}

			<text
				x="180"
				y="528"
				text-anchor="middle"
				class="fill-muted-foreground font-mono text-[12px]"
			>
				Vitest · Playwright · GitHub Actions
			</text>
		</svg>
	</div>
	<PlusCorners />
</figure>
