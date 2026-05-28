<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const SHOW_DELAY_MS = 120;
	const MIN_VISIBLE_MS = 260;

	let isVisible = false;
	let shownAt = 0;
	let showTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let unsubscribe: (() => void) | undefined;

	function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
		if (timer) clearTimeout(timer);
	}

	function show() {
		clearTimer(hideTimer);
		if (isVisible) return;

		showTimer = setTimeout(() => {
			isVisible = true;
			shownAt = Date.now();
		}, SHOW_DELAY_MS);
	}

	function hide() {
		clearTimer(showTimer);
		if (!isVisible) return;

		const elapsed = Date.now() - shownAt;
		const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

		hideTimer = setTimeout(() => {
			isVisible = false;
		}, remaining);
	}

	onMount(() => {
		unsubscribe = navigating.subscribe((navigation) => {
			if (navigation) show();
			else hide();
		});
	});

	onDestroy(() => {
		clearTimer(showTimer);
		clearTimer(hideTimer);
		unsubscribe?.();
	});
</script>

{#if isVisible}
	<div
		class="route-loading-overlay"
		aria-live="polite"
		aria-busy="true"
		transition:fade={{ duration: 140 }}
	>
		<LoadingSpinner />
	</div>
{/if}

<style>
	.route-loading-overlay {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(2px);
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.route-loading-overlay {
			backdrop-filter: none;
		}
	}
</style>
