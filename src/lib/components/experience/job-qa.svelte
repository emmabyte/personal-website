<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { Faq } from '$lib/data/types';

	let { faqs, company }: { faqs: Faq[]; company: string } = $props();
</script>

{#if faqs.length > 0}
	<details class="group mt-4">
		<summary
			class="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm font-mono text-xs text-muted-foreground transition-colors hover:text-primary-text [&::-webkit-details-marker]:hidden"
		>
			Q&amp;A<span class="sr-only"> about {company}</span>
			<ChevronDown
				aria-hidden="true"
				class="size-3.5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
			/>
		</summary>
		<dl class="mt-4 flex flex-col gap-5 border-l border-border pl-4">
			{#each faqs as faq (faq.question)}
				<div class="flex flex-col gap-1.5">
					<dt class="text-sm font-medium">{faq.question}</dt>
					<dd class="text-sm leading-relaxed text-pretty text-muted-foreground">{faq.answer}</dd>
				</div>
			{/each}
		</dl>
	</details>
{/if}
