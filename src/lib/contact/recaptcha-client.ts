export const RECAPTCHA_TIMEOUT_MS = 12_000;

let loader: Promise<void> | undefined;
// Set once api.js has executed. After that, window.grecaptcha belongs to that copy of
// the script, and loading it a second time on top is undefined behaviour.
let scriptRan = false;

/**
 * Injects the reCAPTCHA v3 script once and resolves when `grecaptcha` is ready.
 * The promise is memoized; if the script fails to load, or neither load nor
 * `ready` completes within RECAPTCHA_TIMEOUT_MS (a blocked second-stage bundle
 * never fires onerror), the memo is cleared so a later call can retry. A retry
 * re-injects the script only if it never ran; otherwise it waits on the existing
 * `grecaptcha.ready` again. The script is always injected on the first call,
 * even if `window.grecaptcha` already exists.
 */
export function loadRecaptcha(siteKey: string): Promise<void> {
	if (loader) return loader;

	const attempt = new Promise<void>((resolve, reject) => {
		// Only attached when the script has never run; remove() is a no-op otherwise.
		const script = document.createElement('script');

		const fail = (message: string) => {
			clearTimeout(timer);
			script.remove();
			reject(new Error(message));
		};

		const waitForReady = () => {
			const grecaptcha = window.grecaptcha;
			if (!grecaptcha) {
				fail('reCAPTCHA loaded but grecaptcha is unavailable');
				return;
			}
			grecaptcha.ready(() => {
				clearTimeout(timer);
				resolve();
			});
		};

		const timer = setTimeout(() => fail('Timed out loading reCAPTCHA'), RECAPTCHA_TIMEOUT_MS);

		if (scriptRan && window.grecaptcha) {
			waitForReady();
			return;
		}

		script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
		script.async = true;
		script.onload = () => {
			scriptRan = true;
			waitForReady();
		};
		script.onerror = () => fail('Failed to load reCAPTCHA');
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

	// execute() makes its own request to Google, so bound it like the load.
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(
			() => reject(new Error('Timed out getting a reCAPTCHA token')),
			RECAPTCHA_TIMEOUT_MS
		);
	});
	try {
		return await Promise.race([grecaptcha.execute(siteKey, { action }), timeout]);
	} finally {
		clearTimeout(timer);
	}
}

/** Test-only: forget the memoized loader and whether the script has run. */
export function resetRecaptchaLoader(): void {
	loader = undefined;
	scriptRan = false;
}
