<script lang="ts">
	import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
	import { type ContactFormSchema } from '$lib/schemas/contact';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';

	import ContactForm from './contact-form.svelte';
	import LetsConnectCard from './lets-connect-card.svelte';
	import { toast } from 'svelte-sonner';
	import type { SocialLink } from '$lib/types/social-link';

	let { data }: { data: { form: SuperValidated<Infer<ContactFormSchema>> } } = $props();
	let emailCopied = $state(false);
	const email = 'shawnlong636@gmail.com';

	const socialLinks: SocialLink[] = [
		{
			name: 'LinkedIn',
			icon: faLinkedinIn,
			url: 'https://www.linkedin.com/in/shawnlong636/'
		},
		{
			name: 'GitHub',
			icon: faGithub,
			url: 'https://github.com/shawn636'
		}
	];

	const copyEmail = async () => {
		await navigator.clipboard.writeText(email);
		emailCopied = true;
		toast.success('Email copied to clipboard', {
			description: 'You can now paste it anywhere you need.'
		});

		setTimeout(() => {
			emailCopied = false;
		}, 2000);
	};
</script>

<section id="contact" class="w-full py-12 md:py-24 lg:py-32">
	<div class="container px-4 md:px-6">
		<!-- Section Headers -->
		<div class="mb-12 text-center">
			<h2
				class="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
			>
				Contact
			</h2>
			<p class="mt-2 text-xl text-muted-foreground">Get in Touch</p>
		</div>

		<!-- Two-Panel Container -->
		<div class="grid gap-10 md:grid-cols-2">
			<LetsConnectCard {email} {socialLinks} {copyEmail} bind:emailCopied />
			<ContactForm {data} />
		</div>
	</div>
</section>
