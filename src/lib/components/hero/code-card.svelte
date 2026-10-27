<script lang="ts">
	type Tone = 'key' | 'str' | 'fn' | 'dim' | 'comment';
	type Token = { text: string; tone?: Tone; nowrap?: boolean }; // nowrap: keep short phrases whole

	const str = (text: string): Token => ({ text, tone: 'str' });
	// One quoted string per line, as an array item. Short ones never split; long ones wrap on phones.
	const item = (text: string, comment?: string) => ({
		indent: 2,
		tokens: [
			{ ...str(text), nowrap: text.length <= 18 },
			{ text: ',' },
			...(comment ? [{ text: ` // ${comment}`, tone: 'comment' as const, nowrap: true }] : [])
		]
	});
	// An inline array of quoted strings after a key.
	const list = (key: string, values: string[]) => ({
		indent: 1,
		tokens: [
			{ text: key, tone: 'key' as const },
			{ text: ': [' },
			...values.flatMap((value, i) => [
				...(i ? [{ text: ', ' }] : []),
				{ ...str(`'${value}'`), nowrap: true }
			]),
			{ text: '],' }
		]
	});

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
			tokens: [{ text: 'focus', tone: 'key' }, { text: ': ' }, str("'full-stack'"), { text: ',' }]
		},
		list('stack', ['SvelteKit', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel']),
		{ indent: 1, tokens: [{ text: 'believes', tone: 'key' }, { text: ': [' }] },
		item("'if it can break, it will'"),
		item("'human in the loop, always'"),
		item("'dont be evil'", 'rip'),
		{ indent: 1, tokens: [{ text: '],' }] },
		list('prefers', ['UX > UI', 'tests != trust', 'joy > features']),
		{ indent: 0, tokens: [{ text: '};' }] }
	];

	const toneClass: Record<Tone, string> = {
		key: 'text-foreground',
		str: 'text-primary-text',
		fn: 'text-foreground font-semibold',
		dim: 'text-muted-foreground',
		comment: 'text-muted-foreground/85 italic'
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
	<!-- Long lines wrap under their own indent instead of scrolling sideways on phones. -->
	<pre class="p-5 font-mono text-[13px] leading-6"><code
			>{#each lines as line, i (i)}<div class="flex"><span
						aria-hidden="true"
						class="w-8 shrink-0 text-muted-foreground/40 select-none">{i + 1}</span
					><span
						class="min-w-0 flex-1 break-words whitespace-pre-wrap"
						style:padding-left="{line.indent * 1.25}rem"
						>{#each line.tokens as token, j (j)}<span
								class={[
									token.tone ? toneClass[token.tone] : 'text-muted-foreground',
									token.nowrap && 'whitespace-nowrap'
								]}>{token.text}</span
							>{/each}</span
					></div>{/each}</code
		></pre>
</figure>
