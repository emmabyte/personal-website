import { todo } from './todo';
import type { Job } from './types';

export const experience: { description: string; jobs: Job[] } = {
	description: 'From IT and analytics in 2016 to full-time engineering since 2023.',
	jobs: [
		{
			period: '2025 — Now',
			company: 'Emmabyte Engineering, Inc.',
			companyUrl: 'https://www.emmabyte.io',
			title: todo('Emmabyte title, e.g. Founder & Principal Engineer'),
			summary:
				'Run a small engineering company building SaaS products and client software, including a HIPAA-compliant case-management platform, a CRM and client portal, and open-source developer tools. Hire and interview engineers.',
			link: { label: 'See selected work', href: '/#work' },
			faqs: []
		},
		{
			period: '2023 — Now',
			company: 'Haven Ministries',
			companyUrl: 'https://haventoday.org',
			title: 'Software Developer',
			summary:
				'Sole engineer leading a three-phase modernization: performance and reliability, a rebuilt donation system, and a ground-up replacement of a decade-old WordPress site.',
			faqs: [
				{
					question: 'What kinds of problems were you hired to solve at Haven?',
					answer:
						'Haven Ministries had a number of legacy systems that were underperforming or unstable. I was brought on to lead a multi-phase initiative to modernize the organization’s digital infrastructure—starting with performance and reliability issues, then revamping core giving flows and content systems, and finally rebuilding the entire site from the ground up with a modern tech stack.'
				},
				{
					question: 'What has your role involved beyond writing code?',
					answer:
						'As the only full-time engineer, I take full ownership over software development across Haven’s digital properties. That includes architecture decisions, infrastructure setup, DevOps, contractor coordination, and long-term project planning. I also serve as the primary technical advisor to leadership and content teams, helping shape the organization’s digital strategy.'
				},
				{
					question: 'What were the outcomes of the first phase of your modernization work?',
					answer:
						'I refactored and containerized critical portions of our legacy codebase and migrated our infrastructure to a managed hosting platform with auto-scaling. This brought our average page speed scores from the 40s to the high 90s, and cut downtime incidents from 10+ per month to nearly zero.'
				},
				{
					question: 'How did you improve the donations experience?',
					answer:
						'In phase two of the rebuild, I architected a fully integrated donation system—combining a managed donation platform with custom CMS syncing and a rebuilt Shopify storefront. This significantly reduced overhead for our content managers and gave donors a more seamless and trustworthy giving experience.'
				},
				{
					question: 'What’s happening in phase three?',
					answer:
						'Phase three involves rebuilding the Haven website from the ground up using a modern web stack, moving away from over a decade of WordPress legacy architecture. My focus has been on making the new platform more performant, maintainable, and flexible for future content and donation strategies.'
				}
			]
		},
		{
			period: '2022 — 2025',
			company: 'Study Stack',
			companyUrl: 'https://study-stack-demo.vercel.app',
			title: 'Co-Founder & Lead Engineer',
			summary:
				'Designed and built a cloud-native learning platform end to end, with full CI test coverage, and mentored a junior developer. Now open source.',
			faqs: [
				{
					question: 'Why did the original project end?',
					answer:
						'The project began as a startup focused on Christian education, which I co-founded with a business partner. When my personal beliefs shifted, my partner chose to step away and shut down the original version. Rather than let the work go to waste, I transformed it into an open-source learning platform starter kit that could benefit a broader audience.'
				},
				{
					question: 'What kind of work did you do on this project?',
					answer:
						'Over the course of 600+ hours, I handled everything from system architecture and full-stack development to DevOps and developer experience tooling. I also mentored an intern in the final year, helping him level up in both front-end and back-end development while collaborating on project goals.'
				},
				{
					question: 'Is this project still active?',
					answer:
						'While it’s no longer a live product, the codebase is open-source and publicly available as a modern learning platform starter kit. It continues to serve as a portfolio piece, tech reference, and contribution-friendly project for developers interested in scalable web apps.'
				},
				{
					question: 'What did you learn from building this?',
					answer:
						'Leading the full lifecycle of a product—especially through a major pivot—taught me how to design for scale, adapt to changing visions, and work collaboratively across technical and non-technical roles. It also deepened my mentorship skills and strengthened my conviction in the value of sustainable engineering practices.'
				}
			]
		},
		{
			period: '2023',
			company: 'SpaceX',
			companyUrl: 'https://spacex.com',
			title: 'Software Engineer II',
			summary:
				'Infrastructure team: containerized dev services, refined CI/CD pipelines, and scripted environment setup to speed up onboarding.',
			faqs: [
				{
					question: 'Why was this role so short?',
					answer:
						'SpaceX was a valuable experience, but I realized early on that the environment and scope of work didn’t align with my long-term goals. I’m passionate about crafting well-designed systems with a tangible impact on users, so I transitioned to a role where I could work more closely with product teams while maintaining a healthier balance.'
				},
				{
					question: 'What was the work like on the infrastructure team?',
					answer:
						'I worked on containerizing internal tools and improving parts of the build pipeline. I also contributed to automating the developer environment setup to improve onboarding and productivity for new engineers.'
				},
				{
					question: 'Would you consider working in high-pressure environments again?',
					answer:
						'I’ve learned that I do my best work in thoughtful, well-supported environments. While I can handle fast-paced projects, I avoid cultures that normalize stress and overwork. I believe quality engineering happens when teams have space to plan, reflect, and build sustainably—and that’s the kind of culture I seek out now.'
				},
				{
					question: 'Why take a role at a nonprofit after a company like SpaceX?',
					answer:
						'I was looking for a role where I could work closer to the product and see my work have a direct impact. Haven gave me that opportunity, along with the space to build systems with intention and long-term vision.'
				}
			]
		},
		{
			period: '2016 — 2023',
			company: 'Haven Ministries',
			companyUrl: 'https://haventoday.org',
			title: 'IT & Analytics Advisor',
			summary:
				'Linux servers, data pipelines and dashboards, and CI/CD support — and led a monolith-to-microservices migration that cut downtime.',
			faqs: [
				{
					question: 'How does this role relate to your current engineering work?',
					answer:
						'While this role began with more traditional IT and analytics responsibilities, I was already exploring development on the side. Over time, I took on increasingly technical projects—from scripting automation and debugging code to working directly with our web team and DevOps pipelines. This progression laid the foundation for my transition into a full software engineering role later on.'
				},
				{
					question: 'Were you working full-time during school?',
					answer:
						'For most of my academic career, yes—I was working full-time at Haven Ministries while attending school full-time. It was a challenging but deeply rewarding experience that taught me how to manage complex responsibilities and prioritize growth. During my final year in school, I shifted to part-time so I could fully focus on some of my most demanding upper-division coursework.'
				},
				{
					question: 'Why did your role shift over time?',
					answer:
						'As my technical skills matured, I naturally took on more engineering work. Eventually, I was collaborating directly with our developers and consultants, contributing code, and leading infrastructure initiatives. My formal job title changed later, but the growth in scope and responsibility started years before.'
				},
				{
					question: 'Why list this separately from your Software Developer title?',
					answer:
						'Although both roles were at Haven Ministries, they reflect two distinct phases of my career. This earlier position was focused on IT, analytics, and infrastructure, while the later one was a dedicated software engineering role with deeper involvement in product development and system architecture.'
				}
			]
		}
	]
};
