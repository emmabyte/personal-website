<script lang="ts">
	import AboutMe from './(components)/about-me.svelte';
	import Contact from './(components)/(contact)/contact.svelte';
	import FeaturedProjects from './(components)/featured-projects.svelte';
	import HeroSection from './(components)/(hero-section)/hero-section.svelte';
	import KeywordsSeoSection from './(components)/keywords-seo-section.svelte';
	import type { PageData } from './$types';
	import WorkHistory from './(components)/work-history.svelte';

	let { data }: { data: PageData } = $props();

	function scrollToElement(element: HTMLElement, topBuffer: number = 0) {
		const elementRect = element.getBoundingClientRect();
		const scrollPos = elementRect.top - topBuffer;
		window.scrollTo({ top: scrollPos });
	}

	function downloadResume(): void {
		const link = document.createElement('a');
		link.href = '/documents/resume.pdf';
		link.download = 'resume-emma-long-june-2025.pdf';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	let scrollToSection: HTMLElement;
	let contactSection: HTMLElement;
</script>

<HeroSection
	scrollToExploreHandler={() => scrollToElement(scrollToSection, 64)}
	contactHandler={() => scrollToElement(contactSection)}
	downloadResumeHandler={downloadResume}
/>
<div bind:this={scrollToSection}><AboutMe /></div>
<FeaturedProjects />
<WorkHistory />
<div bind:this={contactSection}><Contact {data} /></div>
<KeywordsSeoSection />
