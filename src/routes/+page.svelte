<script lang="ts">
	import KeywordsSeoSection from './keywords-seo-section.svelte';
	import HeroSection from './hero-section.svelte';
	import AboutMe from './about-me.svelte';
	import FeaturedProjects from './featured-projects.svelte';
	import WorkHistory from './work-history.svelte';
	import GetInTouch from './get-in-touch.svelte';

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
<KeywordsSeoSection />
<GetInTouch />
