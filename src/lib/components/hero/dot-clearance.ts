export type ClearRect = { left: number; top: number; right: number; bottom: number };

/**
 * How visible a dot at (x, y) should be: 0 inside any cleared rect, rising
 * linearly to 1 at `feather` px outside the nearest one. Keeps the dot field
 * reading as a layer beneath the hero's text instead of tangled through it.
 */
export function clearance(x: number, y: number, rects: ClearRect[], feather = 28): number {
	let nearest = Infinity;
	for (const rect of rects) {
		const dx = Math.max(rect.left - x, 0, x - rect.right);
		const dy = Math.max(rect.top - y, 0, y - rect.bottom);
		nearest = Math.min(nearest, Math.hypot(dx, dy));
	}
	return Math.min(1, nearest / feather);
}
