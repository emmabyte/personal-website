import { z } from 'zod';

// Values are trimmed first, so whitespace-only answers count as empty.
// Organization and position are optional: freelance clients often have neither.
export const contactFormSchema = z.object({
	name: z.string().trim().min(2, 'Please enter your name'),
	email: z.string().trim().email('Please enter a valid email'),
	organization: z.string().trim().default(''),
	position: z.string().trim().default(''),
	message: z.string().trim().min(10, 'Please write at least 10 characters'),
	gRecaptchaResponse: z.string().min(1)
});

export type ContactFormSchema = typeof contactFormSchema;
export type ContactFormData = z.infer<typeof contactFormSchema>;
