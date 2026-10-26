import { todo } from './todo';
import type { Profile, Stat } from './types';

export const profile: Profile = {
	name: 'Emma Long',
	role: 'Full-Stack Engineer',
	wordmark: 'emma.long',
	email: 'emmalong.dev@gmail.com',
	location: 'Los Angeles Metropolitan Area',
	availability: todo('badge text — recommended "Taking on freelance projects"'),
	intro:
		"I build reliable web products end to end — from CI/CD pipelines and edge APIs to interfaces people enjoy using. Right now I'm the sole engineer modernizing a decade-old platform at Haven Ministries.",
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
	contactLine: todo('contact supporting line, matches the badge')
};

export const stats: Stat[] = [
	{ value: '2016', label: 'First production work; full-time engineer since 2023' },
	{ value: '40s → 90s', label: "Page-speed scores after modernizing Haven's platform" },
	{ value: '10+ → ~0', label: 'Monthly downtime incidents after the migration' }
];
