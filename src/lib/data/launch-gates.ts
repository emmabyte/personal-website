import { todo } from './todo';

/** Launch checklist items that are not tied to a single piece of copy. */
export const launchGates: string[] = [
	todo('replace static/documents/resume.pdf with the updated résumé'),
	todo(
		`confirm all six projects are yours or Emmabyte's to name; confirm harborcm.io can be linked`
	),
	todo('is Haven still current? update period and hero intro'),
	todo('confirm the How I work with AI guardrails'),
	todo('review all draft copy')
];
