<script lang="ts">
	import { onMount } from 'svelte';
	import {
		initParticleScene,
		sceneState,
		cameraZStart
	} from './(particle-scene)/particle-scene.svelte';

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
			console.log(`New Camera Position: (${x}, ${sceneState.camera.position.y}, ${z})`);
			sceneState.camera.position.set(sceneState.camera.position.x, x, z);
			sceneState.camera.lookAt(0, 0, 0);
		} else {
			console.error('Camera not initialized');
		}
	}

	// Lots of math going on here. Here's the breakdown:
	// 1. let f(gamma,beta) where gamma = scrollPos and beta = canvas end position
	//    f(gamma,beta) = (max(0, min(gamma, beta)) / beta )
	//    this gives a value between 0 and 1, which is the progress we've scrolled up to the window height
	//    To map this to a rotation value, we multiply by the max rotation value
	//    => phi = f(gamma,beta) = max_rotation_radians * (max(0, min(gamma, beta)) / beta )
	// 2. We then need rho, the radius of the circle we are orbiting around. Since we're only rotating
	//    around the y axis, we can use the camera's z position as the radius.
	//    => rho = z_cam
	// 3. We can then use the radius and the rotation value to get the x and y coordinates of the camera
	//    => x = rho * sin(phi)
	//    => y = rho * cos(phi)
	// 4. Finally, this gives us a total of three functions, based on three variables (and 1 paramter)
	//    f(gamma, beta) = max_rotation_radians * (max(0, min(gamma, beta)) / beta )
	//    x = z_cam * sin(f(gamma, beta))
	//    z = z_cam * cos(f(gamma, beta))
	function getXYFromScroll(scrollPos: number, canvasEndPos: number, maxRotationRadians: number) {
		const round = (num: number) => Math.round(num * 100) / 100;

		const f = (gamma: number, beta: number) => {
			console.log();
			return round(maxRotationRadians * (Math.max(0, Math.min(gamma, beta)) / beta));
		};

		const phi = f(scrollPos, canvasEndPos);
		const rho = cameraZStart; // Should only be the initial z position of the camera

		console.log(`gamma: ${scrollPos}, beta: ${canvasEndPos}, phi: ${phi}, rho: ${rho}`);

		const x = rho * Math.sin(phi);
		const z = rho * Math.cos(phi);

		return { x: round(x), z: round(z) };
	}

	function handleMouseMove(event: MouseEvent) {
		const x = event.clientX;
		const y = event.clientY;

		const multiplier = 0.1;
		const xShift = (x / window.innerWidth) * 100 * multiplier;
		const yShift = -(y / window.innerHeight) * 100 * multiplier;
		sceneState.camera?.position.set(xShift, yShift, sceneState.camera.position.z);
	}

	onMount(() => {
		initParticleScene(canvas, keywords);
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	const keywords = [
		'JavaScript',
		'Node.js',
		'TypeScript',
		'GraphQL',
		'CSS',
		'HTML5',
		'Three.js',
		'SvelteKit',
		'Playwright',
		'Vitest',
		'Unit Testing',
		'Integration Testing',
		'DevOps',
		'CI/CD',
		'GitHub Actions',
		'Docker',
		'Python',
		'Prefect',
		'Express',
		'SQL',
		'Relation Databases',
		'NoSQL',
		'APIs',
		'Webhooks',
		'Frontend',
		'Backend',
		'Fullstack',
		'Web Development',
		'Software Development',
		'Agile',
		'Mobile Development',
		'System Design',
		'System Architecture',
		'Microservices',
		'Bash',
		'Swift',
		'Linux',
		'C++',
		'Java',
		'Gitlab CI',
		'Networking',
		'Git',
		'Linux Servers',
		'Kubernetes',
		'k8s',
		'Google Cloud',
		'GCP',
		'CircleCI',
		'Angular',
		'React',
		'Vue',
		'SCSS',
		'Tailwind',
		'Unix Shell',
		'Database Administration',
		'Asana',
		'Slack',
		'Trello',
		'Google Workspace',
		'Zoom',
		'Figma',
		'Tableau',
		'Data Pipelines',
		'Data Analytics',
		'Big Data',
		'Data Engineering',
		'Performance Optimization',
		'Parallel Computing',
		'Scalability'
	];
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
			</div>
		</div>
	</div>
</section>

<!-- Additional Content Section -->
<section class="flex flex-col gap-5 border-t p-8 text-white">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each new Array(15) as _, i}
		<div class="flex flex-col gap-2">
			<h2 class="text-3xl font-bold">Section {i + 1}</h2>
			<p>
				Nostrud dolore laboris enim sunt nulla sit pariatur et sint ut cillum non culpa et. Sint
				laborum deserunt cupidatat et do cupidatat. Ipsum veniam ad deserunt reprehenderit est
				nostrud ea. Dolor nostrud quis cillum deserunt anim sint nulla laboris non voluptate.
			</p>
		</div>
	{/each}
</section>

<!-- Hidden Keywords Section for SEO since keywords display in Three.js Scene and not in the html -->
<section aria-hidden="true" style="display: none;">
	<h2>Keywords</h2>
	<ul>
		{#each keywords as keyword}
			<li>{keyword}</li>
		{/each}
	</ul>
</section>
