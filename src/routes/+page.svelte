<script lang="ts">
	import AboutMe from './(components)/about-me.svelte';
	import Contact from './(components)/(contact)/contact.svelte';
	import FeaturedProjects from './(components)/featured-projects.svelte';
	import HeroSection from './(components)/(hero-section)/hero-section.svelte';
	import KeywordsSeoSection from './(components)/keywords-seo-section.svelte';
	import type { PageData } from './$types';
	import WorkHistory from './(components)/work-history.svelte';

	let { data }: { data: PageData } = $props();

	function scrollToElement(element: HTMLElement, topBuffer: number) {
		const elementRect = element.getBoundingClientRect();
		const scrollPos = elementRect.top - topBuffer;
		window.scrollTo({ top: scrollPos });
	}

	let scrollToSection: HTMLElement;
</script>

<HeroSection
	scrollToExploreHandler={() => scrollToElement(scrollToSection, 64)}
	getInTouchHandler={() => undefined}
	downloadResumeHandler={() => undefined}
/>
<div bind:this={scrollToSection}><AboutMe /></div>
<FeaturedProjects />
<WorkHistory />
<Contact {data} />
<KeywordsSeoSection />
