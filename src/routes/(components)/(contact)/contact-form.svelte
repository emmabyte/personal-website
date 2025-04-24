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
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: { form: SuperValidated<Infer<ContactFormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(contactFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Content>
		<h3 class="mb-6 flex items-center gap-2 text-2xl font-semibold">
			<Fa icon={faPaperPlane} class="h-5 w-5 text-violet-500" />
			Send a Message
		</h3>

		<form method="POST" class="space-y-5" use:enhance>
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
					<Form.FieldErrors />
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

			<Form.Field {form} name="captcha">
				<Form.Control>
					<Form.Label>Verification</Form.Label>
					<!-- <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is a test key
                          onChange={handleCaptchaChange}
                          theme="dark"
                        /> -->
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

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
