<script lang="ts">
	import { onMount } from 'svelte';
	import { initParticleScene } from './particleScene.svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		initParticleScene(canvas);
	});
</script>

<div class="relative h-screen w-screen bg-black">
	<canvas bind:this={canvas} class="absolute inset-0 z-10"></canvas>
	<div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
		<h1 class="text-4xl font-bold">Shawn Long</h1>
		<h3 class="mt-4 text-xl">This is a playground for Shawn's hobby projects</h3>
	</div>
</div>
