<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();

	function onpointermove(event: PointerEvent & { currentTarget: HTMLElement }) {
		const rect = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
		event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
	}
</script>

<article {onpointermove} class="spotlight {className}">
	<span aria-hidden="true" class="spotlight-fill"></span>
	<span aria-hidden="true" class="spotlight-border"></span>
	{@render children()}
</article>
