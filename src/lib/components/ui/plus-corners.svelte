<script lang="ts">
	const positions = [
		'-top-[7px] -left-[7px]',
		'-top-[7px] -right-[7px]',
		'-bottom-[7px] -left-[7px]',
		'-bottom-[7px] -right-[7px]'
	];
</script>

{#each positions as position (position)}
	<svg
		aria-hidden="true"
		viewBox="0 0 14 14"
		class="pointer-events-none absolute size-3.5 text-muted-foreground/60 {position}"
	>
		<path d="M7 0v14M0 7h14" stroke="currentColor" stroke-width="1" />
	</svg>
{/each}
