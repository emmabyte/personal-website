import { expect, test } from '@playwright/test';

const card = (page: import('@playwright/test').Page, title: string) =>
	page.locator('#work article', { has: page.getByRole('heading', { name: title, exact: true }) });

test('three featured cards link to their case studies', async ({ page }) => {
	await page.goto('/');
	const links = page.locator('#work article h3 a');
	await expect(links).toHaveCount(3);
	const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
	expect(hrefs).toEqual(['/work/harbor', '/work/emmabyte', '/work/tarot-tutor']);
});

test('card index lines read NN / YEAR', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#work article').first()).toContainText('01 / 2026');
});

test('private projects offer a walkthrough instead of source', async ({ page }) => {
	await page.goto('/');
	const tarot = card(page, 'Tarot Tutor');
	const walkthrough = tarot.getByRole('link', { name: 'Private repo · walkthrough on request' });
	await expect(walkthrough).toHaveAttribute('href', '#contact');
	await expect(tarot.getByRole('link', { name: 'Source code' })).toHaveCount(0);
});

test('harbor is marked proprietary, with no code link or walkthrough', async ({ page }) => {
	await page.goto('/');
	const harbor = card(page, 'Harbor');
	await expect(harbor.getByText('Proprietary', { exact: true })).toBeVisible();
	await expect(harbor.getByRole('link', { name: /Source code|walkthrough/ })).toHaveCount(0);
});

test('an odd last card spans the full row on desktop', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/');
	const [first, last] = await Promise.all([
		card(page, 'Harbor').boundingBox(),
		card(page, 'Tarot Tutor').boundingBox()
	]);
	expect(last!.width).toBeGreaterThan(first!.width * 1.8);
});

test('more projects lists seven rows', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#work [data-more-project]')).toHaveCount(7);
});

test('work section has no images', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#work img')).toHaveCount(0);
});

test('the secondary links stay clickable over the card overlay', async ({ page, context }) => {
	await context.route('https://tarottutor.io/**', (route) => route.fulfill({ body: 'ok' }));
	await page.goto('/');
	const link = card(page, 'Tarot Tutor').getByRole('link', { name: 'Live site' });
	const popup = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
	await link.click();
	const opened = await popup;
	const landed = opened ?? page;
	await landed.waitForURL('https://tarottutor.io/');
	expect(landed.url()).toBe('https://tarottutor.io/');
	expect(page.url()).not.toContain('/work/tarot-tutor');
});
