import { expect, test } from '@playwright/test';

test('home renders a single h1 containing Emma Long', async ({ page }) => {
	await page.goto('/');
	const h1 = page.locator('h1');
	await expect(h1).toHaveCount(1);
	await expect(h1).toContainText('Emma Long');
});
