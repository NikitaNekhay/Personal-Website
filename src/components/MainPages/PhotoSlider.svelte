<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { trackEngagement } from '../../services/engagement';
	import { prefetchImages } from '../../services/imagePreload';
	import type { PhotoManifestEntry } from '../../shared/types';

	interface Props {
		photos: PhotoManifestEntry[];
	}

	let { photos }: Props = $props();

	// Adjusted in onMount based on device type — mobile gets lower values to avoid
	// bandwidth competition with the hero photo's original.
	let thumbLookahead = 6;
	let originalLookahead = 3;

	let rootEl: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);
	let visibleSlugs = $state<Set<string>>(new Set());
	// Пользователь залип/скроллит → можно начинать фоновую предзагрузку.
	let engaged = $state(false);
	// slug'и фото, у которых оригинал уже загрузился — для плавного fade-in.
	let loadedSlugs = $state<Set<string>>(new Set());
	// slug'и фото, у которых превью (thumb) уже загрузился — скрывает скелетон.
	let thumbLoadedSlugs = $state<Set<string>>(new Set());

	const sorted = $derived([...photos].sort((a, b) => a.order - b.order));

	// Photo N's original only cross-fades once photo N-1 is also ready,
	// unless the user has actively scrolled to photo N (i <= activeIndex override).
	// Prevents photo 2 appearing sharp while photo 1 (the hero) is still blurry.
	const displayReadySlugs = $derived.by(() => {
		const ready = new Set<string>();
		let seqOk = true;
		for (let i = 0; i < sorted.length; i++) {
			const photo = sorted[i];
			const loaded = loadedSlugs.has(photo.slug);
			const userHere = i <= activeIndex;
			if (loaded && (seqOk || userHere)) {
				ready.add(photo.slug);
				seqOk = true;
			} else if (!loaded) {
				seqOk = false;
			}
		}
		return ready;
	});

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

	function markThumbLoaded(slug: string) {
		if (thumbLoadedSlugs.has(slug)) return;
		const next = new Set(thumbLoadedSlugs);
		next.add(slug);
		thumbLoadedSlugs = next;
	}

	// Mirrors fadeInOnLoad but for the thumbnail — only needed to dismiss the skeleton.
	function thumbFadeInOnLoad(node: HTMLImageElement, slug: string) {
		const done = () => markThumbLoaded(slug);
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

	function checkSlowConn(): boolean {
		type NavConn = Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
		const conn = (navigator as NavConn).connection;
		if (!conn) return false;
		return conn.saveData === true || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
	}

	// Предзагрузка окна вперёд относительно текущего активного фото.
	// Перезапускается при вовлечении и при каждой смене activeIndex.
	$effect(() => {
		if (!engaged || sorted.length === 0) return;

		const start = activeIndex + 1;
		const thumbs = sorted.slice(start, start + thumbLookahead).map((p) => imgUrl(p.thumb));
		// On confirmed slow connections (Network Information API, Chrome/Android only)
		// skip original prefetch — let the first photo finish downloading first.
		const originals = checkSlowConn()
			? []
			: sorted.slice(start, start + originalLookahead).map((p) => imgUrl(p.original));

		// thumbs first (tiny, instant placeholder), then nearest originals
		prefetchImages([...thumbs, ...originals]);
	});

	function fileName(photo: PhotoManifestEntry): string {
		return photo.original.split('/').pop() ?? `${photo.slug}.webp`;
	}

	function photoSize(photo: PhotoManifestEntry): string {
		const value = Number.isFinite(photo.scalePercent) ? photo.scalePercent : 100;
		return `${Math.max(1, Math.min(100, Math.round(value)))}%`;
	}

	// Стартовое смещение для scroll-reveal (только ПК/планшет; на телефонах CSS
	// принудительно делает «снизу»). Возвращаем пару "x, y" для translate3d().
	// Раньше направление задавалось динамическим классом from-{revealFrom}, но
	// Svelte вырезал такие селекторы как «неиспользуемые» (имя класса собиралось
	// в рантайме) — поэтому reveal-сторона не применялась. Через CSS-переменную
	// проблема исчезает: никаких динамических классов.
	function revealFromVar(dir: PhotoManifestEntry['revealFrom']): string {
		switch (dir) {
			case 'left':
				return '-9vw, 0';
			case 'right':
				return '9vw, 0';
			case 'top':
				return '0, -7vh';
			case 'bottom':
			default:
				return '0, 7vh';
		}
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

	let backToTopRaf = 0;

	/**
	 * Плавная прокрутка к верху своими руками (requestAnimationFrame).
	 * Зачем не нативный behavior:'smooth' на тач-устройствах: iOS-Safari местами
	 * его игнорирует (телепорт), а прокрутка через множество секций провоцирует
	 * лавину IntersectionObserver-колбэков и CSS-переходов. Поэтому делаем
	 * собственную анимацию с фиксированной (короткой) длительностью: одинаково
	 * плавно во всех браузерах и достаточно быстро, чтобы не копить джанк.
	 */
	function smoothScrollToTop(duration = 600) {
		if (!browser) return;
		const startY = window.scrollY || window.pageYOffset;
		if (startY <= 0) return;
		const start = performance.now();
		const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

		if (backToTopRaf) cancelAnimationFrame(backToTopRaf);

		const step = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			window.scrollTo(0, Math.round(startY * (1 - easeOutCubic(progress))));
			if (progress < 1) {
				backToTopRaf = requestAnimationFrame(step);
			} else {
				backToTopRaf = 0;
			}
		};
		backToTopRaf = requestAnimationFrame(step);
	}

	function backToTop() {
		// На тач-устройствах ведём собственную rAF-анимацию (нативный smooth там
		// телепортит); на десктопе/планшете оставляем секционный smooth scroll.
		if (browser && window.matchMedia('(hover: none)').matches) {
			smoothScrollToTop();
		} else {
			scrollToIndex(0);
		}
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

		// Reduce prefetch aggressiveness on touch devices to avoid bandwidth competition
		// with the hero photo's original loading.
		const isTouchDevice = window.matchMedia('(hover: none)').matches;
		if (isTouchDevice) {
			thumbLookahead = 4;
			originalLookahead = 1;
		}

		// Warm the first few thumbs immediately — they're tiny and don't compete
		// with the hero's original. Ensures thumb appears instantly when user scrolls.
		const earlyThumbs = sorted.slice(1, isTouchDevice ? 3 : 4).map((p) => imgUrl(p.thumb));
		if (earlyThumbs.length > 0) prefetchImages(earlyThumbs, 3);

		const observer = new IntersectionObserver(
			(entries) => {
				let mostVisible: IntersectionObserverEntry | undefined;
				// Only allocate a new Set when we actually have new slugs to add.
				// visibleSlugs is append-only (once visible = keep loading), so we skip
				// the copy entirely when nothing changes — avoids Svelte re-renders on
				// every scroll event, which is the main source of mobile jank.
				let hasNewSlug = false;

				for (const entry of entries) {
					const slug = (entry.target as HTMLElement).dataset.slug;
					if (entry.isIntersecting && slug && !visibleSlugs.has(slug)) {
						hasNewSlug = true;
					}
					if (
						entry.isIntersecting &&
						(!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio)
					) {
						mostVisible = entry;
					}
				}

				if (hasNewSlug) {
					const nextVisible = new Set(visibleSlugs);
					for (const entry of entries) {
						const slug = (entry.target as HTMLElement).dataset.slug;
						if (entry.isIntersecting && slug) nextVisible.add(slug);
					}
					visibleSlugs = nextVisible;
				}

				if (mostVisible) {
					const nextIndex = Number((mostVisible.target as HTMLElement).dataset.index);
					if (!Number.isNaN(nextIndex) && nextIndex !== activeIndex) activeIndex = nextIndex;
				}
			},
			// Single threshold: one callback per section per scroll direction.
			// Three thresholds fired 3× per section — during scroll-back through 10+
			// sections that was 30+ callbacks/s triggering Svelte reactivity on iOS.
			{ threshold: 0.5 }
		);

		sections.forEach((section) => observer.observe(section));

		// Начинаем фоновую предзагрузку только когда пользователь реально вовлечён
		// (залип на видимой вкладке ~3.5с либо начал скроллить). Так первый,
		// видимый кадр не конкурирует за сеть с предзагрузкой следующих.
		const stopEngagement = trackEngagement({
			// При скролле включаем предзагрузку почти сразу (скролл = явное намерение
			// смотреть дальше), пассивный зритель — через несколько секунд залипания.
			scrollEngageMs: 400,
			onEngaged: () => {
				engaged = true;
			}
		});

		return () => {
			observer.disconnect();
			stopEngagement();
			if (backToTopRaf) cancelAnimationFrame(backToTopRaf);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	{#if sorted.length > 0}
		<link rel="preload" as="image" href={imgUrl(sorted[0].thumb)} />
		<link rel="preload" as="image" href={imgUrl(sorted[0].original)} fetchpriority="high" />
	{/if}
</svelte:head>

{#if sorted.length === 0}
	<div class="empty">{$t('No photos available')}</div>
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
				class="photo-section"
				class:is-visible={index === 0 || visibleSlugs.has(photo.slug)}
				data-photo-section
				data-index={index}
				data-slug={photo.slug}
				style={`--photo-x: ${photo.positionX}%; --photo-y: ${photo.positionY}%; --photo-offset-x: -${photo.positionX}%; --photo-offset-y: -${photo.positionY}%; --photo-size: ${photoSize(photo)}; --reveal-from: ${revealFromVar(photo.revealFrom)};`}
			>
				<button
					type="button"
					class="image-trigger"
					aria-label="Show next photo"
					onclick={goNext}
				>
					<!-- Shimmer skeleton: shown while neither thumb nor original has loaded.
					     Prevents the section from looking empty (only filename) on slow connections. -->
					<span
						class="photo-skeleton"
						class:is-loaded={thumbLoadedSlugs.has(photo.slug) || displayReadySlugs.has(photo.slug)}
						aria-hidden="true"
					></span>
					<!-- Лёгкое размытое превью (thumb) под оригиналом: показывается мгновенно,
					     пока грузится полный кадр. Декоративное → aria-hidden. -->
					<img
						src={imgUrl(photo.thumb)}
						alt=""
						aria-hidden="true"
						class="photo-thumb"
						class:is-hidden={displayReadySlugs.has(photo.slug)}
						loading={index === 0 ? 'eager' : 'lazy'}
						fetchpriority={index === 0 ? 'high' : 'auto'}
						decoding="async"
						draggable="false"
						use:thumbFadeInOnLoad={photo.slug}
					/>
					<img
						src={imgUrl(photo.original)}
						alt={photo.title}
						class="photo-image"
						class:is-loaded={displayReadySlugs.has(photo.slug)}
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
		/* svh = small viewport height: stable on iOS regardless of address-bar visibility.
		   dvh changes on every scroll frame when the iOS toolbar shows/hides, causing
		   continuous layout reflow on all visible sections simultaneously. */
		min-height: calc(100vh - var(--site-header-height));
		min-height: calc(100svh - var(--site-header-height));
		background: #ffffff;
		color: #111111;
		user-select: none;
		/* Tell iOS to handle vertical panning natively without waiting for JS. */
		touch-action: pan-y;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - var(--site-header-height));
		min-height: calc(100svh - var(--site-header-height));
		background: #ffffff;
		color: #111111;
		font-size: 1rem;
	}

	.photo-section {
		min-height: calc(100vh - var(--site-header-height));
		min-height: calc(100svh - var(--site-header-height));
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 0.7rem;
		padding: 0 0 1rem;
		scroll-snap-align: start;
		opacity: 0;
		/* Сторона reveal приходит инлайном через --reveal-from ("x, y").
		   Fallback "0, 40px" — на случай отсутствия переменной. */
		transform: translate3d(var(--reveal-from, 0, 40px), 0);
		transition:
			opacity 260ms ease,
			transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
		content-visibility: auto;
		/* Match svh so contain-intrinsic-size stays stable when iOS toolbar toggles. */
		contain-intrinsic-size: calc(100svh - var(--site-header-height)) 100vw;
	}

	.photo-section.is-visible {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	.image-trigger {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: calc(100vh - var(--site-header-height) - 3rem);
		min-height: calc(100svh - var(--site-header-height) - 3rem);
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
		/* object-position двигает сам кадр внутри «контейн»-бокса (letterbox).
		   Это и есть рабочая композиция: при scale=100 бокс совпадает с секцией,
		   и только object-position способен сместить картинку влево/вправо/вверх/вниз.
		   translate ниже доводит композицию для уменьшенных кадров (scale<100). */
		object-position: var(--photo-x) var(--photo-y);
		transform: translate(var(--photo-offset-x), var(--photo-offset-y));
		pointer-events: none;
	}

	/* Полный кадр проявляется плавно поверх размытого превью.
	   Короткий мягкий ease-out: плавно, но без «залипания» в полупрозрачном виде. */
	.photo-image {
		z-index: 2;
		opacity: 0;
		transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity;
	}

	.photo-image.is-loaded {
		opacity: 1;
	}

	/* Размытое превью под оригиналом.
	   - умеренный блюр (не «каша»), scale прячет прозрачные поля object-contain;
	   - mask-image едва растушёвывает самый край, чтобы блюр не обрывался жёсткой
	     рамкой о белый фон (без эффекта виньетки). */
	.photo-thumb {
		z-index: 1;
		filter: blur(5px);
		transform: translate(var(--photo-offset-x), var(--photo-offset-y)) scale(1.06);
		-webkit-mask-image: radial-gradient(ellipse 98% 98% at 50% 50%, #000 90%, transparent 100%);
		mask-image: radial-gradient(ellipse 98% 98% at 50% 50%, #000 90%, transparent 100%);
		/* Простой быстрый кросс-фейд с оригиналом, без задержки. */
		transition: opacity 500ms ease;
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

	/* Shimmer placeholder shown while the first image (thumb or original) hasn't loaded.
	   Occupies the same slot as the images using the same CSS variables. */
	.photo-skeleton {
		position: absolute;
		left: var(--photo-x);
		top: var(--photo-y);
		width: var(--photo-size);
		height: var(--photo-size);
		transform: translate(var(--photo-offset-x), var(--photo-offset-y));
		z-index: 0;
		border-radius: 2px;
		background: linear-gradient(90deg, #eeeeee 25%, #e4e4e4 50%, #eeeeee 75%);
		background-size: 200% 100%;
		animation: photo-slider-shimmer 1.8s ease-in-out infinite;
		transition: opacity 300ms ease;
	}

	.photo-skeleton.is-loaded {
		opacity: 0;
		pointer-events: none;
		animation: none;
	}

	@keyframes photo-slider-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
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
		.photo-section {
			/* Телефоны: reveal всегда «снизу» (игнорируем --reveal-from). */
			transform: translate3d(0, 30px, 0);
			transition:
				opacity 220ms ease,
				transform 300ms ease;
			/* content-visibility: auto can cause scroll-position jumps on iOS when
			   previously-skipped sections re-render during scroll-back. The browser's
			   intrinsic-size estimate may not match the real painted height, causing
			   the scroll anchor to shift. On mobile the sections are full-screen anyway
			   so the paint-skip benefit is minimal. */
			content-visibility: visible;
		}

		.photo-section.is-visible {
			transform: translate3d(0, 0, 0);
		}

		/* На телефонах композиция (Horizontal/Vertical) НЕ применяется — кадр всегда
		   по центру (как и reveal, который на телефонах всегда «снизу»). Масштаб
		   (--photo-size) сохраняем. */
		.photo-image,
		.photo-thumb,
		.photo-skeleton {
			left: 50%;
			top: 50%;
			object-position: center center;
			transform: translate(-50%, -50%);
		}

		.photo-thumb {
			transform: translate(-50%, -50%) scale(1.06);
		}

		.image-trigger {
			min-height: calc(100vh - var(--site-header-height) - 2.75rem);
			min-height: calc(100svh - var(--site-header-height) - 2.75rem);
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
		.photo-section {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.photo-skeleton {
			animation: none;
			background: #eeeeee;
		}
	}
</style>
