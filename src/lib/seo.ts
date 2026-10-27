import { experience } from './data/experience';
import { profile } from './data/profile';
import { stack } from './data/stack';

/** Serialises JSON-LD into a script tag, escaping `<` so data can never close the tag early. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function personJsonLd(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.role,
		url: profile.siteUrl,
		sameAs: profile.socials.map((social) => social.href),
		worksFor: experience.jobs
			.filter((job) => job.period.endsWith('Now'))
			.map((job) => ({ '@type': 'Organization', name: job.company })),
		knowsAbout: [...stack.groups.flatMap((group) => group.items), ...stack.also]
	};
}
