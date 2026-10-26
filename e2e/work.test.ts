import { expect, test } from '@playwright/test';

const card = (page: import('@playwright/test').Page, title: string) =>
	page.locator('#work article', { has: page.getByRole('heading', { name: title, exact: true }) });

test('four featured cards link to their case studies', async ({ page }) => {
	await page.goto('/');
	const links = page.locator('#work article h3 a');
	await expect(links).toHaveCount(4);
	const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
	expect(hrefs).toEqual(['/work/harbor', '/work/emmabyte', '/work/tarot-tutor', '/work/pulse']);
});

test('card index lines read NN / YEAR', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#work article').first()).toContainText('01 / 2026');
});

test('private projects offer a walkthrough instead of source', async ({ page }) => {
	await page.goto('/');
	const harbor = card(page, 'Harbor');
	const walkthrough = harbor.getByRole('link', { name: 'Private repo · walkthrough on request' });
	await expect(walkthrough).toHaveAttribute('href', '#contact');
	await expect(harbor.getByRole('link', { name: 'Source code' })).toHaveCount(0);
});

test('pulse links its public source', async ({ page }) => {
	await page.goto('/');
	await expect(card(page, 'Pulse').getByRole('link', { name: 'Source code' })).toHaveAttribute(
		'href',
		'https://github.com/emmabyte-engineering/pulse'
	);
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
	await context.route('https://github.com/**', (route) => route.fulfill({ body: 'ok' }));
	await page.goto('/');
	const link = card(page, 'Pulse').getByRole('link', { name: 'Source code' });
	const popup = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
	await link.click();
	const opened = await popup;
	const landed = opened ?? page;
	await landed.waitForURL('https://github.com/emmabyte-engineering/pulse');
	expect(landed.url()).toBe('https://github.com/emmabyte-engineering/pulse');
	expect(page.url()).not.toContain('/work/pulse');
});
