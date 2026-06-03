<script lang="ts">
	/**
	 * Site-wide custom scrollbar that fully replaces the native one (hidden in
	 * app.css). Minimal editorial look — a thin navy track on the right edge with
	 * a small navy dot that tracks page scroll. It is interactive: drag the dot or
	 * click anywhere on the track to scroll. One instance lives in the root layout,
	 * so every route shares the same scrollbar (including the home canvas).
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let trackEl = $state<HTMLDivElement | undefined>();
	let progress = $state(0); // 0..1 page scroll position
	let scrollable = $state(false); // hide when the page doesn't overflow
	let dragging = $state(false);

	function scrollEl(): Element {
		return document.scrollingElement || document.documentElement;
	}

	function maxScroll(): number {
		return Math.max(0, scrollEl().scrollHeight - window.innerHeight);
	}

	let rafQueued = false;
	function measure() {
		rafQueued = false;
		const max = maxScroll();
		scrollable = max > 1;
		progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
	}

	function schedule() {
		if (rafQueued) return;
		rafQueued = true;
		requestAnimationFrame(measure);
	}

	// Map a pointer Y to a scroll position. While dragging we jump instantly for
	// responsiveness; a plain click on the track scrolls smoothly to the spot.
	function scrollToPointer(clientY: number) {
		if (!trackEl) return;
		const rect = trackEl.getBoundingClientRect();
		const p = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
		scrollEl().scrollTo({ top: p * maxScroll(), behavior: dragging ? 'auto' : 'smooth' });
	}

	function onPointerDown(e: PointerEvent) {
		if (!scrollable) return;
		e.preventDefault();
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		scrollToPointer(e.clientY);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		scrollToPointer(e.clientY);
	}

	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* pointer already released */
		}
	}

	onMount(() => {
		measure();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		// Content height changes (route changes, images loading, accordions) → remeasure.
		const ro = new ResizeObserver(schedule);
		ro.observe(document.body);
		return () => {
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			ro.disconnect();
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
		aria-valuenow={Math.round(progress * 100)}
		tabindex="-1"
		bind:this={trackEl}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={endDrag}
		onpointercancel={endDrag}
	>
		<span class="track" aria-hidden="true"></span>
		<span class="dot" aria-hidden="true" style={`top: ${(progress * 100).toFixed(2)}%`}></span>
	</div>
{/if}

<style>
	.scrollbar {
		position: fixed;
		top: calc(var(--site-header-height) + 4vh);
		bottom: 4vh;
		right: 0.5rem;
		width: 14px; /* invisible hit area so the thin line is grabbable */
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

	.dot {
		position: absolute;
		left: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #241e4e;
		transform: translate(-50%, -50%);
		transition:
			top 80ms linear,
			width 120ms ease,
			height 120ms ease;
	}

	/* Slightly enlarge the dot on hover/drag for grab affordance. */
	.scrollbar:hover .dot,
	.scrollbar.dragging .dot {
		width: 9px;
		height: 9px;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			transition: none;
		}
	}
</style>
