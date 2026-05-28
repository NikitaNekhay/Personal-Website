<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PHOTO_COLLECTION_YEARS,
		PHOTO_SELECTION_COLLECTION,
		type PhotoCollectionKey
	} from '../../shared/types';

	interface Props {
		selectedCollection: PhotoCollectionKey;
		onSelect: (collection: PhotoCollectionKey) => void;
	}

	let { selectedCollection, onSelect }: Props = $props();

	let menuOpen = $state(false);
	let dropVisible = $state(false);
	let dropAnimating = $state(false);

	let intervalId: ReturnType<typeof setInterval> | undefined;
	let animationTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let menuHideTimer: ReturnType<typeof setTimeout> | undefined;
	let touchStartY = 0;

	function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
		if (timer) clearTimeout(timer);
	}

	function revealDrop() {
		clearTimer(animationTimer);
		clearTimer(hideTimer);
		dropVisible = true;
		dropAnimating = false;

		requestAnimationFrame(() => {
			dropAnimating = true;
		});

		animationTimer = setTimeout(() => {
			dropAnimating = false;
		}, 2600);

		hideTimer = setTimeout(() => {
			if (!menuOpen) dropVisible = false;
		}, 3600);
	}

	function openMenu() {
		clearTimer(menuHideTimer);
		clearTimer(hideTimer);
		dropVisible = true;
		dropAnimating = false;
		menuOpen = true;
	}

	function selectCollection(collection: PhotoCollectionKey) {
		onSelect(collection);
		clearTimer(menuHideTimer);
		menuHideTimer = setTimeout(() => {
			menuOpen = false;
			dropVisible = false;
		}, 2000);
	}

	function handleWheel(e: WheelEvent) {
		if (window.scrollY <= 2 && e.deltaY < -12) {
			revealDrop();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		if (window.scrollY <= 2) {
			touchStartY = e.touches[0]?.clientY ?? 0;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		const currentY = e.touches[0]?.clientY ?? 0;
		if (window.scrollY <= 2 && touchStartY > 0 && currentY - touchStartY > 28) {
			revealDrop();
			touchStartY = 0;
		}
	}

	onMount(() => {
		const firstTimer = setTimeout(revealDrop, 900);
		intervalId = setInterval(revealDrop, 20000);

		window.addEventListener('wheel', handleWheel, { passive: true });
		window.addEventListener('touchstart', handleTouchStart, { passive: true });
		window.addEventListener('touchmove', handleTouchMove, { passive: true });

		return () => {
			clearTimeout(firstTimer);
			if (intervalId) clearInterval(intervalId);
			clearTimer(animationTimer);
			clearTimer(hideTimer);
			clearTimer(menuHideTimer);
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchmove', handleTouchMove);
		};
	});
</script>

<header class="collection-header" aria-label="Filter by collection year">
	<button
		type="button"
		class="drop-trigger"
		class:is-visible={dropVisible || menuOpen}
		class:is-animating={dropAnimating}
		aria-label="Open collection year filter"
		aria-expanded={menuOpen}
		onclick={openMenu}
	>
		<span></span>
	</button>

	{#if menuOpen}
		<nav class="collection-nav" aria-label="Collection years">
			<button
				type="button"
				class="collection-pill"
				class:active={selectedCollection === PHOTO_SELECTION_COLLECTION}
				onclick={() => selectCollection(PHOTO_SELECTION_COLLECTION)}
			>
				Selection
			</button>
			{#each PHOTO_COLLECTION_YEARS as year}
				<button
					type="button"
					class="collection-pill"
					class:active={selectedCollection === year}
					onclick={() => selectCollection(year)}
				>
					{year}
				</button>
			{/each}
		</nav>
	{/if}
</header>

<style>
	.collection-header {
		position: fixed;
		top: var(--site-header-height);
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		justify-content: center;
		pointer-events: none;
		padding: 0.75rem;
	}

	.drop-trigger {
		position: absolute;
		top: 0;
		left: 50%;
		width: 2.25rem;
		height: 3.1rem;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transform: translateX(-50%) translateY(-1.8rem);
		transition: opacity 180ms ease;
	}

	.drop-trigger.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.drop-trigger span {
		position: absolute;
		top: 0;
		left: 50%;
		display: block;
		width: 2px;
		height: 1.45rem;
		border-radius: 999px;
		background: rgba(246, 174, 45, 0.9);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		transform: translateX(-50%);
		transform-origin: top center;
	}

	.drop-trigger.is-animating span {
		animation: filterDrop 2600ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.collection-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem 0.5rem;
		margin-top: 0.4rem;
		padding: 0.4rem 0.65rem;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		pointer-events: auto;
		animation: menuIn 260ms ease both;
	}

	.collection-pill {
		font-family: 'Anonymous Pro', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.35rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.85);
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.collection-pill:hover {
		border-color: #f6ae2d;
		color: #f6ae2d;
	}

	.collection-pill.active {
		background: #f6ae2d;
		border-color: #f6ae2d;
		color: #1a1a1a;
	}

	@keyframes filterDrop {
		0% {
			width: 2px;
			height: 1.3rem;
			border-radius: 999px;
			transform: translateX(-50%) translateY(-1.45rem) scaleY(0.75);
			opacity: 0;
		}
		16% {
			width: 2px;
			height: 2.4rem;
			border-radius: 999px;
			transform: translateX(-50%) translateY(-0.4rem) scaleY(1);
			opacity: 1;
		}
		42% {
			width: 1.35rem;
			height: 1.9rem;
			border-radius: 999px 999px 999px 0.28rem;
			transform: translateX(-50%) translateY(0.2rem) rotate(-45deg) scale(1);
			opacity: 1;
		}
		54% {
			transform: translateX(-50%) translateY(0.02rem) rotate(-45deg) scale(1.04);
		}
		66% {
			transform: translateX(-50%) translateY(0.15rem) rotate(-45deg) scale(0.985);
		}
		78% {
			width: 1.35rem;
			height: 1.9rem;
			border-radius: 999px 999px 999px 0.28rem;
			transform: translateX(-50%) translateY(0.08rem) rotate(-45deg) scale(1);
			opacity: 1;
		}
		100% {
			width: 2px;
			height: 1.25rem;
			border-radius: 999px;
			transform: translateX(-50%) translateY(-1.55rem) rotate(0deg) scaleY(0.7);
			opacity: 0;
		}
	}

	@keyframes menuIn {
		from {
			opacity: 0;
			transform: translateY(-0.35rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.collection-header {
			padding-inline: 0.55rem;
		}

		.collection-pill {
			font-size: 0.65rem;
			padding: 0.3rem 0.55rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.drop-trigger.is-animating span,
		.collection-nav {
			animation: none;
		}
	}
</style>
