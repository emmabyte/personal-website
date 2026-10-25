<script lang="ts">
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import ContactForm from '$lib/components/contact/contact-form.svelte';
	import ContactLinks from '$lib/components/contact/contact-links.svelte';
	import { loadRecaptcha } from '$lib/contact/recaptcha-client';
	import { profile } from '$lib/data/profile';

	let section: HTMLElement | undefined = $state();

	// Start loading reCAPTCHA shortly before the section scrolls into view so v3
	// has time to observe the visitor, without putting it on the critical path.
	$effect(() => {
		if (!section || typeof IntersectionObserver === 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				// A failed warm-up is fine: focusing the form or submitting retries the load.
				loadRecaptcha(PUBLIC_RECAPTCHA_SITE_KEY).catch(() => {});
			},
			{ rootMargin: '600px' }
		);
		observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section
	id="contact"
	aria-labelledby="contact-title"
	bind:this={section}
	class="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28"
>
	<div
		class="grid gap-12 rounded-3xl border border-border bg-card p-8 md:grid-cols-2 md:gap-14 md:p-14"
	>
		<ContactLinks
			index="05"
			heading={profile.contactHeading}
			line={profile.contactLine}
			headingId="contact-title"
		/>
		<ContactForm />
	</div>
</section>
