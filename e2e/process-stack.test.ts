import { expect, test } from '@playwright/test';
import { howIShip } from '../src/lib/data/process';

test('pipeline diagram contains no invented figures', async ({ page }) => {
	await page.goto('/');
	const diagram = page.locator('#process svg[role=img]');
	const label = (await diagram.getAttribute('aria-label')) ?? '';
	expect(label).not.toMatch(/\d/);
	const text = (await diagram.textContent()) ?? '';
	expect(text).not.toMatch(/\d+\s?m?s\b|iad1|sfo1|lhr1|hnd1|gru1|a1f9c3e/);
	for (const stage of ['git push', 'test & build', 'preview', 'production']) {
		expect(text).toContain(stage);
	}
});

test('pipeline caption reads from commit to production', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#process figcaption')).toContainText(
		'// from commit to production, on every push'
	);
});

test('three principles and the AI note render', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#process li')).toHaveCount(3);
	await expect(page.locator('#process p.mt-6')).toHaveText(howIShip.aiNote);
});

test('the home page mentions AI exactly once', async ({ page }) => {
	await page.goto('/');
	const text = await page.locator('main').innerText();
	expect(text.match(/\bAI\b/g)).toHaveLength(1);
});

test('stack shows four labelled columns', async ({ page }) => {
	await page.goto('/');
	for (const area of ['Frontend', 'Backend', 'Data', 'Infra']) {
		const heading = page.getByRole('heading', { name: `// ${area}`, exact: true });
		await expect(heading).toBeVisible();
		await expect(heading.locator('xpath=..').locator('li')).toHaveCount(5);
	}
});
