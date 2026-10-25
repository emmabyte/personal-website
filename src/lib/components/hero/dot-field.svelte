<script lang="ts">
	const GAP = 24;
	const POINTER_RADIUS = 170;
	const RIPPLE_DURATION = 1800;
	const RIPPLE_SPEED = 0.38;
	const ACCENT = '249, 88, 108';

	type Ripple = { x: number; y: number; start: number };

	let { class: className }: { class?: string } = $props();

	let canvas = $state<HTMLCanvasElement>();

	$effect(() => {
		const host = canvas?.parentElement;
		const ctx = canvas?.getContext('2d');
		if (!canvas || !host || !ctx) return;
		const target = canvas;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
		const ripples: Ripple[] = [];
		let width = 0;
		let height = 0;
		let frame = 0;
		let inView = true;

		const resize = () => {
			const rect = target.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			target.width = Math.round(width * dpr);
			target.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (reduceMotion) draw(0);
		};

		const draw = (time: number) => {
			pointer.x += (pointer.tx - pointer.x) * 0.14;
			pointer.y += (pointer.ty - pointer.y) * 0.14;

			for (let i = ripples.length - 1; i >= 0; i--) {
				if (time - ripples[i].start > RIPPLE_DURATION) ripples.splice(i, 1);
			}

			ctx.clearRect(0, 0, width, height);
			const cols = Math.ceil(width / GAP) + 1;
			const rows = Math.ceil(height / GAP) + 1;
			const offsetX = (width - (cols - 1) * GAP) / 2;
			const offsetY = (height - (rows - 1) * GAP) / 2;

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					let x = offsetX + c * GAP;
					let y = offsetY + r * GAP;
					const wave = reduceMotion
						? 0.4
						: Math.sin(c * 0.32 + r * 0.21 + time * 0.0011) * 0.5 + 0.5;

					const dx = x - pointer.x;
					const dy = y - pointer.y;
					const dist = Math.hypot(dx, dy);
					let glow = Math.max(0, 1 - dist / POINTER_RADIUS);
					glow *= glow;

					for (const ripple of ripples) {
						const age = (time - ripple.start) / RIPPLE_DURATION;
						const ring = (time - ripple.start) * RIPPLE_SPEED;
						const d = Math.hypot(x - ripple.x, y - ripple.y);
						const band = Math.max(0, 1 - Math.abs(d - ring) / 36) * (1 - age);
						if (band > glow) glow = band;
					}

					if (dist > 0 && dist < POINTER_RADIUS) {
						const push = (1 - dist / POINTER_RADIUS) * 9;
						x += (dx / dist) * push;
						y += (dy / dist) * push;
					}

					const size = 1.1 + wave * 0.5 + glow * 2.4;
					ctx.fillStyle =
						glow > 0.03
							? `rgba(${ACCENT}, ${0.3 + glow * 0.7})`
							: `rgba(23, 24, 28, ${0.08 + wave * 0.12})`;
					ctx.fillRect(x - size / 2, y - size / 2, size, size);
				}
			}
		};

		const loop = (time: number) => {
			draw(time);
			frame = requestAnimationFrame(loop);
		};

		const start = () => {
			if (reduceMotion || frame || !inView || document.hidden) return;
			frame = requestAnimationFrame(loop);
		};

		const stop = () => {
			cancelAnimationFrame(frame);
			frame = 0;
		};

		const onPointerMove = (event: PointerEvent) => {
			const rect = target.getBoundingClientRect();
			pointer.tx = event.clientX - rect.left;
			pointer.ty = event.clientY - rect.top;
			if (pointer.x < -1000) {
				pointer.x = pointer.tx;
				pointer.y = pointer.ty;
			}
		};

		const onPointerLeave = () => {
			pointer.tx = -1e4;
			pointer.ty = -1e4;
			pointer.x = -1e4;
			pointer.y = -1e4;
		};

		const onPointerDown = (event: PointerEvent) => {
			const rect = target.getBoundingClientRect();
			ripples.push({
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
				start: performance.now()
			});
		};

		const onVisibility = () => (document.hidden ? stop() : start());

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(target);
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
			if (inView) start();
			else stop();
		});
		intersectionObserver.observe(target);

		host.addEventListener('pointermove', onPointerMove);
		host.addEventListener('pointerleave', onPointerLeave);
		host.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('visibilitychange', onVisibility);
		resize();
		start();

		return () => {
			stop();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			host.removeEventListener('pointermove', onPointerMove);
			host.removeEventListener('pointerleave', onPointerLeave);
			host.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true" class={className}></canvas>
