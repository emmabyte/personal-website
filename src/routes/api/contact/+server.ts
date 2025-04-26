import { contactFormSchema } from '$lib/schemas/contact';
import type { ContactPostResponse } from '$lib/types/api/contact';
import { googleRecaptchaClient } from '$lib/recaptcha';
import type { RequestHandler } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { sendEmail } from './send-email';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.formData();
		const form = await superValidate(data, zod(contactFormSchema));

		if (!form.valid) {
			const errorResponse: ContactPostResponse = {
				success: false,
				message: 'Invalid form data'
			};
			return new Response(JSON.stringify(errorResponse), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const response = await googleRecaptchaClient.verifyRecaptcha(
			form.data.gRecaptchaResponse,
			request.headers.get('x-forwarded-for') ?? undefined
		);

		if (response.success && response.score > 0.5) {
			const result = await sendEmail(form);
			if (!result) {
				const errorResponse: ContactPostResponse = {
					success: false,
					message: 'Failed to send email'
				};
				return new Response(JSON.stringify(errorResponse), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}

			const successResponse: ContactPostResponse = {
				success: true,
				message: 'Message sent successfully'
			};
			return new Response(JSON.stringify(successResponse), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			const errorResponse: ContactPostResponse = {
				success: false,
				message: 'Recaptcha verification failed'
			};
			return new Response(JSON.stringify(errorResponse), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		console.error('Error handling POST request:', error);
		const errorResponse: ContactPostResponse = {
			success: false,
			message: 'An error occurred'
		};

		return new Response(JSON.stringify(errorResponse), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
