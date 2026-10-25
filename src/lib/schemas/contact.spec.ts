import { describe, expect, it } from 'vitest';
import { contactFormSchema } from './contact';

describe('contactFormSchema', () => {
	it('schema rejects empty fields with friendly messages', () => {
		const result = contactFormSchema.safeParse({
			name: '',
			email: '',
			organization: '',
			position: '',
			message: '',
			gRecaptchaResponse: 'tok'
		});
		expect(result.success).toBe(false);
		if (result.success) return;
		const messages = Object.fromEntries(
			result.error.issues.map((issue) => [issue.path[0], issue.message])
		);
		expect(messages).toEqual({
			name: 'Please enter your name',
			email: 'Please enter a valid email',
			organization: 'Please enter your organization',
			position: 'Please enter your position',
			message: 'Please write at least 10 characters'
		});
	});

	it('schema accepts a complete submission', () => {
		const result = contactFormSchema.safeParse({
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			organization: 'Analytical Engines',
			position: 'Engineering Manager',
			message: 'Would love to talk about a role.',
			gRecaptchaResponse: 'tok'
		});
		expect(result.success).toBe(true);
	});
});
