let loader: Promise<void> | undefined;

/**
 * Injects the reCAPTCHA v3 script once and resolves when `grecaptcha` is ready.
 * The promise is memoized; if the script fails to load it is cleared so a later
 * call can retry. The script is always injected on the first call, even if
 * `window.grecaptcha` already exists.
 */
export function loadRecaptcha(siteKey: string): Promise<void> {
	if (loader) return loader;

	const attempt = new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
		script.async = true;
		script.onload = () => {
			const grecaptcha = window.grecaptcha;
			if (!grecaptcha) {
				script.remove();
				reject(new Error('reCAPTCHA loaded but grecaptcha is unavailable'));
				return;
			}
			grecaptcha.ready(() => resolve());
		};
		script.onerror = () => {
			script.remove();
			reject(new Error('Failed to load reCAPTCHA'));
		};
		document.head.appendChild(script);
	});

	loader = attempt;
	attempt.catch(() => {
		if (loader === attempt) loader = undefined;
	});
	return attempt;
}

export async function getRecaptchaToken(siteKey: string, action = 'submit'): Promise<string> {
	await loadRecaptcha(siteKey);
	const grecaptcha = window.grecaptcha;
	if (!grecaptcha) throw new Error('reCAPTCHA is unavailable');
	return grecaptcha.execute(siteKey, { action });
}

/** Test-only: forget the memoized loader. */
export function resetRecaptchaLoader(): void {
	loader = undefined;
}
