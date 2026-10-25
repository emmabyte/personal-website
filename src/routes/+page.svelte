<script lang="ts">
	import Hero from '$lib/components/hero/hero.svelte';
	import Seo from '$lib/components/site/seo.svelte';
	import { profile } from '$lib/data/profile';
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
	<section id="process" aria-labelledby="process-title">
		<h2 id="process-title">How I ship</h2>
	</section>
	<section id="stack" aria-labelledby="stack-title">
		<h2 id="stack-title">Tools of the trade</h2>
	</section>
	<section id="experience" aria-labelledby="experience-title">
		<h2 id="experience-title">Experience</h2>
	</section>
	<section id="contact" aria-labelledby="contact-title">
		<h2 id="contact-title">Contact</h2>
	</section>
</main>
