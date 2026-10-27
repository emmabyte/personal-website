import { expect, test } from '@playwright/test';
import ts from 'typescript';

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

for (const width of [320, 360, 768]) {
	test(`the page below the role line stays still while it scrambles at ${width}px`, async ({
		page
	}) => {
		// Drive the scramble with Playwright's clock instead of waiting in real time.
		await page.clock.install();
		await page.setViewportSize({ width, height: 800 });
		await page.goto('/');
		await page.locator('#svelte-announcer').waitFor({ state: 'attached' });
		const intro = page.locator('#top-title + p');
		const tops = new Set<number>();
		for (let elapsed = 0; elapsed < 6500; elapsed += 50) {
			await page.clock.runFor(50);
			tops.add(Math.round((await intro.boundingBox())!.y));
		}
		expect([...tops]).toHaveLength(1);
	});
}

test('the h1 carries no hidden copies of the other roles', async ({ page }) => {
	const html = await (await page.request.get('/')).text();
	// Text content only: tags and attributes are stripped, as a crawler reads the heading.
	const h1 = html.slice(html.indexOf('<h1'), html.indexOf('</h1>')).replace(/<[^>]*>/g, '');
	for (const role of ['Systems Architect', 'DevOps Tinkerer', 'Interface Builder']) {
		expect(h1).not.toContain(role);
	}
});

test('the scramble animation is clipped to the box reserved for it', async ({ page }) => {
	await page.goto('/');
	const overlay = page.locator('#top h1 [data-scramble]').locator('..');
	await expect(overlay).toHaveCSS('overflow', 'hidden');
	const box = await overlay.boundingBox();
	const reserved = await overlay.locator('..').boundingBox();
	expect(box).toEqual(reserved);
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
	for (const text of ['Los Angeles Metropolitan Area', '2016', '2–4 → 0', '1,000+']) {
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

test('the code card is valid TypeScript, with one quote style', async ({ page }) => {
	await page.goto('/');
	const card = page.getByRole('figure', { name: 'Code snippet summarizing my engineering focus' });
	// Each row is a line number then the code; indentation is padding, so join the code with newlines.
	const source = (
		await card
			.locator('code > div')
			.evaluateAll((rows) => rows.map((row) => row.lastElementChild?.textContent ?? ''))
	).join('\n');
	const { diagnostics } = ts.transpileModule(source, { reportDiagnostics: true });
	expect(diagnostics?.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))).toEqual([]);
	expect(source).toContain("'dont be evil', // rip");
	expect(source).not.toContain('"');
	// The comment is lighter than the rest of the card but still readable.
	const comment = card.getByText('// rip');
	await expect(comment).toHaveCSS('font-style', 'italic');
});
