<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	let { email }: { email: string } = $props();

	let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
	let timer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(timer));

	const labels = {
		idle: 'Copy email',
		copied: 'Copied',
		// The address is printed right beside this button, so point the visitor at it.
		failed: "Couldn't copy — select the address"
	};

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(email);
			copyState = 'copied';
		} catch {
			// Blocked clipboard: insecure context, in-app browsers, or a denied permission.
			copyState = 'failed';
		}
		clearTimeout(timer);
		timer = setTimeout(() => (copyState = 'idle'), copyState === 'copied' ? 2000 : 4000);
	}
</script>

<button
	type="button"
	onclick={handleCopy}
	class="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
>
	{#if copyState === 'copied'}
		<Check class="size-4 text-primary" aria-hidden="true" />
	{:else}
		<Copy class="size-4" aria-hidden="true" />
	{/if}
	<span aria-live="polite">{labels[copyState]}</span>
</button>
