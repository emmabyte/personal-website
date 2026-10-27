import { expect, test } from '@playwright/test';
import { howIShip } from '../src/lib/data/process';

test('pipeline diagram contains no invented figures', async ({ page }) => {
	await page.goto('/');
	// One wide drawing for desktop, one stacked drawing for smaller screens.
	const diagrams = page.locator('#process svg[role=img]');
	await expect(diagrams).toHaveCount(2);
	for (const diagram of await diagrams.all()) {
		const label = (await diagram.getAttribute('aria-label')) ?? '';
		expect(label).not.toMatch(/\d/);
		const text = (await diagram.textContent()) ?? '';
		expect(text).not.toMatch(/\d+\s?m?s\b|iad1|sfo1|lhr1|hnd1|gru1|a1f9c3e/);
		for (const stage of [
			'git push',
			'lint & types',
			'unit tests',
			'AI review',
			'security scan',
			'build & e2e',
			'preview',
			'smoke tests',
			'migrate db',
			'production',
			'smoke · rollback'
		]) {
			expect(text).toContain(stage);
		}
	}
});

for (const [width, visible] of [
	[375, 'stacked'],
	[1280, 'wide']
] as const) {
	test(`pipeline shows the ${visible} drawing at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator(`#process [data-pipeline="${visible}"]`)).toBeVisible();
		const other = visible === 'wide' ? 'stacked' : 'wide';
		await expect(page.locator(`#process [data-pipeline="${other}"]`)).toBeHidden();
	});
}

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

test('outside the pipeline diagram, the home page mentions AI exactly once', async ({ page }) => {
	await page.goto('/');
	const text = await page.locator('main').evaluate((main) => {
		const copy = main.cloneNode(true) as HTMLElement;
		copy.querySelector('#process figure')?.remove();
		return copy.textContent ?? '';
	});
	expect(text.match(/\bAI\b/g)).toHaveLength(1);
});

test('stack shows four labelled columns', async ({ page }) => {
	await page.goto('/');
	for (const [area, count] of [
		['Frontend', 5],
		['Backend', 3],
		['Data', 5],
		['Infra', 6]
	] as const) {
		const heading = page.getByRole('heading', { name: `// ${area}`, exact: true });
		await expect(heading).toBeVisible();
		await expect(heading.locator('xpath=..').locator('li')).toHaveCount(count);
	}
});

test('the default stack is marked and the extras are listed', async ({ page }) => {
	await page.goto('/');
	const defaults = page.locator('#stack li[data-default]');
	await expect(defaults).toHaveText(
		['TypeScript', 'SvelteKit', 'Tailwind CSS', 'Supabase', 'Vercel'].map(
			(tool) => `${tool} (default stack)`
		)
	);
	await expect(page.locator('#stack')).toContainText('Also shipped with: React, Next.js');
});

test('selected diagram text turns white on the red highlight', async ({ page }) => {
	await page.goto('/');
	// SVG text paints with fill, so it must match the white text color selections use elsewhere.
	const { fill, color } = await page
		.locator('#process svg text')
		.first()
		.evaluate((el) => {
			const selection = getComputedStyle(el, '::selection');
			return { fill: selection.fill, color: selection.color };
		});
	expect(fill).toBe(color);
	expect(fill).toBe('oklch(1 0 0)');
});

// A filter sized relative to its shape renders nothing on a perfectly straight line,
// because the line's bounding box has zero height or width.
test('every pipeline beam can paint, straight wires included', async ({ page }) => {
	for (const width of [375, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		const unpaintable = await page
			.locator('#process svg')
			.filter({ visible: true })
			.locator('path.beam')
			.evaluateAll((beams) =>
				beams
					.filter((beam) => {
						const box = (beam as SVGGraphicsElement).getBBox();
						if (box.width > 0 && box.height > 0) return false;
						const id = beam.getAttribute('filter')?.match(/url\(#(.+)\)/)?.[1];
						const filter = id ? (document.getElementById(id) as SVGFilterElement | null) : null;
						return filter?.filterUnits.baseVal !== SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;
					})
					.map((beam) => beam.getAttribute('d'))
			);
		expect(unpaintable, `at ${width}px`).toEqual([]);
	}
});
