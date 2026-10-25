import { expect, test } from '@playwright/test';

const WIDTH = 360;
const PAGES = ['/', '/work/harbor', '/work/emmabyte', '/work/tarot-tutor', '/work/pulse'];

test.use({ viewport: { width: WIDTH, height: 800 } });

for (const path of PAGES) {
	test(`no horizontal overflow at ${WIDTH}px on ${path}`, async ({ page }) => {
		await page.goto(path);
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		expect(scrollWidth).toBeLessThanOrEqual(WIDTH);
	});
}

test(`hero content stays inside ${WIDTH}px`, async ({ page }) => {
	// #top is overflow-hidden, so document scrollWidth cannot see overflow inside it.
	// The code card scrolls inside its own <pre>, so elements in a scroll container don't count.
	await page.goto('/');
	const overflowing = await page.evaluate((limit) => {
		const hero = document.querySelector('#top');
		if (!hero) return ['#top missing'];
		const inScroller = (el: Element) => {
			for (let node = el.parentElement; node && node !== hero; node = node.parentElement) {
				if (['auto', 'scroll'].includes(getComputedStyle(node).overflowX)) return true;
			}
			return false;
		};
		return [...hero.querySelectorAll('*')]
			.filter((el) => el.getBoundingClientRect().right > limit + 0.5 && !inScroller(el))
			.map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
	}, WIDTH);
	expect(overflowing).toEqual([]);
});
