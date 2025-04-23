import { z } from 'zod';

export const contactFormSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	organization: z.string().min(2),
	position: z.string().min(2),
	message: z.string().min(10),
	captcha: z.string().min(1)
});

export type ContactFormSchema = typeof contactFormSchema;
