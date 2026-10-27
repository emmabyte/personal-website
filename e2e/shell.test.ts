import { expect, test } from '@playwright/test';

test('header shows wordmark and nav', async ({ page }) => {
	await page.goto('/');
	const banner = page.getByRole('banner');
	await expect(banner).toContainText('emma.long');
	const nav = banner.getByRole('navigation', { name: 'Primary' });
	for (const [name, id] of [
		['Work', 'work'],
		['Process', 'process'],
		['Stack', 'stack'],
		['Experience', 'experience'],
		['Contact', 'contact']
	]) {
		await expect(nav.getByRole('link', { name })).toHaveAttribute('href', `/#${id}`);
	}
});

test('contact pill stays visible on a 360px viewport while the other nav links are hidden', async ({
	page
}) => {
	await page.setViewportSize({ width: 360, height: 740 });
	await page.goto('/');
	const nav = page.getByRole('banner').getByRole('navigation', { name: 'Primary' });
	await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
	for (const name of ['Work', 'Process', 'Stack', 'Experience']) {
		await expect(nav.getByRole('link', { name })).toBeHidden();
	}
});

test('home has canonical, og:image and a parseable Person JSON-LD', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://emma-long.vercel.app/'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://emma-long.vercel.app/og.png'
	);
	const json = await page.locator('script[type="application/ld+json"]').textContent();
	expect(JSON.parse(json ?? '')['@type']).toBe('Person');
});

test('footer shows the year and the built-with line', async ({ page }) => {
	await page.goto('/');
	const footer = page.getByRole('contentinfo');
	await expect(footer).toContainText(`© ${new Date().getFullYear()} Emma Long`);
	await expect(footer).toContainText('Built with SvelteKit, Tailwind CSS & deployed on Vercel.');
});
