<script lang="ts">
	type Tone = 'key' | 'str' | 'fn' | 'dim';
	type Token = { text: string; tone?: Tone };

	const lines: { indent: number; tokens: Token[] }[] = [
		{
			indent: 0,
			tokens: [
				{ text: 'export const ', tone: 'dim' },
				{ text: 'engineer', tone: 'fn' },
				{ text: ' = {' }
			]
		},
		{
			indent: 1,
			tokens: [
				{ text: 'focus', tone: 'key' },
				{ text: ': ' },
				{ text: "'full-stack'", tone: 'str' },
				{ text: ',' }
			]
		},
		{
			indent: 1,
			tokens: [
				{ text: 'frontend', tone: 'key' },
				{ text: ': [' },
				{ text: "'SvelteKit'", tone: 'str' },
				{ text: ', ' },
				{ text: "'TypeScript'", tone: 'str' },
				{ text: '],' }
			]
		},
		{
			indent: 1,
			tokens: [
				{ text: 'backend', tone: 'key' },
				{ text: ': [' },
				{ text: "'Node'", tone: 'str' },
				{ text: ', ' },
				{ text: "'Go'", tone: 'str' },
				{ text: '],' }
			]
		},
		{
			indent: 1,
			tokens: [
				{ text: 'data', tone: 'key' },
				{ text: ': ' },
				{ text: "'PostgreSQL'", tone: 'str' },
				{ text: ',' }
			]
		},
		{
			indent: 1,
			tokens: [{ text: 'values', tone: 'key' }, { text: ': [' }]
		},
		{ indent: 2, tokens: [{ text: "'pipelines before features'", tone: 'str' }, { text: ',' }] },
		{ indent: 2, tokens: [{ text: "'modernize in phases'", tone: 'str' }, { text: ',' }] },
		{
			indent: 2,
			tokens: [{ text: "'sustainable pace, quality code'", tone: 'str' }, { text: ',' }]
		},
		{ indent: 1, tokens: [{ text: '],' }] },
		{ indent: 0, tokens: [{ text: '};' }] }
	];

	const toneClass: Record<Tone, string> = {
		key: 'text-foreground',
		str: 'text-primary-text',
		fn: 'text-foreground font-semibold',
		dim: 'text-muted-foreground'
	};
</script>

<figure
	aria-label="Code snippet summarizing my engineering focus"
	class="conic-border overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl shadow-foreground/10 backdrop-blur-md"
>
	<figcaption
		class="flex items-center gap-2 border-b border-border px-4 py-3 font-mono text-xs text-muted-foreground"
	>
		<span aria-hidden="true" class="size-2.5 rounded-full bg-muted-foreground/30"></span>
		<span aria-hidden="true" class="size-2.5 rounded-full bg-muted-foreground/30"></span>
		<span aria-hidden="true" class="size-2.5 rounded-full bg-muted-foreground/30"></span>
		<span class="ml-2">about.ts</span>
	</figcaption>
	<pre class="overflow-x-auto p-5 font-mono text-[13px] leading-6"><code
			>{#each lines as line, i (i)}<div class="flex"><span
						aria-hidden="true"
						class="w-8 shrink-0 text-muted-foreground/40 select-none">{i + 1}</span
					><span style:padding-left="{line.indent * 1.25}rem"
						>{#each line.tokens as token, j (j)}<span
								class={token.tone ? toneClass[token.tone] : 'text-muted-foreground'}
								>{token.text}</span
							>{/each}</span
					></div>{/each}</code
		></pre>
</figure>
