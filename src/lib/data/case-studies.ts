import { featuredProjects } from './projects';
import { todo } from './todo';
import type { CaseStudy, FeaturedProject } from './types';

// Task 10 replaces these placeholders with the drafted case studies.
export const caseStudies: CaseStudy[] = [
	{
		slug: 'harbor',
		status: todo('Harbor case study: status'),
		problem: [todo('Harbor case study: problem')],
		role: [todo('Harbor case study: role')],
		architecture: {
			caption: todo('Harbor case study: architecture caption'),
			description: todo('Harbor case study: architecture description'),
			columns: [
				{
					label: todo('Harbor case study: architecture column'),
					items: [todo('Harbor case study: architecture items')]
				}
			]
		},
		decisions: [
			{
				decision: todo('Harbor case study: decision'),
				rejected: [todo('Harbor case study: rejected alternative')],
				why: todo('Harbor case study: decision rationale')
			}
		],
		testing: [todo('Harbor case study: testing')],
		outcome: [todo('Harbor case study: outcome')],
		compliance: [todo('Harbor case study: compliance')],
		review: todo('Harbor case study review')
	},
	{
		slug: 'emmabyte',
		status: todo('Emmabyte platform case study: status'),
		problem: [todo('Emmabyte platform case study: problem')],
		role: [todo('Emmabyte platform case study: role')],
		architecture: {
			caption: todo('Emmabyte platform case study: architecture caption'),
			description: todo('Emmabyte platform case study: architecture description'),
			columns: [
				{
					label: todo('Emmabyte platform case study: architecture column'),
					items: [todo('Emmabyte platform case study: architecture items')]
				}
			]
		},
		decisions: [
			{
				decision: todo('Emmabyte platform case study: decision'),
				rejected: [todo('Emmabyte platform case study: rejected alternative')],
				why: todo('Emmabyte platform case study: decision rationale')
			}
		],
		testing: [todo('Emmabyte platform case study: testing')],
		outcome: [todo('Emmabyte platform case study: outcome')],
		review: todo('Emmabyte platform case study review')
	},
	{
		slug: 'tarot-tutor',
		status: todo('Tarot Tutor case study: status'),
		problem: [todo('Tarot Tutor case study: problem')],
		role: [todo('Tarot Tutor case study: role')],
		architecture: {
			caption: todo('Tarot Tutor case study: architecture caption'),
			description: todo('Tarot Tutor case study: architecture description'),
			columns: [
				{
					label: todo('Tarot Tutor case study: architecture column'),
					items: [todo('Tarot Tutor case study: architecture items')]
				}
			]
		},
		decisions: [
			{
				decision: todo('Tarot Tutor case study: decision'),
				rejected: [todo('Tarot Tutor case study: rejected alternative')],
				why: todo('Tarot Tutor case study: decision rationale')
			}
		],
		testing: [todo('Tarot Tutor case study: testing')],
		outcome: [todo('Tarot Tutor case study: outcome')],
		review: todo('Tarot Tutor case study review')
	},
	{
		slug: 'pulse',
		status: todo('Pulse case study: status'),
		problem: [todo('Pulse case study: problem')],
		role: [todo('Pulse case study: role')],
		architecture: {
			caption: todo('Pulse case study: architecture caption'),
			description: todo('Pulse case study: architecture description'),
			columns: [
				{
					label: todo('Pulse case study: architecture column'),
					items: [todo('Pulse case study: architecture items')]
				}
			]
		},
		decisions: [
			{
				decision: todo('Pulse case study: decision'),
				rejected: [todo('Pulse case study: rejected alternative')],
				why: todo('Pulse case study: decision rationale')
			}
		],
		testing: [todo('Pulse case study: testing')],
		outcome: [todo('Pulse case study: outcome')],
		review: todo('Pulse case study review')
	}
];

export function getCaseStudy(
	slug: string
): { project: FeaturedProject; study: CaseStudy; index: number } | undefined {
	const position = featuredProjects.findIndex((project) => project.slug === slug);
	const study = caseStudies.find((candidate) => candidate.slug === slug);
	if (position === -1 || !study) return undefined;
	return { project: featuredProjects[position], study, index: position + 1 };
}
