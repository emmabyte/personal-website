import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const DATA_DIR = 'src/lib/data';
const PENDING = /\btodo\(\s*(['"`])(.*?)\1/g;

export type PendingItem = { path: string; line: number; note: string };

export function findPendingContent(files: { path: string; content: string }[]): PendingItem[] {
	const found: PendingItem[] = [];
	for (const file of files) {
		// Scan the whole file, not line by line: prettier wraps long todo() calls across lines.
		for (const match of file.content.matchAll(PENDING)) {
			const line = file.content.slice(0, match.index).split('\n').length;
			found.push({ path: file.path, line, note: match[2] });
		}
	}
	return found;
}

export function shouldEnforce(env: Record<string, string | undefined>): boolean {
	// Fail closed: on Vercel, only an explicit preview or development environment skips the guard,
	// so a build where VERCEL_ENV isn't exposed is still enforced.
	const onVercelLive =
		env.VERCEL === '1' && env.VERCEL_ENV !== 'preview' && env.VERCEL_ENV !== 'development';
	return env.REQUIRE_CONTENT === '1' || onVercelLive;
}

function readDataFiles(root: string) {
	const dir = join(root, DATA_DIR);
	return (readdirSync(dir, { recursive: true }) as string[])
		.filter((name) => name.endsWith('.ts') && !name.endsWith('.spec.ts') && name !== 'todo.ts')
		.map((name) => ({
			path: `${DATA_DIR}/${name}`,
			content: readFileSync(join(dir, name), 'utf8')
		}));
}

export function contentGuard(): Plugin {
	let root = process.cwd();
	return {
		name: 'content-guard',
		configResolved(config) {
			root = config.root;
		},
		buildStart() {
			if (!shouldEnforce(process.env)) return;
			const pending = findPendingContent(readDataFiles(root));
			if (pending.length === 0) return;
			const lines = pending.map((item) => `${item.path}:${item.line} ${item.note}`);
			throw new Error(
				`Launch content still pending (see spec "Launch checklist"):\n${lines.join('\n')}`
			);
		}
	};
}
