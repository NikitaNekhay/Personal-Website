<script lang="ts">
	/**
	 * Site-wide custom scrollbar that fully replaces the native one (hidden in
	 * app.css). Minimal editorial look — a thin navy track on the right edge with a
	 * small navy dot tracking scroll position. Interactive: click anywhere on the
	 * track to jump there, or drag the dot to scroll. One instance lives in the root
	 * layout, so every route shares it (including the home canvas).
	 *
	 * Performance: the dot position is written straight to the DOM inside a single
	 * rAF (no per-frame Svelte re-render) and has NO CSS transition, so it tracks the
	 * scroll 1:1 with no lag on desktop or phones.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let barEl = $state<HTMLDivElement | undefined>();
	let dotEl = $state<HTMLSpanElement | undefined>();
	let scrollable = $state(false); // hide when the page doesn't overflow (toggles rarely)
	let dragging = false;

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

	// Map a pointer Y to a scroll position and jump there instantly (1:1, no easing)
	// so dragging/clicking feels as responsive as the cursor itself.
	function scrollToClientY(clientY: number) {
		if (!barEl) return;
		const rect = barEl.getBoundingClientRect();
		const p = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
		scrollEl().scrollTo({ top: p * maxScroll() });
		setDot(p); // reflect immediately, don't wait for the scroll event
	}

	function onPointerDown(e: PointerEvent) {
		if (!scrollable) return;
		e.preventDefault();
		dragging = true;
		barEl?.setPointerCapture(e.pointerId);
		scrollToClientY(e.clientY); // click anywhere on the track jumps there
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		scrollToClientY(e.clientY);
	}

	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
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
		};
	});
</script>

{#if browser}
	<div
		class="scrollbar"
		class:is-visible={scrollable}
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
		width: 16px; /* invisible hit area so the thin line is easy to grab/click */
		z-index: 40;
		display: flex;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		touch-action: none;
		transition: opacity 200ms ease;
	}

	.scrollbar.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.track {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: rgba(36, 30, 78, 0.18);
	}

	/* No transition on `top` — the dot is positioned every frame to match the
	   scroll exactly, so any easing here would only make it lag behind. */
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

	.scrollbar:hover .dot {
		width: 9px;
		height: 9px;
	}
</style>
