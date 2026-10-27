<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { Faq } from '$lib/data/types';

	let { faqs, company }: { faqs: Faq[]; company: string } = $props();

	const uid = $props.id();
	const panelId = `${uid}-qa`;
	let open = $state(false);
</script>

{#if faqs.length > 0}
	<div class="mt-4">
		<button
			type="button"
			aria-expanded={open}
			aria-controls={panelId}
			onclick={() => (open = !open)}
			class="group inline-flex cursor-pointer items-center gap-1.5 rounded-sm font-mono text-xs text-muted-foreground transition-colors hover:text-primary-text"
		>
			Q&amp;A<span class="sr-only"> about {company}</span>
			<ChevronDown
				aria-hidden="true"
				class="size-3.5 transition-transform duration-300 ease-out group-aria-expanded:rotate-180 motion-reduce:transition-none"
			/>
		</button>
		<!--
			Rows animate from 0fr to 1fr so the panel eases open to its natural height.
			The answers stay in the HTML (search, find-in-page); `inert` and
			`invisible` keep a closed panel out of the tab order and the a11y tree.
		-->
		<div
			id={panelId}
			inert={!open}
			class={[
				'grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none',
				open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
			]}
		>
			<div class="overflow-hidden">
				<dl class="mt-4 flex flex-col gap-5 border-l border-border pl-4">
					{#each faqs as faq (faq.question)}
						<div class="flex flex-col gap-1.5">
							<dt class="text-sm font-medium">{faq.question}</dt>
							<dd class="text-sm leading-relaxed text-pretty text-muted-foreground">
								{faq.answer}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</div>
{/if}
