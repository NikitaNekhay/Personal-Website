<script module lang="ts">
	// Глобальное (на весь модуль) состояние: id единственной открытой подсказки.
	// Любая открытая подсказка пишет сюда свой id, остальные мгновенно
	// закрываются — гарантия «не больше одной открытой за раз».
	let activeGuideId = $state<number | null>(null);
	let guideCounter = 0;
</script>

<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	const myId = ++guideCounter; // уникальный id этого экземпляра
	let isHovered = $state(false);

	// «Закреплено» (открыто кликом/тапом) — только если глобальный id наш.
	const isOpen = $derived(activeGuideId === myId);
	const isVisible = $derived(isOpen || isHovered);

	// Подсказка позиционируется через position:fixed, чтобы НЕ обрезаться
	// родителями с overflow:hidden (инпуты на /create именно так её и прятали).
	let buttonEl = $state<HTMLButtonElement | undefined>();
	let popoverEl = $state<HTMLElement | undefined>();
	let top = $state(0);
	let left = $state(0);
	let arrowX = $state(0);
	let placeAbove = $state(true);
	let ready = $state(false); // прячем до расчёта координат — без «прыжка» из 0,0

	function reposition() {
		if (!buttonEl || !popoverEl) return;
		const r = buttonEl.getBoundingClientRect();
		const pw = popoverEl.offsetWidth;
		const ph = popoverEl.offsetHeight;
		const gap = 7;
		const margin = 8;

		// предпочитаем показ сверху; если места нет — снизу
		placeAbove = r.top >= ph + gap + margin;
		top = placeAbove ? r.top - ph - gap : r.bottom + gap;

		const centerX = r.left + r.width / 2;
		let l = centerX - pw / 2;
		l = Math.max(margin, Math.min(l, window.innerWidth - pw - margin));
		left = l;

		// стрелка указывает на кнопку, даже если подсказку прижали к краю экрана
		arrowX = Math.max(12, Math.min(centerX - l, pw - 12));
		ready = true;
	}

	$effect(() => {
		if (!isVisible) {
			ready = false;
			return;
		}
		reposition();
		const onMove = () => reposition();
		window.addEventListener('scroll', onMove, true);
		window.addEventListener('resize', onMove);
		return () => {
			window.removeEventListener('scroll', onMove, true);
			window.removeEventListener('resize', onMove);
		};
	});

	// Пока подсказка закреплена (открыта тапом/кликом) — слушаем весь документ:
	// любой клик/тап/скролл вне самой кнопки закрывает её. Слушатель навешивает
	// ТОЛЬКО открытый экземпляр, поэтому он на странице ровно один.
	$effect(() => {
		if (!isOpen) return;
		const onDocPointerDown = (e: Event) => {
			// клик по собственной кнопке обрабатывает toggle() — его не трогаем
			if (buttonEl && buttonEl.contains(e.target as Node)) return;
			activeGuideId = null;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') activeGuideId = null;
		};
		// capture: ловим до того, как клик «съест» что-то ниже
		document.addEventListener('pointerdown', onDocPointerDown, true);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onDocPointerDown, true);
			document.removeEventListener('keydown', onKey);
		};
	});

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		activeGuideId = isOpen ? null : myId;
	}

	function onPointerEnter(e: PointerEvent) {
		// только настоящая мышь: на тач/пере «hover» залипает и плодит баги
		if (e.pointerType !== 'mouse') return;
		// навели на ЧУЖУЮ закреплённую подсказку — закрываем её (одна за раз)
		if (!isOpen) activeGuideId = null;
		isHovered = true;
	}

	function onPointerLeave(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		isHovered = false;
	}
</script>

<span class="guide">
	<button
		bind:this={buttonEl}
		type="button"
		class="guide-button"
		aria-label="Show field guide"
		aria-expanded={isVisible}
		onpointerenter={onPointerEnter}
		onpointerleave={onPointerLeave}
		onclick={toggle}
	>
		<img src="{base}/media/info.svg" alt="" />
	</button>
	{#if isVisible}
		<span
			bind:this={popoverEl}
			class="guide-popover"
			class:place-above={placeAbove}
			class:place-below={!placeAbove}
			class:ready
			role="tooltip"
			style="top:{top}px; left:{left}px; --arrow-x:{arrowX}px;"
		>
			{text}
		</span>
	{/if}
</span>

<style>
	.guide {
		position: relative;
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
	}

	.guide-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: help;
		color: #241e4e;
		opacity: 0.78;
	}

	.guide-button:hover,
	.guide-button:focus-visible {
		opacity: 1;
		outline: none;
	}

	.guide-button img {
		width: 0.95rem;
		height: 0.95rem;
		display: block;
	}

	.guide-popover {
		/* fixed + высокий z-index: подсказка всегда поверх инпутов, но НИЖЕ
		   шапки (z-50) и меню (z-60) — как просили. Не обрезается overflow. */
		position: fixed;
		z-index: 40;
		width: min(16rem, 78vw);
		padding: 0.55rem 0.65rem;
		border: 1px solid #f6ae2d;
		border-radius: 6px;
		background: #ffffff;
		color: #241e4e;
		box-shadow: 0 12px 28px rgba(36, 30, 78, 0.16);
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.35;
		text-align: left;
		white-space: normal;
		pointer-events: none;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.guide-popover.ready {
		opacity: 1;
	}

	.guide-popover::after {
		content: '';
		position: absolute;
		left: var(--arrow-x);
		width: 0.55rem;
		height: 0.55rem;
		transform: translate(-50%, -50%) rotate(45deg);
		background: #ffffff;
	}

	/* подсказка сверху — стрелка снизу, смотрит вниз */
	.guide-popover.place-above::after {
		top: 100%;
		border-right: 1px solid #f6ae2d;
		border-bottom: 1px solid #f6ae2d;
	}

	/* подсказка снизу — стрелка сверху, смотрит вверх */
	.guide-popover.place-below::after {
		top: 0;
		border-left: 1px solid #f6ae2d;
		border-top: 1px solid #f6ae2d;
	}
</style>
