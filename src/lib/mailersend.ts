import { MAILERSEND_API_KEY } from '$env/static/private';
import { MailerSend } from 'mailersend';

export const mailersend = new MailerSend({
	apiKey: MAILERSEND_API_KEY
});

export const platformNotificationEmail = { email: 'shawnlong636@gmail.com', name: 'Shawn Long' };
export const emailDomain = 'test-51ndgwv7epxlzqx8.mlsender.net';

export const templates = {
	contactForm: { id: '0p7kx4x9qd749yjr' }
};
