<script lang="ts">
	import { onMount } from 'svelte';
	import { initParticleScene } from './(particle-scene)/particle-scene.svelte';

	let canvas: HTMLCanvasElement;
	let heroSection: HTMLElement;

	function handleScroll() {
		const scrollPos = window.scrollY;
		const windowHeight = window.innerHeight;
		const newOpacity = 1 - (1.5 * scrollPos) / windowHeight;
		heroSection.style.opacity = Math.max(0, Math.min(1, newOpacity)).toString();
	}

	onMount(() => {
		initParticleScene(canvas, keywords);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
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
		'Google Cloud Platform',
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
		<div
			class="animate-gradient group bg-[linear-gradient(to_right,#F77D25,#F7BB25,#F7A125,#F75925,#F7A125,#F7BB25,#F77D25)] bg-[length:200%_auto] bg-clip-text p-5 text-transparent drop-shadow-md"
		>
			<h1 class="text-6xl font-extrabold md:text-9xl">Shawn Long</h1>
			<h3 class="font-semiboldm mt-4 rounded p-2 text-xl">
				<span class="group-hover:animate-wave inline-block cursor-pointer text-black">👋</span> This
				is a playground for Shawn's hobby projects
			</h3>
		</div>
	</div>
</section>

<!-- Additional Content Section -->
<section class="flex flex-col gap-5 border-t p-8 text-white">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each new Array(5) as _, i}
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
