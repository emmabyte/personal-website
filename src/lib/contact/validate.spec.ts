import { describe, expect, it } from 'vitest';
import { validateContact } from './validate';

describe('validateContact', () => {
	it('returns per-field errors without requiring a recaptcha token', () => {
		const result = validateContact({
			name: '',
			email: 'nope',
			organization: '',
			position: '',
			message: 'short'
		});
		expect(result).toEqual({
			success: false,
			errors: {
				name: 'Please enter your name',
				email: 'Please enter a valid email',
				message: 'Please write at least 10 characters'
			}
		});
	});

	it('passes valid data through trimmed', () => {
		expect(
			validateContact({
				name: '  Ada  ',
				email: 'ada@example.com',
				organization: '',
				position: '',
				message: 'Would love to talk about a role.'
			})
		).toEqual({
			success: true,
			data: {
				name: 'Ada',
				email: 'ada@example.com',
				organization: '',
				position: '',
				message: 'Would love to talk about a role.'
			}
		});
	});
});
