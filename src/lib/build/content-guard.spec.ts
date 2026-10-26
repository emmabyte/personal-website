import { describe, expect, it } from 'vitest';
import { findPendingContent, shouldEnforce } from './content-guard';

describe('findPendingContent', () => {
	it('reports each todo call with path, line and note', () => {
		const files = [{ path: 'a.ts', content: "x\nrole: todo('Role for Harbor'),\n" }];
		expect(findPendingContent(files)).toEqual([{ path: 'a.ts', line: 2, note: 'Role for Harbor' }]);
	});

	it('handles single, double and backtick quotes', () => {
		const files = [
			{
				path: 'b.ts',
				content: ["todo('single')", 'todo("double")', "todo(`it's back`)"].join('\n')
			}
		];
		expect(findPendingContent(files)).toEqual([
			{ path: 'b.ts', line: 1, note: 'single' },
			{ path: 'b.ts', line: 2, note: 'double' },
			{ path: 'b.ts', line: 3, note: "it's back" }
		]);
	});

	it('finds a call whose argument sits on the line after the opening paren', () => {
		const files = [{ path: 'c.ts', content: 'a,\ntodo(\n\t`wrapped note`\n),\n' }];
		expect(findPendingContent(files)).toEqual([{ path: 'c.ts', line: 2, note: 'wrapped note' }]);
	});

	it('ignores the todo definition itself', () => {
		const files = [{ path: 'todo.ts', content: 'export function todo(note: string)' }];
		expect(findPendingContent(files)).toEqual([]);
	});
});

describe('shouldEnforce', () => {
	it('fails closed on Vercel unless the environment is preview or development', () => {
		expect(shouldEnforce({ VERCEL: '1' })).toBe(true);
		expect(shouldEnforce({ VERCEL: '1', VERCEL_ENV: 'production' })).toBe(true);
		expect(shouldEnforce({ VERCEL: '1', VERCEL_ENV: 'preview' })).toBe(false);
		expect(shouldEnforce({ VERCEL: '1', VERCEL_ENV: 'development' })).toBe(false);
	});

	it('enforces when REQUIRE_CONTENT=1 and not for a plain local build', () => {
		expect(shouldEnforce({ REQUIRE_CONTENT: '1' })).toBe(true);
		expect(shouldEnforce({})).toBe(false);
	});
});
