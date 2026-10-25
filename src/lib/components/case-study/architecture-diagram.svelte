<script lang="ts">
	import PlusCorners from '$lib/components/ui/plus-corners.svelte';
	import type { DiagramColumn } from '$lib/data/types';

	let {
		caption,
		description,
		columns
	}: { caption: string; description: string; columns: DiagramColumn[] } = $props();

	const uid = $props.id();

	// Geometry, in viewBox units. Columns are evenly spaced across the full width.
	const WIDTH = 1000;
	const PAD = 24;
	const GAP = 56;
	const MAX_BOX = 240;
	const TOP = 64;
	const ITEM_H = 52;
	const ITEM_GAP = 12;
	const BOTTOM = 28;

	const layout = $derived.by(() => {
		const count = Math.max(1, columns.length);
		const slot = (WIDTH - PAD * 2) / count;
		const boxW = Math.min(slot - (count > 1 ? GAP : 0), MAX_BOX);
		const rows = Math.max(1, ...columns.map((column) => column.items.length));
		const stackH = rows * ITEM_H + (rows - 1) * ITEM_GAP;
		const midY = TOP + stackH / 2;
		const placed = columns.map((column, i) => ({
			...column,
			x: PAD + slot * (i + 0.5) - boxW / 2
		}));
		const links = placed.slice(1).map((next, i) => ({
			from: placed[i].x + boxW,
			to: next.x
		}));
		return { boxW, height: TOP + stackH + BOTTOM, midY, placed, links };
	});
</script>

<figure class="relative rounded-2xl border border-border bg-background">
	<figcaption class="border-b border-border px-5 py-3 font-mono text-xs text-muted-foreground">
		{'// '}{caption}
	</figcaption>
	<div class="overflow-x-auto">
		<svg
			viewBox="0 0 {WIDTH} {layout.height}"
			role="img"
			aria-label={description}
			class="block w-full min-w-[640px]"
		>
			<defs>
				<pattern id="{uid}-grid" width="25" height="25" patternUnits="userSpaceOnUse">
					<path d="M25 0H0V25" fill="none" class="stroke-border" stroke-width="1" />
				</pattern>
				<radialGradient id="{uid}-core" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.22" />
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

			<rect width={WIDTH} height={layout.height} fill="url(#{uid}-grid)" opacity="0.6" />
			<ellipse
				cx={WIDTH / 2}
				cy={layout.midY}
				rx={WIDTH / 2.4}
				ry={layout.height / 1.6}
				fill="url(#{uid}-core)"
			/>

			{#each layout.links as link, i (i)}
				<path
					d="M{link.from} {layout.midY}H{link.to}"
					fill="none"
					class="stroke-border"
					stroke-width="1.5"
				/>
				<path
					d="M{link.from} {layout.midY}H{link.to}"
					pathLength="1"
					fill="none"
					class="beam stroke-primary"
					stroke-width="2"
					stroke-linecap="round"
					filter="url(#{uid}-glow)"
					style="animation-delay: {i * 0.4}s"
				/>
			{/each}

			{#each layout.placed as column (column.x)}
				<foreignObject x={column.x} y={16} width={layout.boxW} height="32">
					<div class="truncate font-mono text-[12px] leading-8 text-primary">{column.label}</div>
				</foreignObject>
				{#each column.items as item, row (row)}
					{@const y = TOP + row * (ITEM_H + ITEM_GAP)}
					<rect
						x={column.x}
						{y}
						width={layout.boxW}
						height={ITEM_H}
						rx="12"
						class="fill-card stroke-border"
					/>
					<foreignObject x={column.x + 12} y={y + 4} width={layout.boxW - 24} height={ITEM_H - 8}>
						<div class="flex h-full items-center font-mono text-[12px] leading-4 text-foreground">
							<span class="line-clamp-2">{item}</span>
						</div>
					</foreignObject>
				{/each}
			{/each}
		</svg>
	</div>
	<PlusCorners />
</figure>
