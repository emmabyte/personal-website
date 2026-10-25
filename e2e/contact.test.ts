import { expect, test, type Page } from '@playwright/test';

const FIELDS = ['name', 'email', 'organization', 'position', 'message'] as const;

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.beforeEach(async ({ page }) => {
	// Never reach Google: the script request is stubbed and grecaptcha is a stub.
	await page.addInitScript(() => {
		(window as unknown as Record<string, unknown>).grecaptcha = {
			ready: (cb: () => void) => cb(),
			execute: async () => 'test-token'
		};
	});
	await page.route('**/recaptcha/api.js*', (route) =>
		route.fulfill({ contentType: 'text/javascript', body: '' })
	);
});

async function fillForm(page: Page) {
	const form = page.locator('#contact form');
	await form.getByLabel('Name', { exact: true }).fill('Ada Lovelace');
	await form.getByLabel('Email', { exact: true }).fill('ada@example.com');
	await form.getByLabel('Organization', { exact: true }).fill('Analytical Engines');
	await form.getByLabel('Position', { exact: true }).fill('Engineering Manager');
	await form.getByLabel('Message', { exact: true }).fill('Would love to talk about a role.');
}

const sendButton = (page: Page) => page.getByRole('button', { name: 'Send message' });

test('empty submit shows field errors and sends nothing', async ({ page }) => {
	const posts: string[] = [];
	page.on('request', (request) => {
		if (request.url().includes('/api/contact')) posts.push(request.url());
	});
	await page.goto('/');
	await sendButton(page).click();

	const errors = page.locator('#contact form p[id$="-error"]');
	await expect(errors).toHaveCount(5);
	for (const field of FIELDS) {
		const input = page.locator(`#contact form [name="${field}"]`);
		await expect(input).toHaveAttribute('aria-invalid', 'true');
		const describedBy = await input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		await expect(page.locator(`#${describedBy}`)).toBeVisible();
		await expect(page.locator(`#${describedBy}`)).not.toBeEmpty();
	}
	expect(posts).toHaveLength(0);
});

test('editing a field clears its error', async ({ page }) => {
	await page.goto('/');
	await sendButton(page).click();
	const name = page.locator('#contact form [name="name"]');
	await expect(name).toHaveAttribute('aria-invalid', 'true');
	await name.fill('Ada');
	await expect(name).not.toHaveAttribute('aria-invalid', 'true');
	await expect(name).not.toHaveAttribute('aria-describedby', /.*/);
	await expect(page.locator('#contact-name-error')).toHaveCount(0);
	await expect(page.locator('#contact form p[id$="-error"]')).toHaveCount(4);
});

test('successful submit posts the token and clears the form', async ({ page }) => {
	let postData = '';
	await page.route('**/api/contact', async (route) => {
		postData = route.request().postData() ?? '';
		await route.fulfill({
			status: 200,
			body: JSON.stringify({ success: true, message: 'Message sent successfully' })
		});
	});
	await page.goto('/');
	await fillForm(page);
	await sendButton(page).click();

	await expect(page.locator('#contact').getByRole('status')).toHaveText(
		'Thanks — your message is on its way.'
	);
	expect(postData).toContain('name="gRecaptchaResponse"');
	expect(postData).toContain('test-token');
	for (const field of FIELDS) {
		await expect(page.locator(`#contact form [name="${field}"]`)).toHaveValue('');
	}
});

test('server error keeps the typed values and shows the message', async ({ page }) => {
	await page.route('**/api/contact', (route) =>
		route.fulfill({
			status: 400,
			body: JSON.stringify({ success: false, message: 'Recaptcha verification failed' })
		})
	);
	await page.goto('/');
	await fillForm(page);
	await sendButton(page).click();

	await expect(page.locator('#contact').getByRole('status')).toContainText(
		'Recaptcha verification failed'
	);
	await expect(page.locator('#contact form [name="name"]')).toHaveValue('Ada Lovelace');
	await expect(sendButton(page)).toBeEnabled();
});

test('network failure keeps the typed values and points to email', async ({ page }) => {
	await page.route('**/api/contact', (route) => route.abort());
	await page.goto('/');
	await fillForm(page);
	await sendButton(page).click();

	await expect(page.locator('#contact').getByRole('status')).toContainText(
		'Something went wrong sending your message. Please email me instead.'
	);
	await expect(page.locator('#contact form [name="message"]')).toHaveValue(
		'Would love to talk about a role.'
	);
});

test('double submit sends one request', async ({ page }) => {
	let count = 0;
	await page.route('**/api/contact', async (route) => {
		count += 1;
		await new Promise((resolve) => setTimeout(resolve, 500));
		await route.fulfill({
			status: 200,
			body: JSON.stringify({ success: true, message: 'Message sent successfully' })
		});
	});
	await page.goto('/');
	await fillForm(page);
	await sendButton(page).dblclick();

	await expect(sendButton(page)).toBeDisabled();
	await expect(page.locator('#contact form')).toHaveAttribute('aria-busy', 'true');
	await expect(page.locator('#contact').getByRole('status')).toHaveText(
		'Thanks — your message is on its way.'
	);
	expect(count).toBe(1);
});

test('copy email shows Copied', async ({ page }) => {
	await page.goto('/');
	await page.locator('#contact').getByRole('button', { name: 'Copy email' }).click();
	await expect(page.locator('#contact').getByRole('button', { name: 'Copied' })).toBeVisible();
});

test('recaptcha attribution is visible', async ({ page }) => {
	await page.goto('/');
	const form = page.locator('#contact form');
	await expect(form).toContainText('protected by reCAPTCHA');
	await expect(form.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
		'href',
		'https://policies.google.com/privacy'
	);
	await expect(form.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute(
		'href',
		'https://policies.google.com/terms'
	);
});

test('inputs and submit show the solid primary focus outline', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab'); // enter keyboard modality so :focus-visible applies
	for (const target of [
		page.locator('#contact form [name="name"]'),
		page.locator('#contact form [name="message"]'),
		sendButton(page)
	]) {
		await target.focus();
		await expect(target).toHaveCSS('outline-style', /^(?!none)/);
		await expect(target).toHaveCSS('outline-color', 'rgb(214, 58, 79)');
	}
});

test('recaptcha script is not requested on initial load', async ({ page }) => {
	const scriptRequests: string[] = [];
	page.on('request', (request) => {
		if (request.url().includes('recaptcha/api.js')) scriptRequests.push(request.url());
	});
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	expect(scriptRequests).toHaveLength(0);

	await page.locator('#contact').scrollIntoViewIfNeeded();
	await expect.poll(() => scriptRequests.length).toBe(1);
	expect(scriptRequests[0]).toContain('render=test-site-key');
});
