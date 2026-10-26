import { expect, test, type Page } from '@playwright/test';

const WIDTH = 360;
// SvelteKit renders #svelte-announcer once the app has hydrated.
async function openHydrated(page: Page, path: string) {
	await page.goto(path);
	await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
}

const PAGES = ['/', '/work/harbor', '/work/emmabyte', '/work/tarot-tutor', '/work/pulse'];

test.use({ viewport: { width: WIDTH, height: 800 } });

for (const path of PAGES) {
	test(`no horizontal overflow at ${WIDTH}px on ${path}`, async ({ page }) => {
		await openHydrated(page, path);
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		expect(scrollWidth).toBeLessThanOrEqual(WIDTH);
	});
}

test(`hero content stays inside ${WIDTH}px`, async ({ page }) => {
	// #top is overflow-hidden, so document scrollWidth cannot see overflow inside it.
	await openHydrated(page, '/');
	const overflowing = await page.evaluate((limit) => {
		const hero = document.querySelector('#top');
		if (!hero) return ['#top missing'];
		return [...hero.querySelectorAll('*')]
			.filter((el) => el.getBoundingClientRect().right > limit + 0.5)
			.map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
	}, WIDTH);
	expect(overflowing).toEqual([]);
});

// Phones never get a sideways-scrolling box: diagrams stack and code wraps instead.
for (const width of [320, 375, 414]) {
	for (const path of PAGES) {
		test(`no sideways scrollers at ${width}px on ${path}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await openHydrated(page, path);
			const scrollers = await page.evaluate(() =>
				[...document.querySelectorAll('body *')]
					.filter((el) => {
						const { overflowX, display } = getComputedStyle(el);
						return (
							display !== 'none' &&
							['auto', 'scroll'].includes(overflowX) &&
							el.scrollWidth > el.clientWidth + 1
						);
					})
					.map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`)
			);
			expect(scrollers).toEqual([]);
		});
	}
}
