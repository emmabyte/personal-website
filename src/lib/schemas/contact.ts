import { z } from 'zod';

export const contactFormSchema = z.object({
	name: z.string().min(2, 'Please enter your name'),
	email: z.string().email('Please enter a valid email'),
	organization: z.string().min(2, 'Please enter your organization'),
	position: z.string().min(2, 'Please enter your position'),
	message: z.string().min(10, 'Please write at least 10 characters'),
	gRecaptchaResponse: z.string().min(1)
});

export type ContactFormSchema = typeof contactFormSchema;
export type ContactFormData = z.infer<typeof contactFormSchema>;
