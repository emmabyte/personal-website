import { todo } from './todo';
import type { FeaturedProject, MoreProject } from './types';

export const featuredProjects: FeaturedProject[] = [
	{
		slug: 'harbor',
		title: 'Harbor',
		year: '2026',
		summary:
			'Multi-tenant case-management SaaS for California human-services providers, starting with day and employment programs for adults with intellectual and developmental disabilities. Built to be HIPAA-compliant. In active development (Release 1).',
		role: todo('Harbor role'),
		impact: todo('Harbor impact'),
		tags: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'Docker'],
		liveUrl: 'https://harborcasemanagement.com'
	},
	{
		slug: 'emmabyte',
		title: 'Emmabyte platform',
		year: '2025',
		summary: "emmabyte.io: the company's marketing site plus a full CRM, client portal and admin.",
		role: todo('Emmabyte platform role'),
		impact: todo('Emmabyte platform impact'),
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'PlanetScale'],
		liveUrl: 'https://www.emmabyte.io'
	},
	{
		slug: 'tarot-tutor',
		title: 'Tarot Tutor',
		year: '2026',
		summary:
			'Subscription learning app with guided lesson tracks, a free in-browser first lesson, and Stripe-backed Pro plans.',
		role: todo('Tarot Tutor role'),
		impact: todo('Tarot Tutor impact'),
		tags: ['SvelteKit', 'Supabase', 'Stripe', 'PostHog'],
		liveUrl: 'https://tarottutor.io'
	},
	{
		slug: 'pulse',
		title: 'Pulse',
		year: '2026',
		summary:
			'Open-source observability platform that pulls logs, events and metrics from MailerSend, Vercel, PlanetScale and app code into one dashboard with search and alerting. It also has a hosted version, Pulse Cloud.',
		role: todo('Pulse role'),
		impact: todo('Pulse impact'),
		tags: ['SvelteKit', 'Prisma', 'PostgreSQL', 'Docker'],
		repoUrl: 'https://github.com/emmabyte-engineering/pulse'
	}
];

export const moreProjects: MoreProject[] = [
	{
		title: 'Task1',
		year: '2026',
		description: 'Syncs tasks between ClickUp, Jira and Asana.',
		tags: ['SvelteKit', 'Prisma', 'PostgreSQL', 'Docker'],
		links: [{ label: 'Private repo', href: '/#contact' }]
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
