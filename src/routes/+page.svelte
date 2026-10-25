<script lang="ts">
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
	<!-- Placeholder sections: Tasks 5-9 replace these one at a time. -->
	<Hero />
	<SelectedWork />
	<HowIShip />
	<StackSection />
	<section id="experience" aria-labelledby="experience-title">
		<h2 id="experience-title">Experience</h2>
	</section>
	<section id="contact" aria-labelledby="contact-title">
		<h2 id="contact-title">Contact</h2>
	</section>
</main>
