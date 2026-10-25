import { describe, expect, it } from 'vitest';
import { caseStudies, getCaseStudy } from './case-studies';
import { experience } from './experience';
import { launchGates } from './launch-gates';
import { featuredProjects, moreProjects } from './projects';
import { howIShip } from './process';
import { profile, stats } from './profile';
import { stack } from './stack';

// Pending todo() values are launch-guard markers, never published copy.
const PENDING_PREFIX = 'TODO(emma):';

function strings(value: unknown): string[] {
	if (typeof value === 'string') return value.startsWith(PENDING_PREFIX) ? [] : [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
	return [];
}

const everything = {
	profile,
	stats,
	featuredProjects,
	moreProjects,
	experience,
	stack,
	howIShip,
	caseStudies,
	launchGates
};

describe('projects', () => {
	it('featured projects are harbor, emmabyte, tarot-tutor, pulse in that order', () => {
		expect(featuredProjects.map((project) => project.slug)).toEqual([
			'harbor',
			'emmabyte',
			'tarot-tutor',
			'pulse'
		]);
	});

	it('every featured project has exactly one case study and getCaseStudy("nope") is undefined', () => {
		for (const project of featuredProjects) {
			expect(caseStudies.filter((study) => study.slug === project.slug)).toHaveLength(1);
			expect(getCaseStudy(project.slug)?.project).toBe(project);
		}
		expect(getCaseStudy('nope')).toBeUndefined();
	});

	it('getCaseStudy("pulse") returns index 4', () => {
		expect(getCaseStudy('pulse')?.index).toBe(4);
	});

	it('only Pulse has a repoUrl among featured projects', () => {
		const withRepo = featuredProjects.filter((project) => project.repoUrl);
		expect(withRepo.map((project) => project.slug)).toEqual(['pulse']);
		expect(withRepo[0].repoUrl).toBe('https://github.com/emmabyte-engineering/pulse');
	});

	it('harbor has no repoUrl and its copy never says "certified"', () => {
		const harbor = getCaseStudy('harbor');
		expect(harbor?.project.repoUrl).toBeUndefined();
		const copy = strings([harbor?.project, harbor?.study]).join('\n');
		expect(copy).not.toMatch(/certified/i);
	});

	it('more projects lists seven entries in spec order', () => {
		expect(moreProjects.map((project) => project.title)).toEqual([
			'Task1',
			'Accessibility Widget',
			'Study Stack',
			'MiniFTP',
			'Parallel Clustering',
			'Physics Engine Library',
			'Fractal Explorer'
		]);
	});
});

describe('content rules', () => {
	it('the AI note is the only content mentioning AI', () => {
		const AI = /\b(AI|Claude|Copilot|Cursor|LLM)\b/;
		expect(howIShip.aiNote).toMatch(AI);
		const rest = strings({ ...everything, howIShip: { ...howIShip, aiNote: '' } });
		expect(rest.filter((text) => AI.test(text))).toEqual([]);
	});

	it('no prototype placeholders survive', () => {
		const placeholder = /Alex Rivera|Lisbon|Northwind|Brightpath|Fieldnote|40M|alexrivera/i;
		expect(strings(everything).filter((text) => placeholder.test(text))).toEqual([]);
	});

	it('no data string claims ten years', () => {
		const tenYears = /\b10\+? ?(years|yrs)\b/i;
		expect(strings(everything).filter((text) => tenYears.test(text))).toEqual([]);
	});
});

describe('case studies', () => {
	// Every string in a study, pending todo() values included.
	function allStrings(value: unknown): string[] {
		if (typeof value === 'string') return [value];
		if (Array.isArray(value)) return value.flatMap(allStrings);
		if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
		return [];
	}

	it('every case study is drafted', () => {
		for (const study of caseStudies) {
			const drafted = allStrings({ ...study, review: undefined });
			expect(
				drafted.filter((text) => /TODO\(emma\)/.test(text)),
				study.slug
			).toEqual([]);
		}
	});

	it('every case study has the full shape', () => {
		for (const study of caseStudies) {
			expect(study.problem.length, study.slug).toBeGreaterThanOrEqual(2);
			expect(study.role.length, study.slug).toBeGreaterThanOrEqual(1);
			expect(study.architecture.columns.length, study.slug).toBeGreaterThanOrEqual(3);
			expect(study.decisions.length, study.slug).toBeGreaterThanOrEqual(2);
			for (const decision of study.decisions) {
				expect(decision.rejected.length, decision.decision).toBeGreaterThanOrEqual(1);
			}
			expect(study.testing.length, study.slug).toBeGreaterThanOrEqual(2);
			expect(study.outcome.length, study.slug).toBeGreaterThanOrEqual(1);
		}
	});

	it('only harbor has compliance, and it has at least 4 controls', () => {
		expect(caseStudies.filter((study) => study.compliance).map((study) => study.slug)).toEqual([
			'harbor'
		]);
		expect(getCaseStudy('harbor')?.study.compliance?.length).toBeGreaterThanOrEqual(4);
	});

	it('case studies contain no hostnames, emails or internal paths', () => {
		const leak =
			/\b[\w-]+\.(internal|local|lan)\b|@[\w-]+\.\w+|\b(localhost|127\.0\.0\.1)\b|\/Users\//;
		expect(allStrings(caseStudies).filter((text) => leak.test(text))).toEqual([]);
	});

	it('case studies keep the review gate', () => {
		for (const study of caseStudies) {
			expect(study.review, study.slug).toMatch(/^TODO\(emma\): /);
		}
	});

	it('architecture diagrams fit the drawing: 3–4 columns, short labels, at most 4 short items', () => {
		for (const study of caseStudies) {
			const { columns } = study.architecture;
			expect(columns.length, study.slug).toBeGreaterThanOrEqual(3);
			expect(columns.length, study.slug).toBeLessThanOrEqual(4);
			for (const column of columns) {
				expect(column.label.length, column.label).toBeLessThanOrEqual(18);
				expect(column.items.length, column.label).toBeGreaterThanOrEqual(1);
				expect(column.items.length, column.label).toBeLessThanOrEqual(4);
				for (const item of column.items) {
					expect(item.length, item).toBeLessThanOrEqual(28);
				}
			}
		}
	});

	it('status is one short line', () => {
		for (const study of caseStudies) {
			expect(study.status, study.slug).not.toMatch(/\n/);
			expect(study.status.length, study.slug).toBeLessThanOrEqual(40);
		}
	});
});

describe('experience', () => {
	const spacex = experience.jobs.find((job) => job.company === 'SpaceX');

	it('SpaceX period is exactly "2023"', () => {
		expect(spacex?.period).toBe('2023');
	});

	it('experience order is Emmabyte, Haven, Study Stack, SpaceX, Haven', () => {
		expect(experience.jobs.map((job) => job.company)).toEqual([
			'Emmabyte Engineering, Inc.',
			'Haven Ministries',
			'Study Stack',
			'SpaceX',
			'Haven Ministries'
		]);
	});

	it('every Q&A answer is copied verbatim', () => {
		expect(spacex?.faqs[0].question).toBe('Why was this role so short?');
		expect(spacex?.faqs[0].answer).toMatch(/^SpaceX was a valuable experience/);
		expect(experience.jobs.map((job) => job.faqs.length)).toEqual([0, 5, 4, 4, 4]);
	});
});
