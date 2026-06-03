<script lang="ts">
	/**
	 * Site-wide custom scrollbar that fully replaces the native one (hidden in
	 * app.css). Minimal editorial look — a thin navy track on the right edge with a
	 * small navy dot tracking scroll position. Interactive: tap/click anywhere on
	 * the track to jump there, or drag to scroll. One instance lives in the root
	 * layout so every route shares it (including the home canvas).
	 *
	 * iOS notes: the dragged geometry (track rect + max scroll) is captured ONCE at
	 * gesture start and reused — recomputing it mid-drag is fatal on iOS, where the
	 * collapsing Safari toolbar changes window.innerHeight every frame and makes the
	 * target scroll position oscillate. Moves are rAF-throttled (one scroll per
	 * frame) and use instant window.scrollTo, so dragging is smooth and 1:1.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let barEl = $state<HTMLDivElement | undefined>();
	let dotEl = $state<HTMLSpanElement | undefined>();
	let scrollable = $state(false); // hide when the page doesn't overflow (toggles rarely)

	function scrollEl(): Element {
		return document.scrollingElement || document.documentElement;
	}

	function maxScroll(): number {
		return Math.max(0, scrollEl().scrollHeight - window.innerHeight);
	}

	function setDot(p: number) {
		if (dotEl) dotEl.style.top = `${(p * 100).toFixed(2)}%`;
		if (barEl) barEl.setAttribute('aria-valuenow', String(Math.round(p * 100)));
	}

	// ── position tracking (dot follows the page scroll) ─────────────────────
	let ticking = false;
	function render() {
		ticking = false;
		const max = maxScroll();
		const able = max > 1;
		if (able !== scrollable) scrollable = able;
		setDot(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
	}
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(render);
	}

	// ── interaction (tap/drag to scroll) ────────────────────────────────────
	let dragging = false;
	let dragTop = 0; // track top, captured at gesture start (stable vs iOS toolbar)
	let dragHeight = 1; // track height, captured at gesture start
	let dragMax = 0; // max scroll, captured at gesture start
	let dragY = 0; // latest pointer Y
	let dragRaf = 0;

	function applyDrag() {
		dragRaf = 0;
		if (!dragging) return;
		const p = Math.min(1, Math.max(0, (dragY - dragTop) / dragHeight));
		window.scrollTo(0, p * dragMax); // instant (no smooth scroll-behavior set)
		setDot(p);
	}

	function onPointerDown(e: PointerEvent) {
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
		applyDrag(); // jump immediately on press
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		dragY = e.clientY;
		// One scroll write per frame — pointermove can fire far faster than 60Hz.
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
		render();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		// Content height changes (route changes, image loads, accordions) → remeasure.
		const ro = new ResizeObserver(onScroll);
		ro.observe(document.body);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			ro.disconnect();
			if (dragRaf) cancelAnimationFrame(dragRaf);
		};
	});
</script>

{#if browser}
	<div
		class="scrollbar"
		class:is-visible={scrollable}
		class:dragging
		role="scrollbar"
		aria-orientation="vertical"
		aria-label="Page scroll position"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={0}
		tabindex="-1"
		bind:this={barEl}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={endDrag}
		onpointercancel={endDrag}
	>
		<span class="track" aria-hidden="true"></span>
		<span class="dot" aria-hidden="true" bind:this={dotEl}></span>
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
		transition: opacity 200ms ease;
	}

	.scrollbar.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	/* Children never become the pointer/touch target, so the bar's touch-action
	   always applies. */
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

	/* No transition on `top` — positioned every frame to match the scroll exactly,
	   so any easing here would only make it lag behind. */
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
</style>
