// @vitest-environment jsdom
import { mount, unmount } from 'svelte';
import { describe, expect, it } from 'vitest';
import ArchitectureDiagram from './architecture-diagram.svelte';

describe('ArchitectureDiagram', () => {
	it('renders columns that repeat a label or an item', () => {
		const target = document.createElement('div');
		const component = mount(ArchitectureDiagram, {
			target,
			props: {
				caption: 'repeats',
				description: 'A diagram with repeated text.',
				columns: [
					{ label: 'Data', items: ['PostgreSQL', 'PostgreSQL'] },
					{ label: 'Data', items: ['Backups'] },
					{ label: 'Edge', items: ['CDN'] }
				]
			}
		});
		expect(target.textContent?.match(/PostgreSQL/g)).toHaveLength(4); // both drawings
		unmount(component);
	});
});
