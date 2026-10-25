import { expect, test } from '@playwright/test';

test('hero h1 contains the name and the screen-reader role', async ({ page }) => {
	await page.goto('/');
	const h1 = page.locator('#top h1');
	await expect(h1).toContainText('Emma Long');
	await expect(h1.locator('.sr-only')).toHaveText('Full-Stack Engineer');
});

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
