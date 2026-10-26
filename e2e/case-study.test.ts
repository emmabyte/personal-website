import { expect, test } from '@playwright/test';
import { getCaseStudy } from '../src/lib/data/case-studies';

const slugs = ['harbor', 'emmabyte', 'tarot-tutor'];

test('each featured slug prerenders a page with the project title as h1', async ({ page }) => {
	for (const slug of slugs) {
		const entry = getCaseStudy(slug);
		if (!entry) throw new Error(`no case study for ${slug}`);
		await page.goto(`/work/${slug}`);
		const h1 = page.locator('h1');
		await expect(h1).toHaveCount(1);
		await expect(h1).toHaveText(entry.project.title);
	}
});

test('case study has back link, section labels, and contact CTA', async ({ page }) => {
	await page.goto('/work/tarot-tutor');
	await expect(page.getByRole('link', { name: '← All work' })).toHaveAttribute('href', '/#work');
	for (const name of [
		'Problem & constraints',
		'My role',
		'Architecture',
		'Key decisions',
		'Testing & verification',
		'Outcome'
	]) {
		await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
	}
	await expect(page.locator('main a[href="/#contact"]').first()).toBeVisible();
});

test('only harbor shows a Compliance section', async ({ page }) => {
	await page.goto('/work/harbor');
	await expect(page.getByRole('heading', { name: 'Compliance', exact: true })).toBeVisible();
	await page.goto('/work/tarot-tutor');
	await expect(page.getByRole('heading', { name: 'Compliance', exact: true })).toHaveCount(0);
});

test('canonical is the case study url', async ({ page }) => {
	await page.goto('/work/tarot-tutor');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://emma-long.vercel.app/work/tarot-tutor'
	);
});

test('harbor page has no images', async ({ page }) => {
	await page.goto('/work/harbor');
	await expect(page.locator('img')).toHaveCount(0);
});

test('unknown slug is a 404', async ({ page }) => {
	const response = await page.goto('/work/nope');
	expect(response?.status()).toBe(404);
	await expect(page.getByText('404', { exact: true })).toBeVisible();
	await expect(page).toHaveTitle('Page not found · Emma Long');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});

test('header links on a case study go to home sections', async ({ page }) => {
	await page.goto('/work/tarot-tutor');
	await page
		.getByRole('banner')
		.getByRole('navigation', { name: 'Primary' })
		.getByRole('link', { name: 'Experience' })
		.click();
	await expect(page).toHaveURL(/\/#experience$/);
	await expect(page.locator('#experience')).toBeInViewport();
});

test('architecture diagram exposes its description', async ({ page }) => {
	const entry = getCaseStudy('tarot-tutor');
	if (!entry) throw new Error('no case study for tarot-tutor');
	await page.goto('/work/tarot-tutor');
	await expect(page.locator('figure svg[role=img]')).toHaveAttribute(
		'aria-label',
		entry.study.architecture.description
	);
});
