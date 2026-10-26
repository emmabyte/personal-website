import type { Profile, Stat } from './types';

export const profile: Profile = {
	name: 'Emma Long',
	role: 'Full-Stack Engineer',
	wordmark: 'emma.long',
	email: 'emmalong.dev@gmail.com',
	location: 'Los Angeles Metropolitan Area',
	availability: 'Open to work',
	intro:
		"I build reliable web products end to end — from CI/CD pipelines and edge APIs to interfaces people enjoy using. Right now I run Emmabyte Engineering, where I'm the lead engineer on a client's production ERP and I'm building Harbor, a case-management platform for disability-services providers.",
	metaDescription:
		'Full-stack engineer building reliable web products end to end, from CI/CD pipelines and edge APIs to interfaces people enjoy using.',
	roles: ['Full-Stack Engineer', 'Systems Architect', 'DevOps Tinkerer', 'Interface Builder'],
	siteUrl: 'https://emma-long.vercel.app',
	socials: [
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/emmabyte/' },
		{ label: 'GitHub', href: 'https://github.com/emmabyte' }
	],
	resume: { href: '/documents/resume.pdf', filename: 'resume-emma-long.pdf' },
	contactHeading: "Building something that needs an engineer? Let's talk.",
	contactLine:
		"Tell me a bit about what you're building, and I'll get back to you within a couple of days."
};

export const stats: Stat[] = [
	{ value: '2016', label: 'First production work; full-time engineer since 2023' },
	{
		value: '2–4 → 0',
		label: 'Days a month of missed donation data, before and after my webhook pipeline'
	},
	{ value: '1,000+', label: 'Automated tests and security scans on every Harbor pull request' }
];
