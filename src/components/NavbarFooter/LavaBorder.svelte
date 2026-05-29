<script lang="ts">
	// «Пиксельная лава» ПОВЕРХ самого тёмно-синего бордюра хедера.
	// Не сплошная сетка, а отдельные квадратики РАЗНОГО размера, разреженные,
	// только в средней части полосы (по краям их нет), одного жёлтого цвета
	// (#f6ae2d — как подсветка активной ссылки). Каждый медленно «дышит»
	// со своим периодом/задержкой → несинхронное бурление, не ручей.
	// Полоса лежит ИМЕННО на синей кромке (отрицательное смещение на толщину
	// бордюра) и по ширине равна ему (4px ПК / 6px ≤1023).
	export let side: 'left' | 'right' = 'left';
	export let active = false;

	// t — позиция по высоте (%), l — сдвиг по ширине полосы (px),
	// s — размер квадрата (px), dur/delay — период и фаза «дыхания».
	const dots = [
		{ t: 26, l: 0, s: 3, dur: 7.5, delay: 0 },
		{ t: 34, l: 2, s: 2, dur: 9, delay: 1.3 },
		{ t: 43, l: 1, s: 5, dur: 11, delay: 0.6 },
		{ t: 50, l: 3, s: 2, dur: 6.5, delay: 2.1 },
		{ t: 57, l: 0, s: 4, dur: 10, delay: 0.2 },
		{ t: 66, l: 2, s: 3, dur: 8.5, delay: 1.7 },
		{ t: 73, l: 1, s: 2, dur: 7, delay: 0.9 }
	];
</script>

<span class="lava {side}" class:active aria-hidden="true">
	{#each dots as d}
		<span
			class="pix"
			style="--t:{d.t}%;--l:{d.l}px;--s:{d.s}px;--dur:{d.dur}s;--delay:{d.delay}s"
		></span>
	{/each}
</span>

<style>
	.lava {
		position: absolute;
		top: 0;
		bottom: 0;
		/* ширина = толщине бордюра на ПК (border-x-4) */
		width: 4px;
		pointer-events: none;
		overflow: hidden;
		opacity: 0;
		transition: opacity 600ms ease;
	}

	/* лечь НА бордюр (отрицательное смещение на его толщину) */
	.lava.left {
		left: -4px;
	}
	.lava.right {
		right: -4px;
	}

	/* на ≤1023 бордюр толще (sm/md:border-x-[6px]) — полоса тоже */
	@media (min-width: 374px) and (max-width: 1023px) {
		.lava {
			width: 6px;
		}
		.lava.left {
			left: -6px;
		}
		.lava.right {
			right: -6px;
		}
	}

	.lava.active {
		opacity: 1;
	}

	.pix {
		position: absolute;
		top: var(--t);
		left: var(--l);
		width: var(--s);
		height: var(--s);
		background: #f6ae2d;
		border-radius: 0; /* строго квадрат */
		image-rendering: pixelated;
		transform: scale(0.6);
		opacity: 0.12;
		will-change: transform, opacity;
	}

	/* медленное несинхронное «дыхание» — только пока active */
	.lava.active .pix {
		animation: lavaPix var(--dur) ease-in-out var(--delay) infinite;
	}

	@keyframes lavaPix {
		0% {
			opacity: 0.12;
			transform: translateY(1px) scale(0.6);
		}
		50% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		100% {
			opacity: 0.12;
			transform: translateY(-1px) scale(0.6);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lava.active .pix {
			animation: none;
			opacity: 0.85;
			transform: none;
		}
	}
</style>
