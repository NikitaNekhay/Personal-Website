<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { prefetchImages } from '../../services/imagePreload';
	import type { PhotoManifestEntry } from '../../shared/types';

	interface Props {
		photos: PhotoManifestEntry[];
		/** Global parallax intensity 0–100 (50 = baseline). */
		parallaxIntensity?: number;
	}

	let { photos, parallaxIntensity = 50 }: Props = $props();

	let rootEl = $state<HTMLDivElement | undefined>();

	// slug-sets driving the per-image load states (skeleton → blurred thumb → original)
	let loadedSlugs = $state<Set<string>>(new Set());
	let thumbLoadedSlugs = $state<Set<string>>(new Set());
	// slugs whose block has entered the viewport at least once (entrance animation)
	let visibleSlugs = $state<Set<string>>(new Set());

	// Phones get a clean single column (CSS) + gentler parallax. Set in onMount.
	let isMobile = $state(false);
	let reduceMotion = $state(false);

	// "Back to top" button — shown once the user has scrolled down a screenful.
	let showBackToTop = $state(false);

	const sorted = $derived([...photos].sort((a, b) => a.order - b.order));

	function imgUrl(path: string): string {
		const photoPath = path.replace(/^\/?photos\//, '');
		return `${base}/api/photos/image/${photoPath}`;
	}

	// Deterministic pseudo-random in [0,1) from a string — keeps parallax speeds
	// varied yet stable across renders (no two neighbours move identically).
	function hash01(s: string): number {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		return ((h >>> 0) % 1000) / 1000;
	}

	// Signed per-photo drift factor: some images drift up faster, some slower.
	function speedFor(slug: string): number {
		const magnitude = 0.05 + hash01(slug) * 0.1; // 0.05..0.15
		const dir = hash01(slug + ':d') < 0.5 ? -1 : 1;
		return magnitude * dir;
	}

	function aspectRatio(photo: PhotoManifestEntry): number {
		if (photo.width > 0 && photo.height > 0) return photo.width / photo.height;
		return 0.75; // sensible portrait fallback
	}

	// Scroll-reveal offset per manifest revealFrom direction. Returns the "x, y" pair
	// for translate3d(). Horizontal kept smaller than vertical (minimal sideways drift).
	function revealFromVar(dir: PhotoManifestEntry['revealFrom']): string {
		switch (dir) {
			case 'left':
				return '-5vw, 0';
			case 'right':
				return '5vw, 0';
			case 'top':
				return '0, -6vh';
			case 'bottom':
			default:
				return '0, 6vh';
		}
	}

	// Inline CSS variables for a block: vertical gap, scale, horizontal placement,
	// stacking order, intrinsic aspect ratio and reveal direction. Mobile layout
	// is handled in CSS.
	function blockStyle(photo: PhotoManifestEntry, index: number): string {
		const gap = index === 0 ? Math.min(photo.spacing, 8) : photo.spacing;
		return [
			`--gap: ${gap}`,
			`--w: ${photo.scalePercent}`,
			`--x: ${photo.positionX}`,
			`--layer: ${photo.layer}`,
			`--ar: ${aspectRatio(photo)}`,
			`--reveal-from: ${revealFromVar(photo.revealFrom)}`
		].join('; ');
	}

	function dataSpeed(slug: string): number {
		const factor = speedFor(slug);
		return isMobile ? factor * 0.4 : factor;
	}

	// ---- load tracking (skeleton/thumb/original) ---------------------------
	function markLoaded(slug: string) {
		if (loadedSlugs.has(slug)) return;
		const next = new Set(loadedSlugs);
		next.add(slug);
		loadedSlugs = next;
	}

	function markThumbLoaded(slug: string) {
		if (thumbLoadedSlugs.has(slug)) return;
		const next = new Set(thumbLoadedSlugs);
		next.add(slug);
		thumbLoadedSlugs = next;
	}

	function fadeInOnLoad(node: HTMLImageElement, slug: string) {
		const done = () => markLoaded(slug);
		if (node.complete && node.naturalWidth > 0) done();
		else node.addEventListener('load', done, { once: true });
		return {
			destroy() {
				node.removeEventListener('load', done);
			}
		};
	}

	function thumbFadeInOnLoad(node: HTMLImageElement, slug: string) {
		const done = () => markThumbLoaded(slug);
		if (node.complete && node.naturalWidth > 0) done();
		else node.addEventListener('load', done, { once: true });
		return {
			destroy() {
				node.removeEventListener('load', done);
			}
		};
	}

	// ---- scroll-driven parallax --------------------------------------------
	let rafId = 0;
	let rafQueued = false;

	function applyParallax() {
		rafQueued = false;
		if (!rootEl) return;

		const viewportH = window.innerHeight;
		showBackToTop = window.scrollY > viewportH * 0.6;

		const intensity = Math.max(0, parallaxIntensity) / 50; // 50 = baseline ×1

		if (reduceMotion || intensity === 0) return;

		const blocks = rootEl.querySelectorAll<HTMLElement>('.photo-block');
		blocks.forEach((block) => {
			const rect = block.getBoundingClientRect();
			// only move blocks near/in the viewport
			if (rect.bottom < -viewportH || rect.top > viewportH * 2) return;
			const speed = Number(block.dataset.speed) || 0;
			const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
			const drift = -centerOffset * speed * intensity;
			block.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0)`;
		});
	}

	function scheduleParallax() {
		if (rafQueued) return;
		rafQueued = true;
		rafId = requestAnimationFrame(applyParallax);
	}

	// Custom rAF smooth-scroll to top — reliable on iOS where native
	// scrollTo({behavior:'smooth'}) can jump instantly.
	let backToTopRaf = 0;
	function backToTop() {
		if (!browser) return;
		const startY = window.scrollY;
		if (startY <= 0) return;
		const duration = 600;
		const start = performance.now();
		const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
		if (backToTopRaf) cancelAnimationFrame(backToTopRaf);
		const step = (now: number) => {
			const p = Math.min((now - start) / duration, 1);
			window.scrollTo(0, Math.round(startY * (1 - easeOutCubic(p))));
			if (p < 1) backToTopRaf = requestAnimationFrame(step);
			else backToTopRaf = 0;
		};
		backToTopRaf = requestAnimationFrame(step);
	}

	onMount(() => {
		if (!browser) return;

		isMobile = window.matchMedia('(max-width: 767px)').matches;
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Preload all thumbnails up front (tiny) + the first couple of originals.
		prefetchImages(sorted.map((p) => imgUrl(p.thumb)));
		prefetchImages(sorted.slice(0, 2).map((p) => imgUrl(p.original)));

		// Entrance: reveal each block once it scrolls into view.
		const io = new IntersectionObserver(
			(entries) => {
				let changed = false;
				const next = new Set(visibleSlugs);
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const slug = (entry.target as HTMLElement).dataset.slug;
						if (slug && !next.has(slug)) {
							next.add(slug);
							changed = true;
							io.unobserve(entry.target);
						}
					}
				}
				if (changed) visibleSlugs = next;
			},
			{ rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
		);

		const blocks = rootEl?.querySelectorAll<HTMLElement>('.photo-block') ?? [];
		blocks.forEach((b) => io.observe(b));

		window.addEventListener('scroll', scheduleParallax, { passive: true });
		window.addEventListener('resize', scheduleParallax);
		applyParallax();

		return () => {
			io.disconnect();
			window.removeEventListener('scroll', scheduleParallax);
			window.removeEventListener('resize', scheduleParallax);
			if (rafId) cancelAnimationFrame(rafId);
			if (backToTopRaf) cancelAnimationFrame(backToTopRaf);
		};
	});
</script>

{#if sorted.length === 0}
	<div class="empty">No photos yet.</div>
{:else}
	<div class="canvas" bind:this={rootEl}>
		{#each sorted as photo, index (photo.slug)}
			<div
				class="photo-block"
				data-slug={photo.slug}
				data-speed={dataSpeed(photo.slug)}
				style={blockStyle(photo, index)}
			>
				<div class="photo-place">
					<figure
						class="photo-reveal"
						class:in-view={visibleSlugs.has(photo.slug) || reduceMotion}
					>
						<span
							class="photo-skeleton"
							class:is-loaded={thumbLoadedSlugs.has(photo.slug) || loadedSlugs.has(photo.slug)}
							aria-hidden="true"
						></span>
						<img
							src={imgUrl(photo.thumb)}
							alt=""
							aria-hidden="true"
							class="photo-thumb"
							class:is-hidden={loadedSlugs.has(photo.slug)}
							loading={index < 2 ? 'eager' : 'lazy'}
							fetchpriority={index === 0 ? 'high' : 'auto'}
							decoding="async"
							draggable="false"
							use:thumbFadeInOnLoad={photo.slug}
						/>
						<img
							src={imgUrl(photo.original)}
							alt={photo.title}
							class="photo-image"
							class:is-loaded={loadedSlugs.has(photo.slug)}
							loading={index < 2 ? 'eager' : 'lazy'}
							fetchpriority={index === 0 ? 'high' : 'auto'}
							decoding="async"
							draggable="false"
							use:fadeInOnLoad={photo.slug}
						/>
					</figure>
				</div>
			</div>
		{/each}
	</div>

	<button
		type="button"
		class="back-to-top"
		class:is-visible={showBackToTop}
		onclick={backToTop}
	>
		Back to top
	</button>
{/if}

<style>
	.canvas {
		position: relative;
		/* Own stacking context so per-photo `layer` (z-index up to 100) stays
		   contained BELOW the site scrollbar / bookmark / back-to-top, which live
		   at the root. */
		z-index: 0;
		isolation: isolate;
		width: 100%;
		background: #ffffff;
		padding-bottom: 22vh;
		overflow-x: clip;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100svh - var(--site-header-height));
		background: #ffffff;
		color: #666;
		font-size: 1rem;
	}

	/* Full-width row + parallax target — the JS rAF loop only writes a vertical
	   `transform` here, so it never fights the placement/entrance transforms below. */
	.photo-block {
		position: relative;
		width: 100%;
		margin-top: calc(var(--gap, 40) * 1vh);
		z-index: var(--layer, 0);
		will-change: transform;
	}

	/* Horizontal placement across the free space, hugging the image:
	   margin-left positions the left edge at x% of the row, translateX pulls back
	   x% of the block's OWN width → 0 = flush left, 50 = centred, 100 = flush right.
	   (Static transform; separate element from parallax + entrance.) */
	.photo-place {
		width: max-content;
		max-width: 96vw;
		margin-left: calc(var(--x, 50) * 1%);
		transform: translateX(calc(var(--x, 50) * -1%));
	}

	/* Sizing is height-driven (like the old contain box) so default photos stay
	   compact — about one screen tall at scale 100, never taller. BOTH width and
	   height are explicit lengths (a block element with width:auto would otherwise
	   stretch to the full container width, ignoring scale). They are derived from
	   the same min() so the photo's aspect ratio is preserved, and the width is
	   also bounded to ~92vw for wide images. */
	.photo-reveal {
		position: relative;
		display: block;
		margin: 0;
		aspect-ratio: var(--ar, 0.75);
		width: min(
			calc(var(--w, 100) / 100 * (100svh - var(--site-header-height)) * var(--ar, 0.75)),
			calc(var(--w, 100) / 100 * 92vw)
		);
		height: min(
			calc(var(--w, 100) / 100 * (100svh - var(--site-header-height))),
			calc(var(--w, 100) / 100 * 92vw / var(--ar, 0.75))
		);
		opacity: 0;
		transform: translate3d(var(--reveal-from, 0, 6vh), 0);
		transition:
			opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity, transform;
	}

	.photo-reveal.in-view {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	.photo-image,
	.photo-thumb,
	.photo-skeleton {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	.photo-image,
	.photo-thumb {
		object-fit: cover;
		object-position: center center;
		pointer-events: none;
	}

	.photo-image {
		z-index: 2;
		opacity: 0;
		transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity;
	}

	.photo-image.is-loaded {
		opacity: 1;
	}

	.photo-thumb {
		z-index: 1;
		filter: blur(6px);
		transform: scale(1.06);
		transition: opacity 500ms ease;
	}

	.photo-thumb.is-hidden {
		opacity: 0;
	}

	.photo-skeleton {
		z-index: 0;
		background: linear-gradient(90deg, #eeeeee 25%, #e4e4e4 50%, #eeeeee 75%);
		background-size: 200% 100%;
		animation: editorial-shimmer 1.8s ease-in-out infinite;
		transition: opacity 300ms ease;
	}

	.photo-skeleton.is-loaded {
		opacity: 0;
		pointer-events: none;
		animation: none;
	}

	@keyframes editorial-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* "Back to top" — offset clear of the right-edge custom scrollbar. */
	.back-to-top {
		position: fixed;
		right: 1.75rem;
		bottom: 0.6rem;
		z-index: 45;
		padding: 0;
		border: 0;
		background: transparent;
		color: rgba(0, 0, 0, 0.58);
		font-family: monospace;
		font-size: 0.75rem;
		line-height: 1;
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

	/* Phones: clean single column. No manifest composition (placement/scale/overlap);
	   keep the vertical spacing rhythm + entrance motion (always from bottom). */
	@media (max-width: 767px) {
		.photo-place {
			width: 92vw;
			max-width: 92vw;
			margin-left: 4vw;
			transform: none;
		}

		.photo-reveal {
			height: auto;
			width: 100%;
			transform: translate3d(0, 5vh, 0);
		}

		.photo-reveal.in-view {
			transform: translate3d(0, 0, 0);
		}

		.photo-block {
			z-index: auto;
		}

		.back-to-top {
			right: 1.5rem;
			bottom: 0.5rem;
			font-size: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.photo-image {
			opacity: 1;
			transition: none;
		}

		.photo-thumb {
			transition: none;
		}

		.photo-skeleton {
			animation: none;
			background: #eeeeee;
		}
	}
</style>
