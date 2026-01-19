import { MAILERSEND_API_KEY } from '$env/static/private';
import { MailerSend } from 'mailersend';

export const mailersend = new MailerSend({
	apiKey: MAILERSEND_API_KEY
});

export const platformNotificationEmail = { email: 'emmalong.dev@gmail.com', name: 'Emma Long' };
export const emailDomain = 'emmalong.dev';

export const templates = {
	contactForm: { id: '351ndgwmd05lzqx8' }
};
