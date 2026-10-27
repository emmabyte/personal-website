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

// Every string in a value; pending todo() values are skipped unless includePending is set.
function strings(value: unknown, includePending = false): string[] {
	const walk = (item: unknown) => strings(item, includePending);
	if (typeof value === 'string') {
		return includePending || !value.startsWith(PENDING_PREFIX) ? [value] : [];
	}
	if (Array.isArray(value)) return value.flatMap(walk);
	if (value && typeof value === 'object') return Object.values(value).flatMap(walk);
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
	it('featured projects are harbor, emmabyte, tarot-tutor in that order', () => {
		expect(featuredProjects.map((project) => project.slug)).toEqual([
			'harbor',
			'emmabyte',
			'tarot-tutor'
		]);
	});

	it('every featured project has exactly one case study and getCaseStudy("nope") is undefined', () => {
		for (const project of featuredProjects) {
			expect(caseStudies.filter((study) => study.slug === project.slug)).toHaveLength(1);
			expect(getCaseStudy(project.slug)?.project).toBe(project);
		}
		expect(getCaseStudy('nope')).toBeUndefined();
	});

	it('getCaseStudy("tarot-tutor") returns index 3', () => {
		expect(getCaseStudy('tarot-tutor')?.index).toBe(3);
	});

	it('no featured project links a repo, and only emmabyte and tarot-tutor offer a walkthrough', () => {
		expect(featuredProjects.filter((project) => project.repoUrl)).toEqual([]);
		expect(
			featuredProjects.filter((project) => project.walkthrough).map((project) => project.slug)
		).toEqual(['emmabyte', 'tarot-tutor']);
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

describe('profile', () => {
	it('badge says Open to work', () => {
		expect(profile.availability).toBe('Open to work');
	});

	it('stats never name a client', () => {
		for (const stat of stats) expect(stat.label).not.toMatch(/Haven/);
		expect(stats.map((stat) => stat.value)).toEqual(['2016', '2–4 → 0', '1,000+']);
	});

	it('has a meta description that fits a search snippet', () => {
		expect(profile.metaDescription.length).toBeGreaterThan(0);
		expect(profile.metaDescription.length).toBeLessThanOrEqual(160);
	});
});

describe('stack', () => {
	it('every default-stack tool is listed in a column, and none is also in the extras', () => {
		const listed = stack.groups.flatMap((group) => group.items);
		for (const tool of stack.defaults) expect(listed).toContain(tool);
		for (const tool of stack.also) expect(listed).not.toContain(tool);
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
	it('every case study is drafted', () => {
		for (const study of caseStudies) {
			const drafted = strings({ ...study, review: undefined }, true);
			expect(
				drafted.filter((text) => text.includes(PENDING_PREFIX)),
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
		expect(strings(caseStudies, true).filter((text) => leak.test(text))).toEqual([]);
	});

	it('case studies never mention AI or the tools behind it', () => {
		const tooling = /\b(AI|Claude|Copilot|Cursor|LLMs?|agents?)\b/i;
		expect(strings(caseStudies, true).filter((text) => tooling.test(text))).toEqual([]);
	});

	it('every review gate is cleared, so the production build can ship', () => {
		expect(strings(everything, true).filter((text) => text.startsWith(PENDING_PREFIX))).toEqual([]);
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
