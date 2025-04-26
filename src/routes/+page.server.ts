import { contactFormSchema } from '$lib/schemas/contact';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(contactFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(contactFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.log('Form data:', form);

		return {
			form
		};
	}
};
