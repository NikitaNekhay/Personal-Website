<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
	let isOpen = $state(false);
	let isHovered = $state(false);

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

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isOpen = !isOpen;
	}
</script>

<span class="guide">
	<button
		bind:this={buttonEl}
		type="button"
		class="guide-button"
		aria-label="Show field guide"
		aria-expanded={isVisible}
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		onclick={toggle}
		onblur={() => (isOpen = false)}
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
