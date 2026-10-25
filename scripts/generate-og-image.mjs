// Renders static/og.png (1200x630) from an inline HTML string with Playwright's Chromium.
// Fonts load from the installed @fontsource-variable packages via file:// URLs, so no network is needed.
// Usage: node scripts/generate-og-image.mjs
import { chromium } from '@playwright/test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fontUrl = (pkg, file) =>
	pathToFileURL(resolve(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).href;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
	@font-face {
		font-family: 'Geist Variable';
		font-weight: 100 900;
		src: url('${fontUrl('geist', 'geist-latin-wght-normal.woff2')}') format('woff2');
	}
	@font-face {
		font-family: 'Geist Mono Variable';
		font-weight: 100 900;
		src: url('${fontUrl('geist-mono', 'geist-mono-latin-wght-normal.woff2')}') format('woff2');
	}
	* { margin: 0; box-sizing: border-box; }
	body {
		width: 1200px;
		height: 630px;
		background: #fbfbfa;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 96px;
		color: #1c2024;
	}
	.dot { width: 28px; height: 28px; border-radius: 50%; background: #f9586c; margin-bottom: 40px; }
	h1 { font-family: 'Geist Variable', sans-serif; font-weight: 600; font-size: 88px; line-height: 1; letter-spacing: -0.02em; }
	p { font-family: 'Geist Mono Variable', monospace; font-size: 36px; margin-top: 28px; color: #5f666e; }
</style>
</head>
<body>
	<div class="dot"></div>
	<h1>Emma Long</h1>
	<p>Full-Stack Engineer</p>
</body>
</html>`;

// Chromium blocks file:// fonts on about:blank pages, so render from a temporary file.
const tmp = await mkdtemp(resolve(tmpdir(), 'og-'));
const htmlPath = resolve(tmp, 'og.html');
await writeFile(htmlPath, html);

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await page.goto(pathToFileURL(htmlPath).href);
	await page.evaluate(() => document.fonts.ready);
	const fonts = await page.evaluate(() => [
		document.fonts.check("600 88px 'Geist Variable'"),
		document.fonts.check("36px 'Geist Mono Variable'")
	]);
	if (!fonts.every(Boolean)) throw new Error('Geist fonts failed to load');
	const png = await page.screenshot({ type: 'png' });
	const out = resolve(root, 'static/og.png');
	await mkdir(dirname(out), { recursive: true });
	await writeFile(out, png);
	console.log(`Wrote ${out}`);
} finally {
	await browser.close();
	await rm(tmp, { recursive: true, force: true });
}
