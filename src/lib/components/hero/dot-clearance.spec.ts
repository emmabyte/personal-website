import { describe, expect, it } from 'vitest';
import { clearance } from './dot-clearance';

const rect = { left: 100, top: 100, right: 200, bottom: 150 };

describe('clearance', () => {
	it('hides dots inside a cleared rect', () => {
		expect(clearance(150, 125, [rect])).toBe(0);
	});

	it('leaves dots far from every rect at full strength', () => {
		expect(clearance(500, 500, [rect])).toBe(1);
		expect(clearance(500, 500, [])).toBe(1);
	});

	it('fades dots in across the feather band outside a rect', () => {
		const halfway = clearance(200 + 12, 125, [rect], 24);
		expect(halfway).toBeGreaterThan(0);
		expect(halfway).toBeLessThan(1);
		expect(clearance(200 + 24, 125, [rect], 24)).toBe(1);
	});

	it('uses the nearest rect when several are cleared', () => {
		const other = { left: 300, top: 100, right: 400, bottom: 150 };
		expect(clearance(350, 125, [rect, other])).toBe(0);
	});
});
