export type Link = { label: string; href: string };
export type Profile = {
	name: string;
	role: string;
	wordmark: string;
	email: string;
	location: string;
	availability?: string; // omit to hide the hero badge
	intro: string;
	metaDescription: string;
	roles: string[];
	siteUrl: string;
	socials: Link[];
	resume: { href: string; filename: string };
	contactHeading: string;
	contactLine?: string; // omit to hide the line under the contact heading
};
export type Stat = { value: string; label: string };
export type StackGroup = { area: string; items: string[] };
export type ProjectSlug = 'harbor' | 'emmabyte' | 'tarot-tutor';
export type FeaturedProject = {
	slug: ProjectSlug;
	title: string;
	year: string;
	summary: string;
	role: string;
	impact: string;
	tags: string[];
	liveUrl?: string;
	repoUrl?: string; // no repoUrl = private repo
	walkthrough?: boolean; // private code Emma will walk an employer through; otherwise proprietary
};
export type MoreProject = {
	title: string;
	year?: string;
	description: string;
	tags: string[];
	links: Link[];
};
export type Faq = { question: string; answer: string };
export type Job = {
	period: string;
	company: string;
	companyUrl?: string;
	title: string;
	summary: string;
	link?: Link;
	faqs: Faq[];
};
export type Principle = { title: string; body: string };
export type DiagramColumn = { label: string; items: string[] };
export type Decision = { decision: string; rejected: string[]; why: string };
export type CaseStudy = {
	slug: ProjectSlug;
	status: string;
	problem: string[];
	role: string[];
	architecture: { caption: string; description: string; columns: DiagramColumn[] };
	decisions: Decision[];
	testing: string[];
	outcome: string[];
	compliance?: string[];
	review?: string; // review: a todo() gate that's never rendered
};
