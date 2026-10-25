// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRecaptchaToken, loadRecaptcha, resetRecaptchaLoader } from './recaptcha-client';

const SRC = 'https://www.google.com/recaptcha/api.js?render=k';

function scripts() {
	return Array.from(document.querySelectorAll<HTMLScriptElement>('script[src*="recaptcha"]'));
}

function stubGrecaptcha() {
	const execute = vi.fn(async () => 'tok');
	window.grecaptcha = { ready: (cb: () => void) => cb(), execute };
	return execute;
}

beforeEach(() => {
	resetRecaptchaLoader();
	document.head.innerHTML = '';
	delete window.grecaptcha;
});

afterEach(() => {
	resetRecaptchaLoader();
});

describe('recaptcha client', () => {
	it('loadRecaptcha injects one script with the site key even when called twice', async () => {
		const first = loadRecaptcha('k');
		const second = loadRecaptcha('k');
		expect(scripts()).toHaveLength(1);
		expect(scripts()[0].src).toBe(SRC);

		stubGrecaptcha();
		scripts()[0].onload?.(new Event('load'));
		await expect(first).resolves.toBeUndefined();
		await expect(second).resolves.toBeUndefined();
		expect(scripts()).toHaveLength(1);
	});

	it("getRecaptchaToken loads the script when it isn't loaded yet", async () => {
		const pending = getRecaptchaToken('k');
		expect(scripts()).toHaveLength(1);

		const execute = stubGrecaptcha();
		scripts()[0].onload?.(new Event('load'));

		await expect(pending).resolves.toBe('tok');
		expect(execute).toHaveBeenCalledWith('k', { action: 'submit' });
	});

	it('getRecaptchaToken passes a custom action through', async () => {
		const pending = getRecaptchaToken('k', 'contact');
		const execute = stubGrecaptcha();
		scripts()[0].onload?.(new Event('load'));
		await pending;
		expect(execute).toHaveBeenCalledWith('k', { action: 'contact' });
	});

	it('loadRecaptcha rejects when the script fails to load, and a later call retries', async () => {
		const failed = loadRecaptcha('k');
		scripts()[0].onerror?.(new Event('error'));
		await expect(failed).rejects.toThrow();

		const retry = loadRecaptcha('k');
		expect(scripts()).toHaveLength(1); // the failed tag was removed before retrying
		stubGrecaptcha();
		scripts()[0].onload?.(new Event('load'));
		await expect(retry).resolves.toBeUndefined();
	});
});
