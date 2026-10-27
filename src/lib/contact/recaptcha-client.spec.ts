// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	RECAPTCHA_TIMEOUT_MS,
	getRecaptchaToken,
	loadRecaptcha,
	resetRecaptchaLoader
} from './recaptcha-client';

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
	vi.useRealTimers();
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

	it('loadRecaptcha rejects when ready never calls back, and a retry reuses the loaded script', async () => {
		vi.useFakeTimers();
		const stalled = loadRecaptcha('k');
		window.grecaptcha = { ready: () => {}, execute: vi.fn(async () => 'tok') };
		scripts()[0].onload?.(new Event('load'));

		const assertion = expect(stalled).rejects.toThrow('Timed out');
		await vi.advanceTimersByTimeAsync(RECAPTCHA_TIMEOUT_MS);
		await assertion;

		// api.js already ran and left window.grecaptcha behind; loading it again
		// on top of that is undefined behaviour, so the retry waits on ready instead.
		stubGrecaptcha();
		const retry = loadRecaptcha('k');
		expect(scripts()).toHaveLength(0);
		await expect(retry).resolves.toBeUndefined();
	});

	it('a retry that reuses the loaded script is still bounded by the timeout', async () => {
		vi.useFakeTimers();
		const stalled = loadRecaptcha('k');
		window.grecaptcha = { ready: () => {}, execute: vi.fn(async () => 'tok') };
		scripts()[0].onload?.(new Event('load'));
		const first = expect(stalled).rejects.toThrow('Timed out');
		await vi.advanceTimersByTimeAsync(RECAPTCHA_TIMEOUT_MS);
		await first;

		const retry = loadRecaptcha('k');
		const second = expect(retry).rejects.toThrow('Timed out');
		await vi.advanceTimersByTimeAsync(RECAPTCHA_TIMEOUT_MS);
		await second;
		expect(scripts()).toHaveLength(0);
	});

	it('loadRecaptcha rejects when the script request stalls without onerror', async () => {
		vi.useFakeTimers();
		const stalled = loadRecaptcha('k');
		const assertion = expect(stalled).rejects.toThrow('Timed out');
		await vi.advanceTimersByTimeAsync(RECAPTCHA_TIMEOUT_MS);
		await assertion;
		expect(scripts()).toHaveLength(0);
	});

	it('getRecaptchaToken rejects when execute never resolves', async () => {
		vi.useFakeTimers();
		const pending = getRecaptchaToken('k');
		window.grecaptcha = { ready: (cb: () => void) => cb(), execute: () => new Promise(() => {}) };
		scripts()[0].onload?.(new Event('load'));

		const assertion = expect(pending).rejects.toThrow('Timed out');
		await vi.advanceTimersByTimeAsync(RECAPTCHA_TIMEOUT_MS);
		await assertion;
	});
});
