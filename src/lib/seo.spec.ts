import { describe, expect, it } from 'vitest';
import { profile } from './data/profile';
import { stack } from './data/stack';
import { jsonLdScript, personJsonLd } from './seo';

describe('jsonLdScript', () => {
	it('escapes a closing script tag', () => {
		const out = jsonLdScript({ a: '</script><b>' });
		expect(out).not.toContain('</script><b>');
		expect(out).toContain('</script>');
		expect(out.startsWith('<script type="application/ld+json">')).toBe(true);
	});
});

describe('personJsonLd', () => {
	it('has Person type, site url and both socials in sameAs', () => {
		const data = personJsonLd();
		expect(data['@type']).toBe('Person');
		expect(data.url).toBe('https://emma-long.vercel.app');
		expect(data.sameAs).toEqual(profile.socials.map((s) => s.href));
		const worksFor = data.worksFor as { name: string }[];
		expect(worksFor.map((o) => o.name)).toEqual(['Emmabyte Engineering, Inc.']);
		expect(data.knowsAbout).toEqual([...stack.groups.flatMap((g) => g.items), ...stack.also]);
	});
});
