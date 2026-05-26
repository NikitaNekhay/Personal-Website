<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { EmblaCarouselType } from 'embla-carousel';
	import { base } from '$app/paths';
	import type { PhotoManifestEntry } from '../../shared/types';

	interface Props {
		photos: PhotoManifestEntry[];
	}

	let { photos }: Props = $props();

	let viewportEl: HTMLDivElement | undefined = $state();
	let emblaApi: EmblaCarouselType | undefined = $state();
	let selectedIndex = $state(0);
	let titleVisible = $state(true);

	const sorted = $derived([...photos].sort((a, b) => a.order - b.order));
	const total = $derived(sorted.length);
	const current = $derived(sorted[selectedIndex]);

	function imgUrl(path: string): string {
		return `${base}${path}`;
	}

	function formatCounter(index: number, count: number): string {
		const n = String(index + 1).padStart(2, '0');
		const t = String(count).padStart(2, '0');
		return `${n} / ${t}`;
	}

	function preloadNext(index: number) {
		if (sorted.length < 2) return;
		const next = sorted[(index + 1) % sorted.length];
		const img = new Image();
		img.src = imgUrl(next.thumb);
	}

	onMount(() => {
		if (!browser || !viewportEl || sorted.length === 0) return;

		let api: EmblaCarouselType;
		let cancelled = false;

		(async () => {
			const { default: EmblaCarousel } = await import('embla-carousel');
			if (cancelled || !viewportEl) return;

			api = EmblaCarousel(viewportEl, {
				loop: true,
				dragFree: false,
				align: 'center'
			});

			emblaApi = api;

			const onSelect = () => {
				const idx = api.selectedScrollSnap();
				selectedIndex = idx;
				preloadNext(idx);
				titleVisible = false;
				requestAnimationFrame(() => {
					titleVisible = true;
				});
			};

			api.on('select', onSelect);
			onSelect();
		})();

		return () => {
			cancelled = true;
			emblaApi?.destroy();
			emblaApi = undefined;
		};
	});

	function goPrev() {
		emblaApi?.scrollPrev();
	}

	function goNext() {
		emblaApi?.scrollNext();
	}

	function goTo(index: number) {
		emblaApi?.scrollTo(index);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') goPrev();
		if (e.key === 'ArrowRight') goNext();
	}

	function handleZoneClick(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const ratio = x / rect.width;
		if (ratio < 0.25) goPrev();
		else if (ratio > 0.75) goNext();
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
		rel="stylesheet"
	/>
	{#if sorted.length > 0}
		<link rel="preload" as="image" href={imgUrl(sorted[0].thumb)} />
	{/if}
</svelte:head>

{#if sorted.length === 0}
	<div class="empty">No photos available</div>
{:else}
	<div
		class="slider-root"
		oncontextmenu={handleContextMenu}
		role="region"
		aria-label="Photo portfolio"
	>
		<div class="counter font-anonymous">{formatCounter(selectedIndex, total)}</div>

		<div class="embla" onclick={handleZoneClick} onkeydown={() => {}} role="presentation">
			<div class="embla__viewport" bind:this={viewportEl}>
				<div class="embla__container">
					{#each sorted as photo, index (photo.id)}
						<div class="embla__slide">
							<div
								class="slide-inner"
								class:is-active={index === selectedIndex}
								class:is-prev={index !== selectedIndex}
							>
								<img
									src={imgUrl(photo.thumb)}
									alt={photo.title}
									class="slide-img"
									loading={index === 0 ? 'eager' : 'lazy'}
									decoding="async"
									fetchpriority={index === 0 ? 'high' : 'auto'}
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="title-wrap" class:visible={titleVisible}>
			<h2 class="title">{current?.title ?? ''}</h2>
		</div>

		<div class="dots">
			{#each sorted as _, index}
				<button
					type="button"
					class="dot"
					class:active={index === selectedIndex}
					aria-label="Go to slide {index + 1}"
					onclick={() => goTo(index)}
				></button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.slider-root {
		position: relative;
		width: 100%;
		height: calc(100dvh - var(--site-header-height));
		background: #000;
		overflow: hidden;
		user-select: none;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		color: #fff;
		font-size: 1.25rem;
	}

	.counter {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 20;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.875rem;
		letter-spacing: 0.08em;
	}

	.embla {
		height: 100%;
		width: 100%;
		cursor: grab;
	}

	.embla:active {
		cursor: grabbing;
	}

	.embla__viewport {
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	.embla__container {
		display: flex;
		height: 100%;
	}

	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
		height: 100%;
		position: relative;
	}

	.slide-inner {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.slide-inner.is-active {
		animation: slideReveal 600ms cubic-bezier(0.77, 0, 0.18, 1) forwards;
	}

	.slide-inner.is-prev {
		opacity: 0.4;
		transition: opacity 300ms ease;
	}

	@keyframes slideReveal {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0% 0 0);
		}
	}

	.slide-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
		display: block;
	}

	.title-wrap {
		position: absolute;
		bottom: 4.5rem;
		left: 1.5rem;
		z-index: 20;
		max-width: min(90vw, 32rem);
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 400ms ease 200ms,
			transform 400ms ease 200ms;
	}

	.title-wrap.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.title {
		font-family: 'Cormorant Garamond', serif;
		font-size: clamp(1.75rem, 5vw, 3.25rem);
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
		line-height: 1.15;
		margin: 0;
	}

	.dots {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		display: flex;
		gap: 0.65rem;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1.5px solid rgba(255, 255, 255, 0.7);
		background: transparent;
		padding: 0;
		cursor: pointer;
		transition: background 0.25s ease;
	}

	.dot.active {
		background: #fff;
	}

	@media (max-width: 768px) {
		.counter {
			top: 0.75rem;
			right: 0.75rem;
			font-size: 0.75rem;
		}

		.title-wrap {
			bottom: 3.5rem;
			left: 1rem;
		}

		.dots {
			bottom: 1rem;
		}
	}
</style>
