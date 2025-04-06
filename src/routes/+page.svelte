<script lang="ts">
	import KeywordsSeoSection from './keywords-seo-section.svelte';
	import HeroSection from './hero-section.svelte';
</script>

<HeroSection />
<!-- Additional Content Section -->
<section id="section1" class="flex flex-col gap-5 border-t p-8 text-white">
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

<KeywordsSeoSection />
