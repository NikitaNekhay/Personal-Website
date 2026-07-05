<script lang="ts">
	/**
	 * Site-wide custom scrollbar that replaces the native one (hidden in app.css).
	 * A thin navy rail on the right edge with a dot tracking scroll position, plus
	 * an optional Notion-style table of contents built from the page's content.
	 *
	 * ── Table of contents (content-managed) ─────────────────────────────────────
	 * Any element on any page can opt into a scroll-rail marker by adding a
	 * `data-scrollmark` attribute. No central registry — the marker lives next to
	 * the content, so moving/removing content moves/removes the dot automatically.
	 *
	 *   <h1 data-scrollmark>{$t("Section title")}</h1>   ← label = the element text
	 *   <h2 data-scrollmark={$t("Materials")} data-scrollmark-level="2">…</h2>
	 *
	 * Markers are real <button>s: clickable, keyboard-focusable (Tab/Enter), show a
	 * label on hover/focus, highlight the section you're currently in, and smooth
	 * -scroll to their target on activation.
	 *
	 * ── Desktop vs touch ────────────────────────────────────────────────────────
	 * Desktop (mouse/pen): tap/drag the rail to scroll (geometry captured ONCE at
	 * gesture start — recomputing mid-drag is fatal on iOS where the collapsing
	 * toolbar changes innerHeight every frame). Touch: the rail stays a passive,
	 * non-hijacking indicator (native scrolling, like the OS overlay scrollbar) —
	 * but the TOC markers remain tappable (tap = jump, swipe = scroll).
	 */
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	type Mark = { id: string; label: string; level: number; top: number; el: HTMLElement };

	let rootEl = $state<HTMLDivElement | undefined>(); // outer container (marks live here)
	let barEl = $state<HTMLDivElement | undefined>(); // decorative drag rail
	let dotEl = $state<HTMLSpanElement | undefined>();
	let scrollable = $state(false); // hide when the page doesn't overflow
	let marks = $state<Mark[]>([]);
	let activeId = $state<string | null>(null);

	function scrollEl(): Element {
		return document.scrollingElement || document.documentElement;
	}
	function maxScroll(): number {
		return Math.max(0, scrollEl().scrollHeight - window.innerHeight);
	}
	const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

	// Document-relative top — stable regardless of scroll or CSS transforms
	// (the home canvas moves photos with parallax transforms; this ignores them).
	function docTop(el: HTMLElement): number {
		return el.getBoundingClientRect().top + window.scrollY;
	}
	function headerOffset(): number {
		const v = getComputedStyle(document.documentElement).getPropertyValue('--site-header-height');
		const n = parseFloat(v);
		return Number.isFinite(n) ? n : 0;
	}

	// ── position tracking (dot follows the page scroll) ─────────────────────
	let ticking = false;
	function setDot(p: number) {
		if (dotEl) dotEl.style.top = `${(p * 100).toFixed(2)}%`;
	}
	function render() {
		ticking = false;
		const max = maxScroll();
		const able = max > 1;
		if (able !== scrollable) scrollable = able;
		setDot(max > 0 ? clamp01(window.scrollY / max) : 0);
		updateActive(max);
	}
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(render);
	}

	// ── marks: position + active section ────────────────────────────────────
	function markP(m: Mark): number {
		return clamp01(m.top / (maxScroll() || 1));
	}
	function updateActive(max: number) {
		if (!marks.length) {
			if (activeId !== null) activeId = null;
			return;
		}
		const y = window.scrollY + headerOffset() + 4;
		let current = marks[0].id;
		for (const m of marks) {
			if (m.top <= y) current = m.id;
			else break;
		}
		if (max > 0 && window.scrollY >= max - 1) current = marks[marks.length - 1].id;
		if (current !== activeId) activeId = current;
	}

	// ── marks: scan / measure ───────────────────────────────────────────────
	let scanScheduled = false;
	function scheduleScan() {
		if (scanScheduled) return;
		scanScheduled = true;
		requestAnimationFrame(() => {
			scanScheduled = false;
			scanMarks();
		});
	}
	function scanMarks() {
		const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scrollmark]'));
		marks = els.map((el, i) => {
			if (!el.id) el.id = `sm-${i}-${Math.random().toString(36).slice(2, 7)}`;
			const attr = el.getAttribute('data-scrollmark')?.trim();
			const label = attr || el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 70) || '↦';
			const level = Number(el.getAttribute('data-scrollmark-level')) || 1;
			return { id: el.id, label, level, el, top: docTop(el) };
		});
		render();
	}
	function remeasure() {
		if (!marks.length) return;
		marks = marks.map((m) => ({ ...m, top: docTop(m.el) }));
	}

	// smooth scroll via rAF (reliable on iOS, where scrollTo({behavior:'smooth'})
	// can jump instantly)
	let scrollRaf = 0;
	function smoothTo(targetY: number) {
		const startY = window.scrollY;
		const dist = targetY - startY;
		if (Math.abs(dist) < 2) return;
		const dur = 500;
		const t0 = performance.now();
		const ease = (t: number) => 1 - Math.pow(1 - t, 3);
		if (scrollRaf) cancelAnimationFrame(scrollRaf);
		const step = (now: number) => {
			const p = Math.min((now - t0) / dur, 1);
			window.scrollTo(0, Math.round(startY + dist * ease(p)));
			if (p < 1) scrollRaf = requestAnimationFrame(step);
			else scrollRaf = 0;
		};
		scrollRaf = requestAnimationFrame(step);
	}
	function goToMark(m: Mark) {
		remeasure();
		const y = Math.max(0, Math.min(maxScroll(), m.top - headerOffset() - 12));
		smoothTo(y);
	}

	// ── interaction (mouse/pen only): tap/drag the rail to scroll ───────────
	let dragging = $state(false);
	let dragTop = 0; // captured at gesture start (stable vs iOS toolbar)
	let dragHeight = 1;
	let dragMax = 0;
	let dragY = 0;
	let dragRaf = 0;

	function applyDrag() {
		dragRaf = 0;
		if (!dragging) return;
		const p = clamp01((dragY - dragTop) / dragHeight);
		window.scrollTo(0, p * dragMax);
		setDot(p);
	}
	function onPointerDown(e: PointerEvent) {
		// Touch keeps native scrolling (standard, non-hijacking feel).
		if (e.pointerType === 'touch') return;
		if (!scrollable || !barEl) return;
		e.preventDefault();
		const rect = barEl.getBoundingClientRect();
		dragTop = rect.top;
		dragHeight = rect.height || 1;
		dragMax = maxScroll();
		dragY = e.clientY;
		dragging = true;
		try {
			barEl.setPointerCapture(e.pointerId);
		} catch {
			/* capture unsupported — pointermove still arrives while pressed */
		}
		applyDrag();
	}
	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		dragY = e.clientY;
		if (!dragRaf) dragRaf = requestAnimationFrame(applyDrag);
	}
	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		if (dragRaf) {
			cancelAnimationFrame(dragRaf);
			dragRaf = 0;
		}
		try {
			barEl?.releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	}

	onMount(() => {
		scanMarks();
		render();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		// Content height changes (route changes, image loads, accordions) → remeasure.
		const ro = new ResizeObserver(onResize);
		ro.observe(document.body);
		// Content added/removed (async lists, accordions, route swaps) → re-scan.
		// Ignore mutations that originate inside our own bar (rendering the markers)
		// so we never loop.
		const mo = new MutationObserver((records) => {
			for (const r of records) {
				if (rootEl && rootEl.contains(r.target)) continue;
				scheduleScan();
				return;
			}
		});
		mo.observe(document.body, { childList: true, subtree: true });
		// Route change → rescan once the new DOM has settled.
		const unsub = page.subscribe(async () => {
			await tick();
			scheduleScan();
		});
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			ro.disconnect();
			mo.disconnect();
			unsub();
			if (dragRaf) cancelAnimationFrame(dragRaf);
			if (scrollRaf) cancelAnimationFrame(scrollRaf);
		};
	});

	function onResize() {
		remeasure();
		onScroll();
	}
</script>

{#if browser}
	<div
		class="scrollbar"
		class:is-visible={scrollable}
		class:dragging
		class:has-marks={marks.length > 0}
		bind:this={rootEl}
	>
		<!-- Decorative rail: mouse-only tap/drag to scroll (duplicates the native
		     page scroll, which stays the accessible/keyboard path) → aria-hidden. -->
		<div
			class="rail"
			aria-hidden="true"
			bind:this={barEl}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={endDrag}
			onpointercancel={endDrag}
		>
			<span class="track"></span>
			<span class="dot" bind:this={dotEl}></span>
		</div>

		<!-- Accessible table of contents built from [data-scrollmark] anchors. -->
		{#if marks.length}
			<nav class="marks" aria-label="On this page">
				{#each marks as m (m.id)}
					<button
						type="button"
						class="mark"
						class:active={m.id === activeId}
						data-level={m.level}
						style="top: {(markP(m) * 100).toFixed(2)}%"
						title={m.label}
						onclick={() => goToMark(m)}
					>
						<span class="mark-dot" aria-hidden="true"></span>
						<span class="mark-label">{m.label}</span>
					</button>
				{/each}
			</nav>
		{/if}
	</div>
{/if}

<style>
	.scrollbar {
		position: fixed;
		top: calc(var(--site-header-height) + 4vh);
		bottom: 4vh;
		right: 0.5rem;
		width: 18px; /* invisible hit area so the thin line is easy to grab/tap */
		z-index: 40;
		display: flex;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		/* Critical on iOS: never let the browser pan/zoom from a touch on the bar,
		   otherwise its scroll fights our programmatic scroll → violent jitter. */
		touch-action: none;
		/* Promote to its own compositor layer so the fixed rail stays rock-steady
		   during iOS/Android momentum scrolling instead of stuttering. */
		transform: translateZ(0);
		will-change: opacity;
		transition: opacity 200ms ease;
	}

	.scrollbar.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	/* Touch devices: the RAIL is a passive indicator only — it never intercepts
	   touches, so the page scrolls natively (as smooth as the browser's own) with
	   no JS scroll-fighting. The TOC markers re-enable pointer-events on themselves
	   (below), so they stay tappable while the rail passes swipes straight through. */
	@media (hover: none) and (pointer: coarse) {
		.scrollbar,
		.scrollbar.is-visible {
			pointer-events: none;
			touch-action: auto;
		}
	}

	/* Fills the container and centres the 1px track/dot (mirrors the old flex). */
	.rail {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
	}

	.track,
	.dot {
		pointer-events: none;
	}

	.track {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: rgba(36, 30, 78, 0.18);
	}

	/* No transition on `top` — positioned every frame to match the scroll exactly. */
	.dot {
		position: absolute;
		left: 50%;
		top: 0;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #241e4e;
		transform: translate(-50%, -50%);
		transition:
			width 120ms ease,
			height 120ms ease;
	}

	.scrollbar:hover .dot,
	.scrollbar.dragging .dot {
		width: 9px;
		height: 9px;
	}

	/* ── Table-of-contents markers ─────────────────────────────────────────── */
	.marks {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.mark {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		padding: 0;
		margin: 0;
		border: 0;
		background: none;
		cursor: pointer;
		pointer-events: auto; /* tappable even when the rail is pass-through on touch */
		-webkit-tap-highlight-color: transparent;
	}

	.mark-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(36, 30, 78, 0.32);
		transition:
			background 150ms ease,
			transform 150ms ease;
	}
	.mark[data-level='1'] .mark-dot {
		width: 7px;
		height: 7px;
	}
	.mark:hover .mark-dot,
	.mark:focus-visible .mark-dot {
		background: #241e4e;
		transform: scale(1.3);
	}
	.mark.active .mark-dot {
		background: #eab308; /* gold — current section */
		transform: scale(1.25);
	}

	.mark-label {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		max-width: 46vw;
		overflow: hidden;
		text-overflow: ellipsis;
		background: #241e4e;
		color: #fff;
		font-size: 11px;
		line-height: 1;
		padding: 5px 8px;
		border-radius: 6px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 140ms ease;
	}
	.mark:hover .mark-label,
	.mark:focus-visible .mark-label {
		opacity: 1;
	}
	.mark:focus-visible {
		outline: none;
	}

	/* Touch: bigger invisible tap target; show the current section's label so the
	   rail is legible without hover. Swipes still scroll (no touch-action:none). */
	@media (hover: none) and (pointer: coarse) {
		.mark {
			padding: 9px 11px;
		}
		.mark.active .mark-label {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.mark-dot,
		.mark-label {
			transition: none;
		}
	}
</style>
