import type { StackGroup } from './types';

export const stack: {
	description: string;
	groups: StackGroup[];
	defaults: string[]; // highlighted: what a new project starts on
	also: string[]; // shipped with, but not a first pick
} = {
	description: "Proven tools I go deep on. Here's what I reach for most.",
	groups: [
		{
			area: 'Frontend',
			items: ['TypeScript', 'SvelteKit', 'Tailwind CSS', 'shadcn-svelte', 'SwiftUI']
		},
		{
			area: 'Backend',
			items: ['Node.js', 'REST & GraphQL', 'MCP']
		},
		{
			area: 'Data',
			items: ['PostgreSQL', 'Prisma', 'Kysely', 'Supabase', 'Python']
		},
		{
			area: 'Infra',
			items: ['Vercel', 'Docker', 'GitHub Actions', 'Cloudflare', 'AWS', 'Linux']
		}
	],
	defaults: ['TypeScript', 'SvelteKit', 'Tailwind CSS', 'Supabase', 'Vercel'],
	also: [
		'React',
		'Next.js',
		'PHP/Laravel',
		'Go',
		'MySQL/PlanetScale',
		'Drizzle',
		'Terraform',
		'Playwright',
		'Vitest'
	]
};
