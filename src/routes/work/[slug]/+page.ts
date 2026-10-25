import { error } from '@sveltejs/kit';
import { getCaseStudy } from '$lib/data/case-studies';
import { featuredProjects } from '$lib/data/projects';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	featuredProjects.map((project) => ({ slug: project.slug }));

export const load: PageLoad = ({ params }) => {
	const entry = getCaseStudy(params.slug);
	if (!entry) error(404, 'Case study not found');
	return entry;
};
