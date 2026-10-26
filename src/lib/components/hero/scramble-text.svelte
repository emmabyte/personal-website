<script lang="ts">
	import { untrack, type Snippet } from 'svelte';

	const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

	type Glyph = { char: string; scrambling: boolean };

	const toGlyphs = (text: string): Glyph[] =>
		[...text].map((char) => ({ char, scrambling: false }));

	let {
		words,
		interval = 2600,
		suffix
	}: { words: string[]; interval?: number; suffix?: Snippet } = $props();

	let glyphs = $state<Glyph[]>(untrack(() => toGlyphs(words[0])));

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || words.length < 2) return;

		let index = 0;
		let current = words[0];
		let raf = 0;
		let timer: ReturnType<typeof setTimeout>;

		const run = () => {
			index = (index + 1) % words.length;
			const target = words[index];
			const length = Math.max(current.length, target.length);
			const queue = Array.from({ length }, (_, i) => {
				const start = Math.floor(Math.random() * 14);
				return {
					from: current[i] ?? '',
					to: target[i] ?? '',
					start,
					end: start + 8 + Math.floor(Math.random() * 18)
				};
			});
			let tick = 0;

			const step = () => {
				let done = 0;
				const next: Glyph[] = queue.map((q) => {
					if (tick >= q.end) {
						done++;
						return { char: q.to, scrambling: false };
					}
					// Spaces stay spaces so the line keeps the same break points mid-scramble.
					if (tick >= q.start && q.to === ' ') return { char: ' ', scrambling: false };
					if (tick >= q.start)
						return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], scrambling: true };
					return { char: q.from, scrambling: false };
				});
				glyphs = next;
				if (done === queue.length) {
					current = target;
					timer = setTimeout(run, interval);
				} else {
					tick++;
					raf = requestAnimationFrame(step);
				}
			};
			step();
		};

		timer = setTimeout(run, interval);
		return () => {
			clearTimeout(timer);
			cancelAnimationFrame(raf);
		};
	});
</script>

<!--
	Every word sits invisibly in the same grid cell, so the box is always as tall
	as the longest one wraps to. The animated text floats over that box and can
	never push the rest of the page around.
-->
<span aria-hidden="true" class="relative grid">
	{#each words as word (word)}
		<span class="invisible col-start-1 row-start-1">{word}{@render suffix?.()}</span>
	{/each}
	<span class="absolute inset-0"
		><span data-scramble
			>{#each glyphs as glyph, i (i)}<span
					class={glyph.scrambling ? 'font-mono text-primary' : undefined}>{glyph.char}</span
				>{/each}</span
		>{@render suffix?.()}</span
	>
</span>
