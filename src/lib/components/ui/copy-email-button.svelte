<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	let { email }: { email: string } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(timer));

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 2000);
		} catch {
			copied = false;
		}
	}
</script>

<button
	type="button"
	onclick={handleCopy}
	class="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
>
	{#if copied}
		<Check class="size-4 text-primary" aria-hidden="true" />
	{:else}
		<Copy class="size-4" aria-hidden="true" />
	{/if}
	<span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
</button>
