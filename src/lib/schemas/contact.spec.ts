import { describe, expect, it } from 'vitest';
import { contactFormSchema } from './contact';

const messagesFor = (input: Record<string, string>) => {
	const result = contactFormSchema.safeParse({ gRecaptchaResponse: 'tok', ...input });
	if (result.success) return {};
	return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
};

describe('contactFormSchema', () => {
	it('rejects empty required fields with friendly messages, and nothing else', () => {
		expect(
			messagesFor({ name: '', email: '', organization: '', position: '', message: '' })
		).toEqual({
			name: 'Please enter your name',
			email: 'Please enter a valid email',
			message: 'Please write at least 10 characters'
		});
	});

	it('accepts a submission without organization or position', () => {
		const result = contactFormSchema.safeParse({
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			organization: '',
			position: '',
			message: 'Would love to talk about a project.',
			gRecaptchaResponse: 'tok'
		});
		expect(result.success).toBe(true);
	});

	it('treats whitespace-only values as empty', () => {
		expect(
			messagesFor({
				name: '   ',
				email: 'ada@example.com',
				organization: '',
				position: '',
				message: '            '
			})
		).toEqual({
			name: 'Please enter your name',
			message: 'Please write at least 10 characters'
		});
	});

	it('trims surrounding whitespace from every field', () => {
		const result = contactFormSchema.parse({
			name: '  Ada Lovelace ',
			email: ' ada@example.com ',
			organization: ' Analytical Engines ',
			position: '  ',
			message: '  Would love to talk about a role.  ',
			gRecaptchaResponse: 'tok'
		});
		expect(result).toMatchObject({
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			organization: 'Analytical Engines',
			position: '',
			message: 'Would love to talk about a role.'
		});
	});
});
