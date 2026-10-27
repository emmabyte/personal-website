import { featuredProjects } from './projects';
import type { CaseStudy, FeaturedProject } from './types';

// Drafted from each project's own repo docs and reviewed by Emma.
export const caseStudies: CaseStudy[] = [
	{
		slug: 'harbor',
		status: 'In development — Release 1',
		problem: [
			"In California, regional centers fund day and employment services for adults who have intellectual and developmental disabilities. The providers running those programs track attendance, write progress notes, file each incident with several agencies against separate deadlines, and submit billing in the regional centers' format. Harbor brings that work into one multi-tenant app. Rules that apply only in California sit in configurable packs, leaving a core that other states and other kinds of human-services work can reuse later.",
			"Those records count as protected health information. Regional centers require providers to sign business associate agreements whose terms pass down to any software vendor, and the state's Lanterman Act privacy rules go further than HIPAA does. Harbor is built to be HIPAA-compliant, and every tenant gets the full set of Security Rule safeguards; there is no lighter tier.",
			'Coaches work on their own phones or on tablets shared between staff, often with poor signal, so nothing they enter can be lost. And because Harbor has no revenue yet, its hosting had to begin as small as compliance allows and grow as customers arrive.'
		],
		role: [
			'Wrote the product definition and the technical design, covering architecture, infrastructure, security and compliance. Then broke Release 1 into milestones and am building it: app, database, infrastructure as code and CI/CD.'
		],
		architecture: {
			caption: 'Harbor request path, simplified',
			description:
				"Diagram of Harbor's architecture: staff and families use a SvelteKit app behind a TLS proxy, and each request goes through a policy and audit layer on the server; the app and a background worker keep data in PostgreSQL under row-level security and keep files in object storage encrypted with each tenant's own keys; Harbor has no connection to funding-agency systems, so staff carry the billing files and reports it prepares across themselves.",
			columns: [
				{
					label: 'People',
					items: ['Staff on phone or desktop', 'Families via scoped links', 'Installable web app']
				},
				{
					label: 'Container host',
					items: ['Caddy (TLS)', 'SvelteKit app', 'Policy and audit layer', 'pg-boss worker']
				},
				{
					label: 'Data',
					items: [
						'PostgreSQL with RLS',
						'Append-only audit trail',
						'S3 file storage',
						'Per-tenant keys (KMS)'
					]
				},
				{
					label: 'Handoffs',
					items: ['Email with links, no data', 'Billing files staff upload', 'Reports staff submit']
				}
			]
		},
		decisions: [
			{
				decision:
					'Host on AWS from day one, at the smallest size that stays compliant, and grow with revenue',
				rejected: ['Vercel + Supabase', 'Vercel for the app, AWS for data', 'Google Cloud'],
				why: "One free AWS business associate agreement covers the database, file storage, keys, email and SMS. Vercel plus Supabase meant upgrading both plans and paying for HIPAA add-ons before a single customer signed, and Supabase offered neither automatic failover nor customer-managed keys. Keeping only the app on Vercel and the data on AWS roughly halved that bill, but still paid for Vercel's add-on, and Vercel's Pro plan doesn't promise that data stays in the US. Google Cloud would still have needed AWS for email, putting Harbor inside two compliance boundaries. For the pilot, one EC2 host and an RDS database are enough; once customers pay, the same container image moves to ECS on Fargate without a re-platform."
			},
			{
				decision:
					"Every tenant in one database and schema, with tenant_id on each row and Postgres row-level security backing up the app's checks",
				rejected: ['A database per tenant', 'A schema per tenant'],
				why: "At Harbor's size this costs the least and is the simplest to run. No service call happens without an access context, and the app's database role is barred from bypassing row-level security, so even a query missing its tenant filter returns nothing from another tenant. If a big provider ever wants its own database, its rows can move to a separate copy of the schema."
			},
			{
				decision:
					'The browser never talks to the database; the server handles every read and write',
				rejected: ['Direct database calls from the browser'],
				why: 'Server-side services sit on every path to the data. They check whether the person may see a record, hide sensitive fields and log the access, so permissions and the audit trail are enforced in a single layer.'
			}
		],
		testing: [
			"Each pull request is linted, including custom rules that keep database queries out of routes and California terms out of the shared core. Type checks and unit tests follow, then database tests that fail the build when a tenant table is missing row-level security. No tenant table is added without a test proving tenants can't see each other's rows.",
			'End-to-end Playwright tests run against the production build, with only synthetic records loaded, at three screen widths from 320 to 1280 px. At each width they run axe accessibility checks (WCAG 2.2 AA), fail on sideways scrolling, and measure touch targets.',
			'Generated billing files and reports are compared with golden files for a sample month.',
			'A green commit on main goes to staging automatically and is smoke-tested there; if those checks fail, staging returns to the last good commit. Only synthetic data exists outside production.'
		],
		outcome: [
			'Release 1 is split into nine milestones. Each ends with a working slice a prospective design partner can try in staging, on made-up data. The riskiest foundations come first, tenancy and privacy, since adding them late is costly; billing follows, then notes, incidents and offline use.',
			'Milestones one and two are complete (a walking skeleton, then real sign-in with tenants and roles), and work on the later ones has started.',
			"Harbor's AWS organization and its staging environment are described in infrastructure as code and applied, and staging redeploys on its own from main. Real client records stay out until the pilot contracts are signed."
		],
		compliance: [
			"Isolation between tenants at several levels: no service call without an access context, row-level security enforced on each tenant's tables, and separate encryption keys per tenant for files and the most sensitive fields.",
			"Every change inside an organization lands in an audit trail that can only be appended to. Actions in Harbor's own staff console are also linked into a hash chain in the database, and a tamper check runs over it.",
			"Managers, billing staff and directors must sign in with a second step from an authenticator app, and how long a session can sit idle depends on the person's role and device.",
			"Harbor's own team sees client records only during a support session the client has allowed, after a second team member approves the request, and only for a limited window. Emergency break-glass access is capped at one hour, requires a stated reason, and the client is told.",
			'URLs, logs, error messages, analytics, email and SMS text, and background-job payloads never carry client data; jobs and audit entries hold only ids.',
			'Everything is stored in US regions, backups are copied to another US region, and production is the only environment that ever holds real client data.',
			"Each California customer signs Harbor's subcontractor business associate agreement plus a California addendum, and the HIPAA Security Rule mapping applies to every tenant regardless of its legal status."
		]
	},
	{
		slug: 'emmabyte',
		status: 'Live',
		problem: [
			'Emmabyte needed one platform for its public site and its own operations: marketing pages, a blog and careers; a client portal where client organizations sign up, wait for approval and open support tickets; and an admin where the team runs the CRM, recruiting, content, time entries and user approvals.',
			'Client onboarding and invoice records hold tax IDs and bank details, so those fields are encrypted at the field level, and actions go to an audit log kept for seven years. Admin access needed tiers, so a content editor never sees client records.',
			'Schema changes had to ship with zero downtime, and every feature branch needed its own database to work against instead of production.'
		],
		role: [
			'Main developer: built the public site, the client portal and the admin, the permission tiers, the encryption and audit layers, and the CI/CD and database workflow.'
		],
		architecture: {
			caption: 'emmabyte.io, simplified',
			description:
				'Diagram of the emmabyte.io platform: visitors, client organizations and Emmabyte staff use one SvelteKit app on Vercel with a public site, a client portal and a tiered admin; its server layer handles sessions, field-level encryption, audit logging and form protection, and it stores data in PlanetScale MySQL, keeps encrypted files in Vercel Blob, and sends email through MailerSend.',
			columns: [
				{
					label: 'Users',
					items: ['Visitors', 'Client organizations', 'Emmabyte staff']
				},
				{
					label: 'App on Vercel',
					items: [
						'Public site, blog, careers',
						'Client portal',
						'Admin with tiered roles',
						'API routes and crons'
					]
				},
				{
					label: 'Server layer',
					items: [
						'Sessions (Better Auth)',
						'Field-level encryption',
						'Audit log',
						'Rate limits and reCAPTCHA'
					]
				},
				{
					label: 'Data and services',
					items: ['PlanetScale MySQL', 'Encrypted files in Blob', 'MailerSend email']
				}
			]
		},
		decisions: [
			{
				decision:
					'Renew the production database credential weekly by rerunning the existing deploy',
				rejected: ['A longer-lived credential', 'A separate rotation script copying the deploy'],
				why: 'Each credential expires after 30 days, a new one was only issued as part of a deploy, and the build bakes it in. One month the gap between deploys ran longer than that, the credential lapsed, and every query failed, sign-in included. A scheduled weekly run now issues a fresh one no matter how often features ship, and because it calls the normal deploy, it gets the same health check and automatic rollback for free. Extending the expiry would have hidden the problem by giving up the short-lived credential.'
			},
			{
				decision:
					'Delete superseded production credentials only once the new deployment has passed its health checks',
				rejected: ['Purging old credentials as soon as a new one is minted'],
				why: 'Until the new deployment is promoted, the old one is still answering requests with its own credential; tabs that were already open keep using it, and a rollback brings it straight back. Deleting it early would cut the running site off from its database. Every production deployment records which credential it was built with, so the cleanup always spares whichever one is serving traffic when a deploy begins.'
			},
			{
				decision:
					'Rebuild the CRM around tiers and a Due view, so each active relationship always has something scheduled next',
				rejected: [
					'Treating every contact as a lead',
					'A cap on active contacts',
					'Reminder emails or crons'
				],
				why: "The old CRM labeled everyone a lead, so nothing felt urgent and almost all of its scheduled follow-ups had lapsed. New contacts land in an inbox and get sorted into Active, Keep warm or Archived. A contact's next action is just its earliest open task, and reminders come from the Due view and badge counts in the navigation. There's no limit on active contacts, since how many the team can handle shifts with its size and availability."
			}
		],
		testing: [
			'Each pull request gets its own short-lived PlanetScale branch: unit and end-to-end tests run in parallel against fresh databases, schema changes become a deploy request, and a Vercel preview is posted on the PR.',
			'Tests use reCAPTCHA test keys and a test mode that skips real email sends while still running all validation and logic, so CI never spends API quota or reaches an inbox.',
			"Playwright covers sign-in, onboarding, the contact API, support tickets, protected pages, and the admin's content, applications and CRM screens. Vitest covers the encryption module, the reCAPTCHA client and the validation schemas.",
			'Production deploys run a health check and smoke checks, roll back automatically on failure, and open an incident task. A schema change that has been applied stays reversible for half an hour.'
		],
		outcome: [
			'Live, and deployed from main once the test workflow passes. The production database credential now rotates on every deploy and weekly on a schedule.',
			"The CRM's first rebuild phase, covering capture and the daily follow-up loop, has shipped, and invoice paid status now syncs automatically."
		]
	},
	{
		slug: 'tarot-tutor',
		status: 'Live',
		problem: [
			'A study app that teaches all 78 tarot cards, each upright and reversed, to the point of reading them without looking anything up. Every meaning is taken word for word from handwritten study flashcards, and that text had to survive the rebuild unchanged.',
			'It began as a single-file prototype that saved progress in the browser. Rebuilding it meant adding accounts so progress moves between devices, a free tier, and a Pro plan with a seven-day trial, while keeping the study loop instant: card flips and keyword reveals cannot wait on the network.',
			"Paid ads added another constraint. Their visitors land inside Instagram's built-in browser, which blocks Google sign-in and hands email links off to a separate browser app."
		],
		role: [
			'Sole developer: designed and built it end to end, from porting the study engine and the Supabase schema to Stripe billing, the lesson player and the marketing funnel.'
		],
		architecture: {
			caption: 'Tarot Tutor, simplified',
			description:
				"Diagram of Tarot Tutor: the study engine and lesson player run in the browser; the SvelteKit server on Vercel resolves the reader's plan on every request, re-grades free lessons, and handles signed Stripe webhooks; Supabase holds accounts and progress behind row-level security and column grants; Stripe hosts checkout and the customer portal.",
			columns: [
				{
					label: 'Browser',
					items: ['Study engine (pure TS)', 'Lesson player', 'Optimistic progress store']
				},
				{
					label: 'Server (Vercel)',
					items: ['Plan resolved per request', 'Re-grades free lessons', 'Signed Stripe webhook']
				},
				{
					label: 'Supabase',
					items: [
						'Supabase Auth',
						'Postgres with RLS',
						'Column-scoped grants',
						'RPCs for progress writes'
					]
				},
				{
					label: 'Stripe',
					items: ['Hosted Checkout', 'Customer Portal']
				}
			]
		},
		decisions: [
			{
				decision: 'Keep the seven-day trial as an end date stored with the account',
				rejected: ['A Stripe-native trial'],
				why: "With Stripe running the trial, every new account, even one that never pays, would need its own Stripe customer and subscription, plus either a card at sign-up or code for what happens when the trial lapses. An end date on the profile is less to build, asks for no card, and can be changed by hand. The server works out the reader's plan on each request; doing that in the browser would let a tab left open hold on to Pro past the end date."
			},
			{
				decision: 'Work out level changes inside Postgres from the saved value',
				rejected: ['Writing whatever level the client sends'],
				why: 'The client only reports right, partly right or wrong, and a database function adjusts the level already on file. If a card is open in two tabs, both answers count. Had the client sent a finished level, an out-of-date tab could overwrite newer progress and drag the card back down.'
			},
			{
				decision:
					'Let ad visitors play a whole lesson before signing up, then sign up with an emailed code on the result card',
				rejected: [
					'Requiring an account first, with a one-card demo',
					'Google sign-in inside in-app browsers'
				],
				why: "Someone who completes a lesson has already seen the app work, so the account becomes a way to save that result rather than a gate in front of it. Inside Instagram's browser, Google won't allow sign-in and an email link escapes to another app; typing a short code avoids both and keeps the visitor on the result card. The lesson's answers carry over into the new account and are scored again on the server, so editing them in the browser can't earn more than playing fairly would."
			}
		],
		testing: [
			"Database tests run against a local Supabase stack with real signed-in users: a reader can't see or write another reader's rows, raise their own plan, extend their trial or forge a Stripe subscription, and the grants on every table, column and function must match a pinned list.",
			'Each security test is checked by deliberately breaking the guard it protects, such as loosening a policy, and confirming it then fails. Assertions name the exact row-level security error code instead of accepting any failure.',
			'Vitest covers the pure study modules: data integrity across all 78 cards, the review scheduler, exercise construction, every grading branch and each badge at its boundary.',
			'Playwright follows the real journeys: signing up and confirming by email, finishing a free lesson and saving it with a code, saving that lesson through the email link from a second browser, and ad landing pages that carry their campaign tags all the way to sign-up.'
		],
		outcome: [
			'Live. Since launch it has added guided lesson tracks, a public library covering all 78 meanings, a first lesson that needs no account, and landing pages for ad campaigns.',
			'The whole Major Arcana is now free to practice, and Pro sells the rest of the practice: every track, suit pathway and lesson.'
		]
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
