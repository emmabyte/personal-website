import type { StackGroup } from './types';

export const stack: { description: string; groups: StackGroup[] } = {
	description: "Proven tools I go deep on. Here's what I reach for most.",
	groups: [
		{
			area: 'Frontend',
			items: ['TypeScript', 'SvelteKit', 'React', 'Tailwind CSS', 'SwiftUI']
		},
		{
			area: 'Backend',
			items: ['Node.js', 'Go', 'Swift / Vapor', 'Python', 'REST & GraphQL']
		},
		{
			area: 'Data',
			items: ['PostgreSQL', 'Prisma', 'Kysely', 'Supabase', 'PlanetScale']
		},
		{
			area: 'Infra',
			items: ['Vercel', 'Docker', 'GitHub Actions', 'Kubernetes', 'Linux']
		}
	]
};
