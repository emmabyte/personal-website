<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class: string;
		patternColor?: string;
		patternOpacity?: number;
	}

	let {
		class: className,
		patternColor = 'hsl(var(--foreground))',
		patternOpacity = 0.5
	}: Props = $props();

	// Create the SVG pattern URL. (Make sure patternColor is in the correct format for your use case.)
	const svgPattern = `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${patternColor}' fill-opacity='${patternOpacity}' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`;
</script>

<div
	class={cn('h-full w-full border-2 border-dashed', className)}
	style:background-image={svgPattern}
></div>
