<script lang="ts">
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { getRecaptchaToken, loadRecaptcha } from '$lib/contact/recaptcha-client';
	import { profile } from '$lib/data/profile';
	import { validateContact, type ContactFields } from '$lib/contact/validate';
	import type { ContactPostResponse } from '$lib/types/api/contact';
	import type { FullAutoFill } from 'svelte/elements';

	type Status = { tone: 'info' | 'success' | 'error'; text: string };

	const FIELD_ORDER: (keyof ContactFields)[] = [
		'name',
		'email',
		'organization',
		'position',
		'message'
	];
	const SUCCESS_TEXT = 'Thanks — your message is on its way.';
	const SUBMIT_TIMEOUT_MS = 20_000;
	const EMAIL_FALLBACK_TEXT = `You can also email me at ${profile.email}.`;
	const NETWORK_ERROR_TEXT = 'Something went wrong sending your message. Please email me instead.';

	let pending = $state(false);
	let errors = $state<Partial<Record<keyof ContactFields, string>>>({});
	let status = $state<Status | null>(null);

	const controlClass =
		'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-destructive';
	const linkClass =
		'rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

	function warmUpRecaptcha() {
		// A failed warm-up is fine: submitting retries the load.
		loadRecaptcha(PUBLIC_RECAPTCHA_SITE_KEY).catch(() => {});
	}

	function clearError(field: keyof ContactFields) {
		if (errors[field]) errors = { ...errors, [field]: undefined };
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (pending) return;

		const form = event.currentTarget as HTMLFormElement;
		const result = validateContact(Object.fromEntries(new FormData(form)));
		if (!result.success) {
			errors = result.errors;
			status = null;
			const first = FIELD_ORDER.find((field) => result.errors[field]);
			if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
			return;
		}

		errors = {};
		pending = true;
		status = { tone: 'info', text: 'Sending your message…' };
		try {
			const token = await getRecaptchaToken(PUBLIC_RECAPTCHA_SITE_KEY);
			const body = new FormData(form);
			body.append('gRecaptchaResponse', token);
			const response = await fetch('/api/contact', {
				method: 'POST',
				body,
				signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS)
			});
			const data: ContactPostResponse = await response.json();
			if (response.ok && data.success) {
				form.reset();
				status = { tone: 'success', text: SUCCESS_TEXT };
			} else {
				status = {
					tone: 'error',
					text: data.message ? `${data.message} ${EMAIL_FALLBACK_TEXT}` : NETWORK_ERROR_TEXT
				};
			}
		} catch {
			status = { tone: 'error', text: NETWORK_ERROR_TEXT };
		} finally {
			pending = false;
		}
	}
</script>

{#snippet field(
	name: keyof ContactFields,
	label: string,
	autocomplete: FullAutoFill,
	type: 'text' | 'email' = 'text'
)}
	<div class="flex flex-col gap-1.5">
		<label for="contact-{name}" class="text-sm font-medium">{label}</label>
		<input
			id="contact-{name}"
			{name}
			{type}
			{autocomplete}
			class="{controlClass} h-11"
			aria-invalid={errors[name] ? 'true' : undefined}
			aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
			oninput={() => clearError(name)}
		/>
		{@render fieldError(name)}
	</div>
{/snippet}

{#snippet fieldError(name: keyof ContactFields)}
	{#if errors[name]}
		<p id="contact-{name}-error" class="text-sm text-destructive">{errors[name]}</p>
	{/if}
{/snippet}

<form
	novalidate
	aria-busy={pending}
	onsubmit={handleSubmit}
	onfocusin={warmUpRecaptcha}
	class="flex flex-col gap-5"
>
	<div class="grid gap-5 md:grid-cols-2">
		{@render field('name', 'Name', 'name')}
		{@render field('email', 'Email', 'email', 'email')}
	</div>
	<div class="grid gap-5 md:grid-cols-2">
		{@render field('organization', 'Organization', 'organization')}
		{@render field('position', 'Position', 'organization-title')}
	</div>
	<div class="flex flex-col gap-1.5">
		<label for="contact-message" class="text-sm font-medium">Message</label>
		<textarea
			id="contact-message"
			name="message"
			rows="5"
			class="{controlClass} min-h-32 resize-y py-3"
			aria-invalid={errors.message ? 'true' : undefined}
			aria-describedby={errors.message ? 'contact-message-error' : undefined}
			oninput={() => clearError('message')}
		></textarea>
		{@render fieldError('message')}
	</div>

	<div class="flex flex-col gap-3">
		<button
			type="submit"
			disabled={pending}
			class="inline-flex h-12 items-center justify-center self-start rounded-full bg-primary px-6 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
		>
			Send message
		</button>
		<p
			role="status"
			aria-live="polite"
			class="min-h-5 text-sm {status?.tone === 'error' ? 'text-destructive' : 'text-foreground'}"
		>
			{status?.text ?? ''}
		</p>
	</div>

	<p class="text-xs text-pretty text-muted-foreground">
		This site is protected by reCAPTCHA and the Google
		<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" class={linkClass}
			>Privacy Policy</a
		>
		and
		<a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" class={linkClass}
			>Terms of Service</a
		> apply.
	</p>
</form>
