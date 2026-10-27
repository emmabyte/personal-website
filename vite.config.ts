import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { contentGuard } from './src/lib/build/content-guard';

export default defineConfig({
	plugins: [contentGuard(), tailwindcss(), sveltekit()],
	// Component tests mount Svelte's client build in jsdom.
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
