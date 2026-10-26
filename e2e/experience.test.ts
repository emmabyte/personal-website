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
	const toggle = row.getByRole('button', { name: /Q&A/ });
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(row.getByText('Why was this role so short?')).toBeHidden();
	await toggle.focus();
	await page.keyboard.press('Enter');
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(row.getByText('Why was this role so short?')).toBeVisible();
	const panelId = await toggle.getAttribute('aria-controls');
	expect(panelId).toBeTruthy();
	await expect(page.locator(`#${panelId}`)).toBeVisible();
	await page.keyboard.press('Enter');
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(row.getByText('Why was this role so short?')).toBeHidden();
});

test('Q&A opens with a height animation, and instantly under reduced motion', async ({ page }) => {
	await page.goto('/');
	await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
	const row = page.locator('#experience ol > li').filter({ hasText: 'SpaceX' });
	const toggle = row.getByRole('button', { name: /Q&A/ });
	const panelId = (await toggle.getAttribute('aria-controls'))!;
	const heightAfterClick = () =>
		page.evaluate(
			(id) =>
				new Promise<number>((resolve) =>
					requestAnimationFrame(() =>
						requestAnimationFrame(() =>
							resolve(document.getElementById(id)?.getBoundingClientRect().height ?? -1)
						)
					)
				),
			panelId
		);

	await toggle.click();
	const midHeight = await heightAfterClick();
	await expect(row.getByText('Why was this role so short?')).toBeVisible();
	await page.waitForTimeout(600);
	const fullHeight = await page
		.locator(`#${panelId}`)
		.evaluate((el) => el.getBoundingClientRect().height);
	expect(midHeight).toBeGreaterThanOrEqual(0);
	expect(midHeight).toBeLessThan(fullHeight);

	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.reload();
	await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
	await toggle.click();
	expect(await heightAfterClick()).toBe(fullHeight);
});

test('Emmabyte row has no Q&A and links to selected work', async ({ page }) => {
	await page.goto('/');
	const first = page.locator('#experience ol > li').first();
	await expect(first.getByRole('button', { name: /Q&A/ })).toHaveCount(0);
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
