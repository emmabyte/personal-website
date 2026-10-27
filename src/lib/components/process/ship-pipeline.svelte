<script lang="ts">
	import PlusCorners from '$lib/components/ui/plus-corners.svelte';

	// Unique per instance so the <defs> ids can't collide with other inline SVGs on the page.
	const uid = $props.id();

	const LABEL =
		'Diagram: a git push runs lint and type checks, unit tests, an AI code review and a security scan in parallel on GitHub Actions, then a build with end-to-end tests. Pull requests deploy to a preview that gets smoke-tested; merges to main run database migrations, deploy to production, and smoke-test it with automatic rollback.';

	const checks = ['lint & types', 'unit tests', 'AI review', 'security scan'];
	// Pull requests stop at a preview; merges to main go on to production.
	const lanes = [
		{ id: 'preview', stages: ['preview', 'smoke tests'] },
		{ id: 'production', stages: ['migrate db', 'production', 'smoke · rollback'] }
	];

	// The beam takes 1.2s to cross a segment (40% of the 3s loop), so each hop starts ~0.5s after the last.
	const HOP = 0.5;
	const beamDelay = (hop: number) => `${hop * HOP}s`;
	const pingDelay = (hop: number) => `${hop * HOP + 0.45}s`;
	// Each stage glows as the beam reaches it; git push glows just before the first beam leaves.
	const glowDelay = (hop: number) => (hop < 0 ? '-0.3s' : pingDelay(hop));

	// Wide drawing: push fans out to the checks, they fan back into the build, which fans out to two lanes.
	const wide = {
		checkX: 210,
		checkW: 160,
		checkYs: [86, 142, 198, 254],
		core: { x: 470, y: 170 },
		laneX: 600,
		laneYs: [100, 240],
		widths: { 'smoke · rollback': 160, 'smoke tests': 140 } as Record<string, number>,
		gap: 30
	};
	const pillW = (stage: string) => wide.widths[stage] ?? 120;
	const laneStages = (stages: string[]) => {
		let x = wide.laneX;
		return stages.map((stage) => {
			const pill = { stage, x, w: pillW(stage) };
			x += pill.w + wide.gap;
			return pill;
		});
	};

	// Stacked drawing: checks sit in one card, and the two lanes run down side by side.
	const stacked = {
		checkSpots: [
			{ x: 40, y: 150 },
			{ x: 196, y: 150 },
			{ x: 40, y: 186 },
			{ x: 196, y: 186 }
		],
		core: { x: 180, y: 320 },
		laneXs: [96, 264],
		laneTop: 440,
		pillH: 36,
		step: 60
	};
</script>

{#snippet defs(prefix: string)}
	<defs>
		<pattern id="{prefix}-grid" width="25" height="25" patternUnits="userSpaceOnUse">
			<path d="M25 0H0V25" fill="none" class="stroke-border" stroke-width="1" />
		</pattern>
		<radialGradient id="{prefix}-core" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.3" />
			<stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
		</radialGradient>
		<filter id="{prefix}-halo" x="-50%" y="-100%" width="200%" height="300%">
			<feGaussianBlur stdDeviation="9" />
		</filter>
		<filter id="{prefix}-glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
{/snippet}

<!-- short: a straight hop of a few dozen px, which needs a longer beam to be visible -->
{#snippet wire(d: string, prefix: string, hop: number, short = false)}
	<path {d} fill="none" class="stroke-border" stroke-width="1.5" />
	<path
		{d}
		pathLength="1"
		fill="none"
		class={['beam stroke-primary', short && 'beam-short']}
		stroke-width="2"
		stroke-linecap="round"
		filter="url(#{prefix}-glow)"
		style:animation-delay={beamDelay(hop)}
	/>
{/snippet}

{#snippet dot(cx: number, cy: number, hop: number)}
	<circle {cx} {cy} r="4" class="ping fill-primary" style:animation-delay={pingDelay(hop)} />
	<circle {cx} {cy} r="4" class="fill-primary" />
{/snippet}

{#snippet halo(x: number, y: number, w: number, h: number, prefix: string, hop: number)}
	<rect
		x={x - 4}
		y={y - 4}
		width={w + 8}
		height={h + 8}
		rx={h / 2}
		fill="var(--brand)"
		fill-opacity="0.45"
		filter="url(#{prefix}-halo)"
		class="glow"
		style:animation-delay={glowDelay(hop)}
	/>
{/snippet}

{#snippet pill(x: number, y: number, w: number, label: string, hop: number, prefix: string)}
	{@render halo(x, y - 18, w, 36, prefix, hop)}
	<rect {x} y={y - 18} width={w} height="36" rx="18" class="fill-card stroke-border" />
	{@render dot(x + 18, y, hop)}
	<text x={x + 32} y={y + 4} class="fill-foreground font-mono text-[12px]">{label}</text>
{/snippet}

{#snippet core(x: number, y: number, prefix: string)}
	<circle
		cx={x}
		cy={y}
		r="110"
		fill="url(#{prefix}-core)"
		class="glow glow-core"
		style:animation-delay={glowDelay(1)}
	/>
	<circle
		cx={x}
		cy={y}
		r="72"
		fill="none"
		class="spin stroke-primary"
		stroke-opacity="0.5"
		stroke-dasharray="2 7"
	/>
	<circle cx={x} cy={y} r="58" class="fill-card stroke-border" />
	<text {x} y={y + 5} text-anchor="middle" class="fill-foreground font-mono text-[14px]">
		build &amp; e2e
	</text>
{/snippet}

<figure class="relative rounded-2xl border border-border bg-background">
	<figcaption class="border-b border-border px-5 py-3 font-mono text-xs text-muted-foreground">
		{'// from commit to production, on every push'}
	</figcaption>
	<!-- Wide drawing from laptop width up; the stacked one below covers phones and tablets. -->
	<div data-pipeline="wide" class="hidden lg:block">
		<svg viewBox="0 0 1100 340" role="img" aria-label={LABEL} class="block w-full">
			{@render defs(uid)}
			<rect width="1100" height="340" fill="url(#{uid}-grid)" opacity="0.6" />

			{#each wide.checkYs as y (y)}
				{@render wire(`M150 170 C 180 170 180 ${y} ${wide.checkX} ${y}`, uid, 0)}
				{@render wire(
					`M${wide.checkX + wide.checkW} ${y} C 400 ${y} 395 ${wide.core.y} 412 ${wide.core.y}`,
					uid,
					1
				)}
			{/each}
			{#each lanes as lane, i (lane.id)}
				{@const y = wide.laneYs[i]}
				{@const pills = laneStages(lane.stages)}
				{@render wire(
					`M528 ${wide.core.y} C 565 ${wide.core.y} 565 ${y} ${wide.laneX} ${y}`,
					uid,
					2
				)}
				{#each pills.slice(1) as next, j (next.stage)}
					{@const prev = pills[j]}
					{@render wire(`M${prev.x + prev.w} ${y} H${next.x}`, uid, 3 + j, true)}
				{/each}
			{/each}

			<g>
				{@render halo(20, 142, 130, 56, uid, -1)}
				<rect x="20" y="142" width="130" height="56" rx="12" class="fill-card stroke-border" />
				<text x="38" y="175" class="fill-foreground font-mono text-[14px]">git push</text>
			</g>

			{#each checks as check, i (check)}
				<g>{@render pill(wide.checkX, wide.checkYs[i], wide.checkW, check, 0, uid)}</g>
			{/each}

			<g>{@render core(wide.core.x, wide.core.y, uid)}</g>

			{#each lanes as lane, i (lane.id)}
				{#each laneStages(lane.stages) as stage, j (stage.stage)}
					<g>{@render pill(stage.x, wide.laneYs[i], stage.w, stage.stage, 2 + j, uid)}</g>
				{/each}
			{/each}

			<text
				x={wide.core.x}
				y="318"
				text-anchor="middle"
				class="fill-muted-foreground font-mono text-[12px]"
			>
				Vitest · Playwright · GitHub Actions
			</text>
		</svg>
	</div>

	<div data-pipeline="stacked" class="lg:hidden">
		<svg viewBox="0 0 360 600" role="img" aria-label={LABEL} class="mx-auto block w-full max-w-sm">
			{@render defs(`${uid}-s`)}
			<rect width="360" height="600" fill="url(#{uid}-s-grid)" opacity="0.6" />

			{@render wire('M180 72 V112', `${uid}-s`, 0, true)}
			{@render wire(`M180 212 V${stacked.core.y - 58}`, `${uid}-s`, 1, true)}
			{#each lanes as lane, i (lane.id)}
				{@const x = stacked.laneXs[i]}
				{@render wire(
					`M180 ${stacked.core.y + 58} C 180 410 ${x} 400 ${x} ${stacked.laneTop - 18}`,
					`${uid}-s`,
					2
				)}
				{#each lane.stages.slice(1) as stage, j (stage)}
					{@const top = stacked.laneTop + j * stacked.step}
					{@render wire(`M${x} ${top + 18} V${top + stacked.step - 18}`, `${uid}-s`, 3 + j, true)}
				{/each}
			{/each}

			<g>
				{@render halo(90, 20, 180, 52, `${uid}-s`, -1)}
				<rect x="90" y="20" width="180" height="52" rx="12" class="fill-card stroke-border" />
				<text x="180" y="51" text-anchor="middle" class="fill-foreground font-mono text-[14px]">
					git push
				</text>
			</g>

			<g>
				{@render halo(18, 112, 324, 100, `${uid}-s`, 0)}
				<rect x="18" y="112" width="324" height="100" rx="14" class="fill-card stroke-border" />
				{#each checks as check, i (check)}
					{@const spot = stacked.checkSpots[i]}
					{@render dot(spot.x, spot.y, 0)}
					<text x={spot.x + 14} y={spot.y + 4} class="fill-foreground font-mono text-[12px]">
						{check}
					</text>
				{/each}
			</g>

			<g>{@render core(stacked.core.x, stacked.core.y, `${uid}-s`)}</g>

			{#each lanes as lane, i (lane.id)}
				{#each lane.stages as stage, j (stage)}
					<g>
						{@render pill(
							stacked.laneXs[i] - 78,
							stacked.laneTop + j * stacked.step,
							156,
							stage,
							2 + j,
							`${uid}-s`
						)}
					</g>
				{/each}
			{/each}
		</svg>
	</div>
	<PlusCorners />
</figure>
