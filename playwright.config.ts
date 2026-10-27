import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173,
		env: {
			PUBLIC_RECAPTCHA_SITE_KEY: 'test-site-key',
			RECAPTCHA_SECRET_KEY: 'test-secret',
			MAILERSEND_API_KEY: 'test-key'
		}
	},

	testDir: 'e2e'
});
