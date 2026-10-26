import { expect, test } from '@playwright/test';

test('hero h1 contains the name and the screen-reader role', async ({ page }) => {
	await page.goto('/');
	const h1 = page.locator('#top h1');
	await expect(h1).toContainText('Emma Long');
	await expect(h1.locator('.sr-only')).toHaveText('Full-Stack Engineer');
});

test('the role line has no space before the closing dot', async ({ page }) => {
	await page.goto('/');
	const scramble = page.locator('#top h1 [data-scramble]');
	const nextSiblingIsText = await scramble.evaluate(
		(el) => el.nextSibling?.nodeType === Node.TEXT_NODE
	);
	expect(nextSiblingIsText).toBe(false);
	const roleLine = await scramble.evaluate((el) => el.parentElement?.textContent ?? '');
	expect(roleLine).not.toMatch(/\s\./);
});

for (const width of [360, 768]) {
	test(`the page below the role line stays still while it scrambles at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 800 });
		await page.goto('/');
		await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
		const tops = await page.evaluate(
			() =>
				new Promise<number[]>((resolve) => {
					const intro = document.querySelector('#top-title')!.nextElementSibling!;
					const seen = new Set<number>();
					const started = performance.now();
					const timer = setInterval(() => {
						seen.add(Math.round(intro.getBoundingClientRect().top));
						if (performance.now() - started > 6500) {
							clearInterval(timer);
							resolve([...seen]);
						}
					}, 40);
				})
		);
		expect(tops).toHaveLength(1);
	});
}

test('hero buttons point at work and contact', async ({ page }) => {
	await page.goto('/');
	const hero = page.locator('#top');
	await expect(hero.getByRole('link', { name: 'View selected work' })).toHaveAttribute(
		'href',
		'#work'
	);
	await expect(hero.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
		'href',
		'#contact'
	);
	await expect(hero.getByRole('link', { name: /résumé|resume/i })).toHaveCount(0);
	await expect(hero.locator('a[href*="resume"]')).toHaveCount(0);
});

test('hero shows location and the three stats', async ({ page }) => {
	await page.goto('/');
	const hero = page.locator('#top');
	for (const text of ['Los Angeles Metropolitan Area', '2016', '40s → 90s', '10+ → ~0']) {
		await expect(hero).toContainText(text);
	}
});

test('reduced motion shows the first role without scrambling', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	const scramble = page.locator('[data-scramble]');
	await expect(scramble).toHaveText('Full-Stack Engineer');
	// The first scramble would start at the 2600 ms interval, so wait past it.
	await page.waitForTimeout(4000);
	await expect(scramble).toHaveText('Full-Stack Engineer');
});

test('code card is labelled and shows about.ts', async ({ page }) => {
	await page.goto('/');
	const card = page.getByRole('figure', {
		name: 'Code snippet summarizing my engineering focus'
	});
	await expect(card).toBeVisible();
	await expect(card.locator('figcaption')).toHaveText('about.ts');
});
