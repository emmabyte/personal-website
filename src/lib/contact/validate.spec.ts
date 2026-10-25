import { describe, expect, it } from 'vitest';
import { validateContact } from './validate';

describe('validateContact', () => {
	it('validateContact returns per-field errors without requiring a recaptcha token', () => {
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
				organization: 'Please enter your organization',
				position: 'Please enter your position',
				message: 'Please write at least 10 characters'
			}
		});
	});

	it('validateContact trims nothing and passes valid data through', () => {
		const input = {
			name: '  Ada  ',
			email: 'ada@example.com',
			organization: 'Analytical Engines',
			position: 'Manager',
			message: 'Would love to talk about a role.'
		};
		expect(validateContact(input)).toEqual({ success: true, data: input });
	});
});
