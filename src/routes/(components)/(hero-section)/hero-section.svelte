<script lang="ts">
	import { initParticleScene, sceneState } from './(particle-scene)/particle-scene.svelte';
	import { onMount } from 'svelte';
	import { getXYFromScroll } from './(particle-scene)/util';
	import { Button } from '$lib/components/ui/button/index';
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

	interface Props {
		contactHandler?: () => void;
		downloadResumeHandler?: () => void;
		scrollToExploreHandler?: () => void;
	}

	let {
		contactHandler = () => {},
		downloadResumeHandler = () => {},
		scrollToExploreHandler = () => {}
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let heroSection: HTMLElement;

	function handleScroll() {
		const scrollPos = window.scrollY;
		const windowHeight = window.innerHeight;

		// Opacity effect for the hero section
		const newOpacity = 1 - (2.5 * scrollPos) / windowHeight;
		heroSection.style.opacity = Math.max(0, Math.min(1, newOpacity)).toString();

		// Orbit camera around origin around the x axis
		if (sceneState.camera) {
			const canvasEndPos = heroSection.offsetHeight;

			const { x, z } = getXYFromScroll(scrollPos, canvasEndPos, Math.PI / 4);
			sceneState.camera.position.set(sceneState.camera.position.x, x, z);
			sceneState.camera.lookAt(0, 0, 0);
		} else {
			console.error('Camera not initialized');
		}
	}

	function handleMouseMove(event: MouseEvent) {
		const x = event.clientX;
		const y = event.clientY;

		const multiplier = 0.1;
		const xShift = (x / window.innerWidth) * 100 * multiplier;
		const yShift = -(y / window.innerHeight) * 100 * multiplier;
		sceneState.camera?.position.set(xShift, yShift, sceneState.camera.position.z);
	}

	// function smoothScrollDown() {}

	onMount(() => {
		initParticleScene(canvas);
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<!-- Hero Section: Full Screen Banner -->
<section bind:this={heroSection} class="relative h-screen w-full bg-black">
	<canvas bind:this={canvas} class="absolute inset-0 z-10"></canvas>
	<div class="absolute inset-0 z-20 flex flex-col items-center justify-center">
		<div class="mx-5 max-w-2xl rounded border bg-zinc-950/80">
			<div
				class="group animate-gradient bg-[linear-gradient(to_right,#F77D25,#F7BB25,#F7A125,#F75925,#F7A125,#F7BB25,#F77D25)] bg-[length:200%_auto] bg-clip-text p-5 text-transparent drop-shadow-md"
			>
				<h1 class="text-6xl font-extrabold">Shawn Long</h1>
				<h3 class="font-semiboldm mt-4 rounded p-2 text-xl">
					<span class="inline-block cursor-pointer text-black group-hover:animate-wave">👋</span>
					Hello! I'm an experienced fullstack developer with a passion for
					<u class="border-b border-white">captivating</u> user experiences.
				</h3>
				<div class="mt-4 flex gap-4">
					<Button variant="default" onclick={contactHandler}>Get in touch</Button>
					<Button variant="outline" class="text-white" onclick={downloadResumeHandler}
						>Download Resume</Button
					>
				</div>
			</div>
		</div>
		<div class="mt-20 flex flex-col items-center justify-items-center gap-2">
			<button onclick={scrollToExploreHandler}>Scroll to explore</button>
			<Fa icon={faChevronDown} size="lg" class="animate-bounce" />
		</div>
	</div>
</section>
