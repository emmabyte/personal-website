/** Marks launch content Emma still has to supply. The production build fails while any remain. */
export function todo(note: string): string {
	return `TODO(emma): ${note}`;
}
