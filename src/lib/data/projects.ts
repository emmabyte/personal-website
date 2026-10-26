import type { FeaturedProject, MoreProject } from './types';

export const featuredProjects: FeaturedProject[] = [
	{
		slug: 'harbor',
		title: 'Harbor',
		year: '2026',
		summary:
			'Multi-tenant case-management SaaS for California human-services providers, starting with day and employment programs for adults with intellectual and developmental disabilities. Built to be HIPAA-compliant. In active development (Release 1).',
		role: 'Product definition, technical design and the build: app, database, infrastructure as code and CI/CD.',
		impact:
			'Pre-launch, with staging redeploying itself from main and 1,000+ tests and security scans on every pull request.',
		tags: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'AWS'],
		liveUrl: 'https://harborcasemanagement.com'
	},
	{
		slug: 'emmabyte',
		title: 'Emmabyte platform',
		year: '2025',
		summary:
			"emmabyte.io, the company's ERP. Clients see invoices, tasks and retainer hours and file support tickets; staff get a custom CRM, WYSIWYG page and blog editors, a hiring pipeline, and automated reports and invoices with Mercury billing.",
		role: 'Main developer: the public site, client portal and admin, plus the CI/CD and database workflow.',
		impact:
			'Runs the company day to day, from client invoices and retainer hours to the CRM and hiring.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'PlanetScale'],
		liveUrl: 'https://www.emmabyte.io',
		walkthrough: true
	},
	{
		slug: 'tarot-tutor',
		title: 'Tarot Tutor',
		year: '2026',
		summary:
			'A Brilliant-style learning platform for tarot: game-style interactive lessons across all 78 cards, a free first lesson with no sign-up, and Pro plans billed through Stripe.',
		role: 'Sole developer: designed and built it end to end, from the study engine to billing and the marketing funnel.',
		impact:
			'Live, with guided lesson tracks, a public library of all 78 meanings, and 2,000+ tests.',
		tags: ['SvelteKit', 'Supabase', 'Stripe', 'PostHog'],
		liveUrl: 'https://tarottutor.io',
		walkthrough: true
	}
];

export const moreProjects: MoreProject[] = [
	{
		title: 'Task1',
		year: '2026',
		description: 'Syncs tasks between ClickUp, Jira and Asana.',
		tags: ['SvelteKit', 'Prisma', 'PostgreSQL', 'Docker'],
		links: []
	},
	{
		title: 'Accessibility Widget',
		year: '2026',
		description: 'Drop-in, framework-agnostic accessibility preferences web component.',
		tags: ['TypeScript', 'Web Components'],
		links: [
			{
				label: 'Source code',
				href: 'https://github.com/emmabyte-engineering/accessibility'
			}
		]
	},
	{
		title: 'Study Stack',
		year: '2025',
		description:
			'Online learning platform with an admin panel, user authentication, and features for students and instructors.',
		tags: ['SvelteKit', 'Vercel Edge', 'PlanetScale', 'Stripe'],
		links: [
			{ label: 'Demo', href: 'https://study-stack-demo.vercel.app' },
			{ label: 'Source code', href: 'https://github.com/emmabyte/study-stack' }
		]
	},
	{
		title: 'MiniFTP',
		description:
			'Portable, multi-arch FTP server on Alpine with Let’s Encrypt TLS and YAML-based config.',
		tags: ['Go', 'Docker', 'GitHub Actions', 'Certbot'],
		links: [{ label: 'Source code', href: 'https://github.com/emmabyte/mini-ftp' }]
	},
	{
		title: 'Parallel Clustering',
		description:
			'K-Means clustering in Swift, tuned for cache efficiency and parallelism on high-dimensional data.',
		tags: ['Swift', 'Concurrency', 'Performance Optimization', 'K-Means Clustering'],
		links: [{ label: 'Source code', href: 'https://github.com/emmabyte/Parallel-Clustering' }]
	},
	{
		title: 'Physics Engine Library',
		description:
			'Lightweight C++ physics engine library with GoogleTest unit tests and GitHub Actions CI.',
		tags: ['C++', 'CMake', 'GoogleTest', 'GitHub Actions'],
		links: [{ label: 'Source code', href: 'https://github.com/emmabyte/PhysicsEngine' }]
	},
	{
		title: 'Fractal Explorer',
		description:
			'Interactive Mandelbrot explorer in C++ and Qt with real-time zooming, for Windows and macOS.',
		tags: ['C++', 'Qt', 'Cmake', 'Cross-Platform'],
		links: [{ label: 'Source code', href: 'https://github.com/emmabyte/fractalExplorer' }]
	}
];
