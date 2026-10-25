<script lang="ts">
	import ContactSection from '$lib/components/contact/contact-section.svelte';
	import ExperienceSection from '$lib/components/experience/experience-section.svelte';
	import Hero from '$lib/components/hero/hero.svelte';
	import Seo from '$lib/components/site/seo.svelte';
	import { profile } from '$lib/data/profile';
	import HowIShip from '$lib/components/process/how-i-ship.svelte';
	import StackSection from '$lib/components/stack/stack-section.svelte';
	import SelectedWork from '$lib/components/work/selected-work.svelte';
	import { personJsonLd } from '$lib/seo';
</script>

<Seo
	title="Emma Long — Full-Stack Engineer"
	description={profile.intro}
	path="/"
	jsonLd={personJsonLd()}
/>

<main>
	<Hero />
	<SelectedWork />
	<HowIShip />
	<StackSection />
	<ExperienceSection />
	<ContactSection />
</main>
