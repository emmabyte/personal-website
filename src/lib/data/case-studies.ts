import { featuredProjects } from './projects';
import { todo } from './todo';
import type { CaseStudy, FeaturedProject } from './types';

// Drafted from each project's own repo docs. Each study keeps its review gate until Emma has read it.
export const caseStudies: CaseStudy[] = [
	{
		slug: 'harbor',
		status: 'In development — Release 1',
		problem: [
			'Day and employment programs for adults with intellectual and developmental disabilities in California are funded through regional centers. A provider takes attendance, writes daily notes, reports each incident to several agencies on different clocks, and produces billing files in the format the regional centers accept. Harbor puts that work in one multi-tenant app. Everything California-specific lives in configurable packs, so the same core can serve other states and other human services later.',
			"The records are protected health information. Regional centers make providers sign business associate agreements that flow down to their software vendors, and California's Lanterman Act confidentiality rules are stricter than HIPAA. Harbor is built to be HIPAA-compliant, with Security Rule–grade controls for every tenant and no reduced tier.",
			'Coaches work on personal phones and shared tablets, often on a weak connection, so losing work is not acceptable. With no revenue yet, the infrastructure had to start at the smallest size that is still compliant and grow with customers.'
		],
		role: [
			'Wrote the product definition and the technical design: architecture, infrastructure, and the security and compliance program. Then planned Release 1 as a series of milestones and am building it across the app, the database, infrastructure as code and CI/CD.'
		],
		architecture: {
			caption: 'Harbor request path, simplified',
			description:
				"Diagram of Harbor's architecture: staff and families reach a SvelteKit app behind a TLS proxy, where every request passes through a server-side policy and audit layer; the app and a background worker store data in PostgreSQL with row-level security and in file storage under per-tenant keys; Harbor never connects to funding-agency systems, so staff upload the billing files and submit the reports it prepares.",
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
				decision: 'Start on AWS at the smallest compliant size, and scale up with revenue',
				rejected: ['Vercel + Supabase', 'Vercel for the app, AWS for data', 'Google Cloud'],
				why: 'AWS signs a business associate agreement at no cost, and that one agreement covers the database, files, keys, email and SMS. Vercel and Supabase each needed a higher plan plus a paid HIPAA add-on before the first customer, and Supabase had no automatic failover or customer-managed keys. Google Cloud would still have needed AWS for email, which means two compliance boundaries. The pilot stage runs on one EC2 host with RDS, and the same container image moves to ECS on Fargate once customers pay, so nothing gets re-platformed.'
			},
			{
				decision:
					"One shared database, with tenant_id on every row and row-level security behind the app's own checks",
				rejected: ['A database per tenant', 'A schema per tenant'],
				why: "It has the lowest cost and operational load at this stage. Every service call needs an access context, and the app connects as a database role that can't bypass row-level security, so a query that forgets its tenant filter still can't read another tenant's rows. A large tenant can still move to a dedicated database with the same schema later."
			},
			{
				decision: 'All data access goes through the server',
				rejected: ['The browser calling the database API directly'],
				why: 'Every read and write passes through server-side services that decide who can see what, mask sensitive fields and write the audit record. That keeps every access audited and policy-checked in one place.'
			}
		],
		testing: [
			'Every pull request runs lint (including rules that stop routes from querying the database and keep state-specific terms out of the core), type checks, unit tests, and database tests that fail if any tenant table lacks row-level security. Every new tenant table ships with an isolation test.',
			'Playwright runs the end-to-end flows against the built app on synthetic data at 320, 390 and 1280 px, with axe checks against WCAG 2.2 AA, a check that no page scrolls sideways, and touch-target sizes.',
			'Billing files and reports have golden-file tests built from a sample month.',
			'Every commit on main that passes CI deploys to staging, gets smoke-tested, and rolls back to the previous commit if the smoke tests fail. Development and staging hold synthetic data only.'
		],
		outcome: [
			'Release 1 is planned as nine milestones, each a vertical slice a design partner could click through on synthetic data in staging. The order follows risk: tenancy and privacy first, because they are expensive to retrofit, then billing, then notes, incidents and offline work.',
			'The first two milestones, a walking skeleton and then sign-in with real tenants and roles, are done, and the later milestones are under way.',
			'Infrastructure as code for the AWS organization and staging is applied, and staging deploys automatically from main. No real client data is loaded until the pilot agreements are in place.'
		],
		compliance: [
			'Tenant isolation in layers: an access context on every service call, Postgres row-level security on every tenant table, and per-tenant encryption keys for the most sensitive fields and all files.',
			'An append-only audit trail of every write in an organization. Staff-console actions are also hash-chained by the database, with a tamper check.',
			'Two-step sign-in with an authenticator app is required for managers, billing staff and directors, and session timeouts depend on role and device.',
			"Harbor staff can open a client's records only in a support session, under the client's grant and an access request a second Harbor person approves for a set time. Break-glass access lasts an hour at most, needs a reason, and is reported to the client.",
			'Client data never appears in URLs, logs, error messages, analytics events, email or SMS bodies, or job payloads. Jobs and audit events carry ids only.',
			'Data stays in US regions, with backup copies in a second US region, and only production ever holds client data.',
			'A subcontractor business associate agreement and a California addendum with every California customer, and a HIPAA Security Rule mapping that applies to every tenant whatever its legal status.'
		],
		review: todo('Harbor case study review')
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
					'Rotate the production database credential every week through one shared deploy workflow',
				rejected: ['A longer-lived credential', 'A second copy of the deploy steps'],
				why: 'The credential lasts 30 days, was minted only during a deploy, and is built into the app. When a quiet stretch went past 30 days without a deploy, it expired and every database query failed, sign-in included. A weekly scheduled run of the same deploy workflow keeps it fresh however often features ship, and reuses the health check and automatic rollback rather than duplicating them. A longer lifetime would have fixed the outage by giving up the short-lived credential.'
			},
			{
				decision:
					'Retire an old production credential only after the new deployment is live and healthy',
				rejected: ['Purging old credentials as soon as a new one is minted'],
				why: "The previous deployment keeps serving traffic on its credential until the new one is promoted, pages already open stay on it, and a rollback re-promotes it. Purging early takes the live site's database access with it. Each production deployment is tagged with the credential it uses, so the cleanup always keeps the one that was live when the deploy started."
			},
			{
				decision:
					'Rebuild the CRM around tiers and a Due view, so every live relationship has a next step',
				rejected: [
					'Treating every contact as a lead',
					'A cap on active contacts',
					'Reminder emails or crons'
				],
				why: "In the old CRM every contact was a lead, so nothing was urgent and nearly every scheduled follow-up was overdue. Contacts now move from an inbox to Active, Keep warm or Archived, the next action is the contact's earliest open task, and the Due view and navigation badges do the reminding. There's no cap, because capacity changes with the size and availability of the team."
			}
		],
		testing: [
			'Each pull request gets its own short-lived PlanetScale branch: unit and end-to-end tests run in parallel against fresh databases, schema changes become a deploy request, and a Vercel preview is posted on the PR.',
			'Tests use reCAPTCHA test keys and a test mode that skips real email sends while still running all validation and logic, so CI never spends API quota or reaches an inbox.',
			"Playwright covers sign-in, onboarding, the contact API, support tickets, protected pages, and the admin's content, applications and CRM screens. Vitest covers the encryption module, the reCAPTCHA client and the validation schemas.",
			'Production deploys run a health check and smoke checks, roll back automatically on failure, and open an incident task. An applied schema change can be reverted within 30 minutes.'
		],
		outcome: [
			'Live, and deployed from main once the test workflow passes. The production database credential now rotates on every deploy and weekly on a schedule.',
			"The CRM's first rebuild phase, covering capture and the daily follow-up loop, has shipped, and invoice paid status now syncs automatically."
		],
		review: todo('Emmabyte platform case study review')
	},
	{
		slug: 'tarot-tutor',
		status: 'Live',
		problem: [
			"A study app for learning all 78 tarot cards, upright and reversed, until they can be read without a guidebook. The card meanings come from the owner's own handwritten flashcards and had to be preserved exactly.",
			'It started as a single-file prototype that kept progress in the browser. The rebuild needed accounts so progress follows the reader across devices, a free tier, and a Pro subscription with a seven-day trial, without slowing the study loop: card flips and keyword reveals have to respond instantly.',
			"Paid ads then needed a path for visitors arriving in Instagram's in-app browser, where Google sign-in is refused and an emailed link opens in a different browser."
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
				decision: 'Run the seven-day trial on a timestamp the app owns',
				rejected: ['A Stripe-native trial'],
				why: "A Stripe trial would mean creating a Stripe customer and subscription for every sign-up, including readers who never pay, and either asking for a card up front or handling the trial's end behavior. A timestamp set at sign-up is simpler, needs no card, and is easy to adjust. The plan is resolved on the server on every request, because checking it in the browser would let an open tab keep Pro after the trial ended."
			},
			{
				decision: 'Apply level changes in a database function, computed from the stored row',
				rejected: ['Upserting an absolute level sent by the client'],
				why: "Two tabs answering the same card then compose instead of overwriting each other. A last-write-wins upsert would let a stale tab quietly lower a card's level."
			},
			{
				decision:
					'Let ad visitors play a whole lesson before signing up, then sign up with an emailed code on the result card',
				rejected: [
					'Requiring an account first, with a one-card demo',
					'Google sign-in inside in-app browsers'
				],
				why: "A visitor who has finished a lesson already believes the product works; signing up only keeps what they made. Ad traffic arrives in Instagram's in-app browser, where Google refuses sign-in and an emailed link opens a different browser, so a typed code keeps the whole flow on one page. The held answers travel with the new account and the server re-grades them, so a tampered payload earns no more than honest play."
			}
		],
		testing: [
			"Database tests run against a local Supabase stack with real signed-in users: a reader can't see or write another reader's rows, raise their own plan, extend their trial or forge a Stripe subscription, and the grants on every table, column and function must match a pinned list.",
			'Security tests are proven by breaking the code the way they guard against, for example by making a policy too permissive, and they assert the specific row-level security refusal code rather than any error.',
			'Vitest covers the pure study modules: data integrity across all 78 cards, the review scheduler, exercise construction, every grading branch and each badge at its boundary.',
			'Playwright walks the real flows: sign-up with email confirmation, a free lesson finished and saved by emailed code, the emailed link opened in a different browser still saving the lesson, and ad landings that keep their campaign through to sign-up.'
		],
		outcome: [
			'Live. Since launch it has added guided lesson tracks, a public library of all 78 card meanings, a free lesson before sign-up, and campaign landing pages for ad tests.',
			'The whole Major Arcana is now free to practice, and Pro sells the rest of the practice: every track, suit pathway and lesson.'
		],
		review: todo('Tarot Tutor case study review')
	},
	{
		slug: 'pulse',
		status: 'Open source (AGPL-3.0)',
		problem: [
			"Emmabyte had almost no visibility into email deliverability, application errors or events across its stack. The email provider's dashboard showed a high bounce rate, and nothing on the app side recorded which emails bounced, why, or what code sent them.",
			'Pulse pulls those streams into one place: MailerSend webhooks, Vercel log drains, and events the app sends through an API, including database events for PlanetScale, which has no webhooks of its own. It had to be self-hostable as a single Docker image, with search, filtering and alerting on top.'
		],
		role: [
			'Sole developer: designed and built Pulse, its CI and Docker release pipeline, and its public API and integration docs.'
		],
		architecture: {
			caption: 'Pulse event flow, simplified',
			description:
				"Diagram of Pulse: MailerSend webhooks, Vercel log drains and application events sent with an API key arrive at Pulse's ingestion endpoints, which verify each source and rate-limit each key before storing events in PostgreSQL or SQLite; the dashboard browses and searches them, and alert rules notify by email or Slack.",
			columns: [
				{
					label: 'Sources',
					items: [
						'MailerSend webhooks',
						'Vercel log drain',
						'App events (API key)',
						'PlanetScale via the app'
					]
				},
				{
					label: 'Ingestion',
					items: ['Signature checks', 'Per-key rate limits', 'Single and batch ingest']
				},
				{
					label: 'Storage',
					items: ['PostgreSQL or SQLite', 'Events, metrics, alerts']
				},
				{
					label: 'Dashboard',
					items: [
						'Event browser and search',
						'Threshold and rate alerts',
						'Email and Slack notices'
					]
				}
			]
		},
		decisions: [
			{
				decision: 'Build a standalone service with its own event store',
				rejected: [
					'An external platform (Tinybird, Axiom or Datadog)',
					'A hybrid that forwards most logs to one',
					'An admin page inside the main app'
				],
				why: "An external platform is purpose-built and queries faster at scale, but it adds a vendor dependency and cost, and the data would live outside our control. A separate service also keeps high-volume event data away from the production application's database."
			},
			{
				decision:
					"Keep the open-source repo single-tenant, and put the hosted product's features in a private repo",
				rejected: ['Multi-tenancy and billing in the open-source repo'],
				why: 'A feature that only makes sense when several organizations exist, like organization management, billing, sign-up and usage metering, belongs to the hosted version. Anything a solo self-hoster would use, such as ingestion, the dashboard, alerting and API keys, stays open source. Organization routing and billing were moved out of the open-source repo to keep that line clean.'
			}
		],
		testing: [
			'CI runs type checks, Vitest unit tests (including webhook signature verification), and Playwright end-to-end tests with axe checks against WCAG 2.2 AA on public pages.',
			'The built Docker image is tested end to end against both SQLite and PostgreSQL (health, sign-in and ingestion), and images are published only after those runs pass.',
			'Published images are scanned for known vulnerabilities, and the job fails on fixable critical or high issues. The production image carries production dependencies only.'
		],
		outcome: [
			'Released as open source under AGPL-3.0, with multi-architecture Docker images published to GitHub Container Registry and Docker Hub on every push to main, and versioned releases with generated notes.',
			'The hosted, multi-tenant version, Pulse Cloud, is developed separately in a private repository.'
		],
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
