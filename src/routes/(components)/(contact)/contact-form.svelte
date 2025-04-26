<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';

	import { contactFormSchema, type ContactFormSchema } from '$lib/schemas/contact';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import { Button } from '$lib/components/ui/button';
	import Fa from 'svelte-fa';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';

	const siteKey = '6LdpOCErAAAAAAHjxfVB27YpfygVc01LtIoE-VqP'; // Replace with your actual site key

	let { data }: { data: { form: SuperValidated<Infer<ContactFormSchema>> } } = $props();
	let formElement: HTMLFormElement;

	const form = superForm(data.form, {
		validators: zodClient(contactFormSchema)
	});

	const { form: formData, enhance } = form;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (typeof window.grecaptcha === 'undefined') {
			toast.error('reCAPTCHA is not ready. Please try again later.');
			return;
		}

		window.grecaptcha.ready(() => {
			window.grecaptcha.execute(siteKey, { action: 'submit' }).then(async (token: string) => {
				// const tokenInput = document.createElement('input');
				// tokenInput.type = 'hidden';
				// tokenInput.name = 'g-recaptcha-response';
				// tokenInput.value = token;
				// gReCaptchaInput.value = token; // one of these may be unnecessary
				$formData.gRecaptchaResponse = token; // one of these may be unnecessary
				// formElement.submit();

				const { valid } = await form.validateForm();
				if (!valid) {
					toast.error('Please fill in all required fields.');
					return;
				}

				// TODO: Set Loading Spinner
				const response = await fetch('/api/contact', {
					method: 'POST',
					body: new FormData(formElement)
				});

				// TODO: Dismiss the Loading Spinner

				if (response.ok) {
					// reset the form
					form.reset();

					toast.success('Success', {
						description: 'Message successfully sent.'
					});
				} else {
					const error = await response.json();

					toast.error('Error sending message', {
						description: error.message || 'An unknown error occurred.'
					});
				}
			});
		});
	}
</script>

<Card.Root>
	<Card.Content>
		<h3 class="mb-6 flex items-center gap-2 text-2xl font-semibold">
			<Fa icon={faPaperPlane} class="h-5 w-5 text-violet-500" />
			Send a Message
		</h3>

		<form
			bind:this={formElement}
			method="POST"
			class="space-y-5"
			use:enhance
			onsubmit={handleSubmit}
		>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} placeholder="Your name" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} placeholder="your.email@example.com" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-[#CF2614]" />
				</Form.Field>
			</div>

			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<Form.Field {form} name="organization">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Organization</Form.Label>
							<Input {...props} bind:value={$formData.organization} placeholder="Company Name" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="position">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Position</Form.Label>
							<Input {...props} bind:value={$formData.position} placeholder="Your position" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Field {form} name="message">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Message</Form.Label>
						<Textarea
							bind:value={$formData.message}
							{...props}
							placeholder="Please let me know about the opportunity you'd like to discuss..."
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<input
				type="hidden"
				aria-hidden="true"
				bind:value={$formData.gRecaptchaResponse}
				name="gRecaptchaResponse"
			/>

			<div class="relative">
				<Button type="submit">
					<span class="flex items-center gap-2">
						Send Message <Fa icon={faPaperPlane} class="h-4 w-4" />
					</span>
				</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
