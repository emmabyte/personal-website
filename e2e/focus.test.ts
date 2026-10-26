import { expect, test, type Page } from '@playwright/test';

const PRIMARY = 'rgb(214, 58, 79)';
const MAX_STOPS = 150;

test.beforeEach(async ({ page }) => {
	// Never reach Google: the form warms reCAPTCHA up when focus enters it.
	await page.route('**/recaptcha/api.js*', (route) =>
		route.fulfill({ contentType: 'text/javascript', body: '' })
	);
});

type Outline = { style: string; width: number; color: string };

// The focus ring lives on the element itself, or on its ::after for card title links.
async function focusRing(page: Page): Promise<{ label: string; own: Outline; after: Outline }> {
	return page.evaluate(() => {
		const el = document.activeElement as HTMLElement;
		const read = (pseudo?: string): Outline => {
			const style = getComputedStyle(el, pseudo);
			return {
				style: style.outlineStyle,
				width: parseFloat(style.outlineWidth),
				color: style.outlineColor
			};
		};
		const text = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40);
		return { label: `<${el.tagName.toLowerCase()}> ${text}`, own: read(), after: read('::after') };
	});
}

const isPrimaryRing = (outline: Outline) =>
	outline.style === 'solid' && outline.width >= 2 && outline.color === PRIMARY;

// Tabs from the top of the page until focus leaves the document or cycles back.
async function tabThroughPage(page: Page, path: string) {
	await page.goto(path);
	await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
	const visited: string[] = [];
	const seen = new Set<string>();

	for (let stop = 0; stop < MAX_STOPS; stop++) {
		await page.keyboard.press('Tab');
		const id = await page.evaluate(() => {
			const el = document.activeElement;
			if (!el || el === document.body || el === document.documentElement) return null;
			const stopId =
				el.getAttribute('data-focus-stop') ??
				`stop-${document.querySelectorAll('[data-focus-stop]').length}`;
			el.setAttribute('data-focus-stop', stopId);
			return stopId;
		});
		if (id === null || seen.has(id)) break;
		seen.add(id);

		let ring = await focusRing(page);
		// Outline colours transition, so poll until the ring has settled.
		await expect
			.poll(
				async () => {
					ring = await focusRing(page);
					return isPrimaryRing(ring.own) || isPrimaryRing(ring.after);
				},
				{ message: `focus ring on ${ring.label}` }
			)
			.toBe(true);
		visited.push(ring.label);
	}
	return visited;
}

// Landmarks that prove the walk reached each kind of focusable, so it cannot pass vacuously.
const LANDMARKS = {
	'/': ['<a> Contact', '<a> Harbor', '<summary> Q&A', '<input>', '<button> Send message'],
	'/work/pulse': ['<a> Contact', '<a> ← All work', '<button> Copy email', '<a> Or send a message']
};

for (const [path, landmarks] of Object.entries(LANDMARKS)) {
	test(`every focusable on ${path} shows a solid 2px primary outline`, async ({ page }) => {
		const visited = await tabThroughPage(page, path);
		expect(visited.length).toBeLessThan(MAX_STOPS);
		for (const landmark of landmarks) {
			expect(visited.some((label) => label.startsWith(landmark))).toBe(true);
		}
	});
}
