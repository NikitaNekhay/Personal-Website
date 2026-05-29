<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { trackEngagement } from '../../services/engagement';
	import { prefetchImages } from '../../services/imagePreload';
	import type { PhotoManifestEntry } from '../../shared/types';

	interface Props {
		photos: PhotoManifestEntry[];
	}

	let { photos }: Props = $props();

	// Сколько фото вперёд «разогревать», когда пользователь вовлечён.
	// Тонкие thumbs тянем дальше (дёшево), тяжёлые оригиналы — только ближайшие.
	const THUMB_LOOKAHEAD = 4;
	const ORIGINAL_LOOKAHEAD = 2;

	let rootEl: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);
	let visibleSlugs = $state<Set<string>>(new Set());
	// Пользователь залип/скроллит → можно начинать фоновую предзагрузку.
	let engaged = $state(false);
	// slug'и фото, у которых оригинал уже загрузился — для плавного fade-in.
	let loadedSlugs = $state<Set<string>>(new Set());

	const sorted = $derived([...photos].sort((a, b) => a.order - b.order));

	function imgUrl(path: string): string {
		const photoPath = path.replace(/^\/?photos\//, '');
		return `${base}/api/photos/image/${photoPath}`;
	}

	function markLoaded(slug: string) {
		if (loadedSlugs.has(slug)) return;
		const next = new Set(loadedSlugs);
		next.add(slug);
		loadedSlugs = next;
	}

	// Action: помечает фото загруженным, чтобы запустить fade-in.
	// Учитывает кэш: если картинка уже готова (complete), событие load не придёт —
	// проверяем синхронно.
	function fadeInOnLoad(node: HTMLImageElement, slug: string) {
		const done = () => markLoaded(slug);
		if (node.complete && node.naturalWidth > 0) {
			done();
		} else {
			node.addEventListener('load', done, { once: true });
		}
		return {
			destroy() {
				node.removeEventListener('load', done);
			}
		};
	}

	// Предзагрузка окна вперёд относительно текущего активного фото.
	// Перезапускается при вовлечении и при каждой смене activeIndex.
	$effect(() => {
		if (!engaged || sorted.length === 0) return;

		const start = activeIndex + 1;
		const thumbs = sorted
			.slice(start, start + THUMB_LOOKAHEAD)
			.map((p) => imgUrl(p.thumb));
		const originals = sorted
			.slice(start, start + ORIGINAL_LOOKAHEAD)
			.map((p) => imgUrl(p.original));

		// thumbs первыми (лёгкие, дают мгновенное превью), затем ближайшие оригиналы
		prefetchImages([...thumbs, ...originals]);
	});

	function fileName(photo: PhotoManifestEntry): string {
		return photo.original.split('/').pop() ?? `${photo.slug}.webp`;
	}

	function photoSize(photo: PhotoManifestEntry): string {
		const value = Number.isFinite(photo.scalePercent) ? photo.scalePercent : 100;
		return `${Math.max(1, Math.min(100, Math.round(value)))}%`;
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

		// Начинаем фоновую предзагрузку только когда пользователь реально вовлечён
		// (залип на видимой вкладке ~3.5с либо начал скроллить). Так первый,
		// видимый кадр не конкурирует за сеть с предзагрузкой следующих.
		const stopEngagement = trackEngagement({
			onEngaged: () => {
				engaged = true;
			}
		});

		return () => {
			observer.disconnect();
			stopEngagement();
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
				style={`--photo-x: ${photo.positionX}%; --photo-y: ${photo.positionY}%; --photo-offset-x: -${photo.positionX}%; --photo-offset-y: -${photo.positionY}%; --photo-size: ${photoSize(photo)};`}
			>
				<button
					type="button"
					class="image-trigger"
					aria-label="Show next photo"
					onclick={goNext}
				>
					<!-- Лёгкое размытое превью (thumb) под оригиналом: показывается мгновенно,
					     пока грузится полный кадр. Декоративное → aria-hidden. -->
					<img
						src={imgUrl(photo.thumb)}
						alt=""
						aria-hidden="true"
						class="photo-thumb"
						class:is-hidden={loadedSlugs.has(photo.slug)}
						loading="lazy"
						decoding="async"
						draggable="false"
					/>
					<img
						src={imgUrl(photo.original)}
						alt={photo.title}
						class="photo-image"
						class:is-loaded={loadedSlugs.has(photo.slug)}
						loading={index === 0 ? 'eager' : 'lazy'}
						decoding="async"
						fetchpriority={index === 0 ? 'high' : 'auto'}
						draggable="false"
						use:fadeInOnLoad={photo.slug}
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
			opacity 260ms ease,
			transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
		content-visibility: auto;
		contain-intrinsic-size: calc(100dvh - var(--site-header-height)) 100vw;
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
		position: relative;
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

	/* Оригинал и thumb позиционируются одинаково (через CSS-переменные кадра),
	   поэтому при загрузке оригинал точно перекрывает превью. */
	.photo-image,
	.photo-thumb {
		position: absolute;
		left: var(--photo-x);
		top: var(--photo-y);
		width: var(--photo-size);
		height: var(--photo-size);
		display: block;
		object-fit: contain;
		transform: translate(var(--photo-offset-x), var(--photo-offset-y));
		pointer-events: none;
	}

	/* Полный кадр проявляется плавно поверх размытого превью.
	   Длинный мягкий ease-out — появление неспешное, без резкого «щелчка». */
	.photo-image {
		z-index: 2;
		opacity: 0;
		transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity;
	}

	.photo-image.is-loaded {
		opacity: 1;
	}

	/* Размытое превью под оригиналом.
	   - умеренный блюр (не «каша»), scale прячет прозрачные поля object-contain;
	   - mask-image мягко растушёвывает края, чтобы блюр не обрывался жёсткой
	     рамкой о белый фон. */
	.photo-thumb {
		z-index: 1;
		filter: blur(9px);
		transform: translate(var(--photo-offset-x), var(--photo-offset-y)) scale(1.08);
		-webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, #000 72%, transparent 100%);
		mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, #000 72%, transparent 100%);
		/* Превью гаснет дольше и с задержкой → мягкий кросс-фейд с оригиналом. */
		transition: opacity 1100ms ease 120ms;
	}

	/* Когда оригинал проявился — прячем превью (после кросс-фейда). */
	.photo-thumb.is-hidden {
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-image {
			opacity: 1;
			transition: none;
		}

		.photo-thumb {
			transition: none;
		}
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
		.photo-section,
		.photo-section.from-left,
		.photo-section.from-right,
		.photo-section.from-top,
		.photo-section.from-bottom {
			transform: translate3d(0, 30px, 0);
			transition:
				opacity 220ms ease,
				transform 300ms ease;
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
