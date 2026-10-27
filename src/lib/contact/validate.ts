import { contactFormSchema, type ContactFormData } from '$lib/schemas/contact';

export type ContactFields = Omit<ContactFormData, 'gRecaptchaResponse'>;

export type ContactValidation =
	| { success: true; data: ContactFields }
	| { success: false; errors: Partial<Record<keyof ContactFields, string>> };

const clientSchema = contactFormSchema.omit({ gRecaptchaResponse: true });

/** Validates the visible fields only; the reCAPTCHA token is added after this passes. */
export function validateContact(input: Record<string, unknown>): ContactValidation {
	const result = clientSchema.safeParse(input);
	if (result.success) return { success: true, data: result.data };

	const errors: Partial<Record<keyof ContactFields, string>> = {};
	for (const issue of result.error.issues) {
		const field = issue.path[0] as keyof ContactFields;
		errors[field] ??= issue.message;
	}
	return { success: false, errors };
}
