import { RECAPTCHA_SECRET_KEY } from '$env/static/private';

interface RecaptchaBaseResponse {
	success: boolean;
}

interface RecaptchaErrorResponse extends RecaptchaBaseResponse {
	success: false;
	'error-codes': string[];
}

interface RecaptchaSuccessResponse extends RecaptchaBaseResponse {
	success: true;
	challenge_ts: string;
	hostname: string;
	score: number;
	action: string;
}

type RecaptchaResponse = RecaptchaErrorResponse | RecaptchaSuccessResponse;

export class GoogleRecaptchaServerClient {
	private secretKey: string;
	private baseUrl: string = 'https://www.google.com/recaptcha/api/siteverify';

	constructor(secretKey: string) {
		this.secretKey = secretKey;
	}

	async verifyRecaptcha(recaptchaResponse: string, clientIp?: string): Promise<RecaptchaResponse> {
		const fallbackResponse: RecaptchaErrorResponse = {
			success: false,
			'error-codes': ['fallback']
		};

		try {
			const url = new URL(this.baseUrl);
			url.searchParams.append('secret', this.secretKey);
			url.searchParams.append('response', recaptchaResponse);
			if (clientIp) {
				url.searchParams.append('remoteip', clientIp);
			}
			const response = await fetch(url.toString(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				fallbackResponse['error-codes'].push('fetch_request_failed');
				return fallbackResponse;
			}

			const data = (await response.json()) as RecaptchaBaseResponse;

			if (data.success) {
				return data as RecaptchaSuccessResponse;
			} else {
				return data as RecaptchaErrorResponse;
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error: unknown) {
			fallbackResponse['error-codes'].push('internal_error');
			return fallbackResponse;
		}
	}
}

export const googleRecaptchaClient = new GoogleRecaptchaServerClient(RECAPTCHA_SECRET_KEY);
