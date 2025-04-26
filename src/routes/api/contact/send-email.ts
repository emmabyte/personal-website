import type { SuperValidated } from 'sveltekit-superforms';
import { type ContactFormData } from '$lib/schemas/contact';
import { mailersend, platformNotificationEmail, emailDomain, templates } from '$lib/mailersend';
import { EmailParams, Recipient, Sender } from 'mailersend';

export const sendEmail = async (contactForm: SuperValidated<ContactFormData>): Promise<boolean> => {
	try {
		const recipients = [
			new Recipient(platformNotificationEmail.email, platformNotificationEmail.name)
		];

		const personalization = [
			{
				email: platformNotificationEmail.email,
				data: {
					user: {
						name: contactForm.data.name,
						email: contactForm.data.email,
						position: contactForm.data.position,
						organization: contactForm.data.organization
					},
					message: {
						date: new Date().toLocaleString('en-US', {
							timeZone: 'America/Los_Angeles',
							weekday: 'long',
							month: 'long',
							day: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: true,
							timeZoneName: 'short'
						}),
						text: contactForm.data.message
					}
				}
			}
		];

		const emailParams = new EmailParams()
			.setFrom(new Sender(`notifications@${emailDomain}`, 'MailerSend'))
			.setTo(recipients)
			.setSubject('New contact form submission')
			.setTemplateId(templates.contactForm.id)
			.setPersonalization(personalization);

		const response = await mailersend.email.send(emailParams);

		if (response.statusCode !== 202) {
			console.error('Error sending email:', response);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
};
