import { expect, test } from '@playwright/test';

test('five rows in spec order with periods', async ({ page }) => {
	await page.goto('/');
	const periods = await page
		.locator('#experience ol > li')
		.evaluateAll((rows) => rows.map((row) => row.querySelector('span')?.textContent?.trim()));
	expect(periods).toEqual(['2025 — Now', '2023 — Now', '2022 — 2025', '2023', '2016 — 2023']);
});

test('résumé link downloads the pdf quietly', async ({ page }) => {
	await page.goto('/');
	const link = page.locator('#experience').getByRole('link', { name: 'Full résumé (PDF) ↓' });
	await expect(link).toHaveAttribute('href', '/documents/resume.pdf');
	await expect(link).toHaveAttribute('download', 'resume-emma-long.pdf');
	await expect(link).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('Q&A is collapsed by default and opens from the keyboard', async ({ page }) => {
	await page.goto('/');
	const row = page.locator('#experience ol > li').filter({ hasText: 'SpaceX' });
	const details = row.locator('details');
	await expect(details).not.toHaveAttribute('open', /.*/);
	await row.locator('summary').focus();
	await page.keyboard.press('Enter');
	await expect(details).toHaveAttribute('open', /.*/);
	await expect(row.getByText('Why was this role so short?')).toBeVisible();
});

test('focused Q&A summary shows the solid primary outline', async ({ page }) => {
	await page.goto('/');
	const summary = page
		.locator('#experience ol > li')
		.filter({ hasText: 'SpaceX' })
		.locator('summary');
	await page.keyboard.press('Tab'); // enter keyboard modality so :focus-visible applies
	await summary.focus();
	await expect(summary).toHaveCSS('outline-style', /^(?!none)/);
	// toHaveCSS retries, so the colour is read after the colour transition settles.
	await expect(summary).toHaveCSS('outline-color', 'rgb(214, 58, 79)');
});

test('Emmabyte row has no Q&A and links to selected work', async ({ page }) => {
	await page.goto('/');
	const first = page.locator('#experience ol > li').first();
	await expect(first.locator('details')).toHaveCount(0);
	await expect(first.getByRole('link', { name: 'See selected work' })).toHaveAttribute(
		'href',
		'/#work'
	);
});

test('company names link out', async ({ page }) => {
	await page.goto('/');
	const link = page.locator('#experience').getByRole('link', { name: 'Haven Ministries' }).first();
	await expect(link).toHaveAttribute('href', 'https://haventoday.org');
	await expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toHaveAttribute('rel', 'noreferrer');
});
