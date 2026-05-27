<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import type { PhotoManifestEntry } from '../../shared/types';

	interface Props {
		photos: PhotoManifestEntry[];
	}

	let { photos }: Props = $props();

	let rootEl: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);
	let visibleSlugs = $state<Set<string>>(new Set());
	let wheelLocked = false;

	const sorted = $derived([...photos].sort((a, b) => a.order - b.order));

	function imgUrl(path: string): string {
		const photoPath = path.replace(/^\/?photos\//, '');
		return `${base}/api/photos/image/${photoPath}`;
	}

	function fileName(photo: PhotoManifestEntry): string {
		return photo.original.split('/').pop() ?? `${photo.slug}.webp`;
	}

	function sectionNodes(): HTMLElement[] {
		if (!rootEl) return [];
		return Array.from(rootEl.querySelectorAll<HTMLElement>('[data-photo-section]'));
	}

	function scrollToIndex(index: number) {
		const nodes = sectionNodes();
		const next = Math.max(0, Math.min(index, nodes.length - 1));
		nodes[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function goNext() {
		scrollToIndex(activeIndex + 1 >= sorted.length ? 0 : activeIndex + 1);
	}

	function goPrev() {
		scrollToIndex(activeIndex <= 0 ? sorted.length - 1 : activeIndex - 1);
	}

	function backToTop() {
		scrollToIndex(0);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault();
			goNext();
		}
		if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault();
			goPrev();
		}
		if (e.key === 'Home') {
			e.preventDefault();
			scrollToIndex(0);
		}
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	function handleWheel(e: WheelEvent) {
		if (!rootEl || window.matchMedia('(max-width: 767px)').matches) return;

		e.preventDefault();
		if (wheelLocked || Math.abs(e.deltaY) < 8) return;

		wheelLocked = true;
		if (e.deltaY > 0) goNext();
		else goPrev();

		window.setTimeout(() => {
			wheelLocked = false;
		}, 720);
	}

	onMount(() => {
		if (!browser || !rootEl || sorted.length === 0) return;

		const sections = sectionNodes();
		visibleSlugs = new Set([sorted[0].slug]);

		const observer = new IntersectionObserver(
			(entries) => {
				let mostVisible: IntersectionObserverEntry | undefined;
				const nextVisible = new Set(visibleSlugs);

				for (const entry of entries) {
					const slug = (entry.target as HTMLElement).dataset.slug;
					if (entry.isIntersecting && slug) {
						nextVisible.add(slug);
					}
					if (
						entry.isIntersecting &&
						(!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio)
					) {
						mostVisible = entry;
					}
				}

				visibleSlugs = nextVisible;

				if (mostVisible) {
					const nextIndex = Number((mostVisible.target as HTMLElement).dataset.index);
					if (!Number.isNaN(nextIndex)) activeIndex = nextIndex;
				}
			},
			{ threshold: [0.35, 0.55, 0.75] }
		);

		sections.forEach((section) => observer.observe(section));
		rootEl.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			observer.disconnect();
			rootEl?.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	{#if sorted.length > 0}
		<link rel="preload" as="image" href={imgUrl(sorted[0].original)} />
	{/if}
</svelte:head>

{#if sorted.length === 0}
	<div class="empty">No photos available</div>
{:else}
	<div
		class="gallery-root"
		bind:this={rootEl}
		oncontextmenu={handleContextMenu}
		role="region"
		aria-label="Photo portfolio"
	>
		{#each sorted as photo, index (photo.id)}
			<section
				class="photo-section from-{photo.revealFrom}"
				class:is-visible={visibleSlugs.has(photo.slug)}
				data-photo-section
				data-index={index}
				data-slug={photo.slug}
				style={`--object-position: ${photo.objectPosition};`}
			>
				<button
					type="button"
					class="image-trigger"
					aria-label="Show next photo"
					onclick={goNext}
				>
					<img
						src={imgUrl(photo.original)}
						alt={photo.title}
						class="photo-image"
						loading={index === 0 ? 'eager' : 'lazy'}
						decoding="async"
						fetchpriority={index === 0 ? 'high' : 'auto'}
						draggable="false"
					/>
				</button>
				<p class="file-name">{fileName(photo)}</p>
			</section>
		{/each}
		<button
			type="button"
			class="back-to-top"
			class:is-visible={activeIndex > 0}
			onclick={backToTop}
		>
			Back to top
		</button>
	</div>
{/if}

<style>
	.gallery-root {
		width: 100%;
		min-height: calc(100dvh - var(--site-header-height));
		background: #ffffff;
		color: #111111;
		user-select: none;
		scroll-snap-type: y proximity;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100dvh - var(--site-header-height));
		background: #ffffff;
		color: #111111;
		font-size: 1rem;
	}

	.photo-section {
		min-height: calc(100dvh - var(--site-header-height));
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 0.7rem;
		padding: 0 0 1rem;
		scroll-snap-align: start;
		opacity: 0;
		transform: translate3d(0, 40px, 0);
		transition:
			opacity 720ms ease,
			transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.photo-section.from-left {
		transform: translate3d(-9vw, 0, 0);
	}

	.photo-section.from-right {
		transform: translate3d(9vw, 0, 0);
	}

	.photo-section.from-top {
		transform: translate3d(0, -7vh, 0);
	}

	.photo-section.from-bottom {
		transform: translate3d(0, 7vh, 0);
	}

	.photo-section.is-visible {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	.image-trigger {
		width: 100%;
		height: 100%;
		min-height: calc(100dvh - var(--site-header-height) - 3rem);
		border: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
		display: block;
	}

	.image-trigger:focus-visible {
		outline: 1px solid #111111;
		outline-offset: -1px;
	}

	.photo-image {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		object-position: var(--object-position);
		pointer-events: none;
	}

	.file-name {
		margin: 0;
		padding: 0 1rem;
		font-family: monospace;
		font-size: 0.78rem;
		line-height: 1.35;
		letter-spacing: 0;
		color: rgba(0, 0, 0, 0.62);
	}

	.back-to-top {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 15;
		padding: 0;
		border: 0;
		background: transparent;
		color: rgba(0, 0, 0, 0.58);
		font-family: monospace;
		font-size: 0.75rem;
		line-height: 1;
		letter-spacing: 0;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 240ms ease,
			color 180ms ease;
	}

	.back-to-top.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.back-to-top:hover {
		color: #111111;
	}

	@media (max-width: 767px) {
		.gallery-root {
			scroll-snap-type: none;
		}

		.photo-section,
		.photo-section.from-left,
		.photo-section.from-right,
		.photo-section.from-top,
		.photo-section.from-bottom {
			transform: translate3d(0, 30px, 0);
			transition:
				opacity 520ms ease,
				transform 680ms ease;
		}

		.photo-section.is-visible {
			transform: translate3d(0, 0, 0);
		}

		.image-trigger {
			min-height: calc(100dvh - var(--site-header-height) - 2.75rem);
		}

		.file-name {
			padding: 0 0.75rem;
			font-size: 0.72rem;
		}

		.back-to-top {
			right: 0.75rem;
			bottom: 0.75rem;
			font-size: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-section,
		.photo-section.from-left,
		.photo-section.from-right,
		.photo-section.from-top,
		.photo-section.from-bottom {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
