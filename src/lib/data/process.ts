import type { Principle } from './types';

export const howIShip: { description: string; principles: Principle[]; aiNote: string } = {
	description:
		"Small, tested changes on solid pipelines. Here's the path a change takes from my editor to users.",
	principles: [
		{
			title: 'Pipelines before features',
			body: 'CI/CD with unit and end-to-end tests (Vitest, Playwright, GitHub Actions) goes in first, so every change after that ships safely.'
		},
		{
			title: 'Reproducible environments',
			body: 'Containerized, SSL-enabled dev environments mean a new engineer is productive on day one, not day five.'
		},
		{
			title: 'Modernize in phases',
			body: 'Stabilize first, then rebuild the critical flows, then replace the platform. Each phase delivers value on its own.'
		}
	],
	aiNote:
		'I use AI coding agents for much of the implementation work. Architecture, security-sensitive code, test design and code review stay with me, and patient data, secrets and client code never go into a prompt.'
};
