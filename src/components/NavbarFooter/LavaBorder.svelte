<script lang="ts">
	// «Пиксельная лава» ПОВЕРХ самого тёмно-синего бордюра хедера.
	// Идея — как лава в Minecraft: сетка квадратных «блоков» стоит на месте,
	// а сквозь неё ОЧЕНЬ медленно перетекает яркий цвет (вверх-вниз, с инерцией,
	// ease-in-out alternate) — это не «ручей», а медленное бурление.
	//
	// Привязка к бордюру:
	//  • ширина полосы = ширине border (4px на ПК, 6px на ≤1023) и она смещена
	//    отрицательно (left/right: -bw), чтобы лечь ИМЕННО на синюю кромку,
	//    а не внутрь паддинга.
	//  • квадратики делаются через пересечение двух масок (mask-composite),
	//    размер ячейки фиксированный в px → «пиксели» крошечные и привязаны к полосе.
	// Анимация работает ТОЛЬКО при active — в покое ничего не композитится.
	export let side: 'left' | 'right' = 'left';
	export let active = false;
</script>

<span class="lava {side}" class:active aria-hidden="true">
	<span class="lava-fill"></span>
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
		/* видна только серединка по высоте, у концов растворяется */
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			#000 32%,
			#000 68%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			#000 32%,
			#000 68%,
			transparent 100%
		);
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

	.lava-fill,
	.lava-fill::after {
		content: '';
		position: absolute;
		inset: 0;
		/* === КВАДРАТНЫЕ ПИКСЕЛИ ===
		   пересечение вертикальных и горизонтальных полос даёт сетку
		   квадратиков 1px на шаге 2px (≈25% заполнения). */
		-webkit-mask-image:
			repeating-linear-gradient(to right, #000 0 1px, transparent 1px 2px),
			repeating-linear-gradient(to bottom, #000 0 1px, transparent 1px 2px);
		mask-image:
			repeating-linear-gradient(to right, #000 0 1px, transparent 1px 2px),
			repeating-linear-gradient(to bottom, #000 0 1px, transparent 1px 2px);
		-webkit-mask-composite: source-in;
		mask-composite: intersect;
		image-rendering: pixelated;
	}

	/* нижний слой: яркая лавовая «лента» цвета, бесшовно зацикленная по вертикали */
	.lava-fill {
		background-image: repeating-linear-gradient(
			to bottom,
			#7a1f00 0%,
			#ff5e00 16%,
			#ffae00 30%,
			#ffe85c 42%,
			#ffae00 54%,
			#ff5e00 70%,
			#7a1f00 88%
		);
		background-size: 100% 240%;
		background-position: 0 0;
		filter: saturate(1.25) brightness(1.12);
	}

	/* верхний слой: бело-жёлтые «искры», другой период → биения = псевдослучайное мерцание */
	.lava-fill::after {
		background-image: repeating-linear-gradient(
			to bottom,
			#fff6c0 0%,
			transparent 38%,
			#ffd24a 58%,
			transparent 100%
		);
		background-size: 100% 175%;
		background-position: 0 1px;
		mix-blend-mode: screen;
		opacity: 0.4;
	}

	/* движение только пока активно: медленное бурление вверх-вниз с инерцией */
	.lava.active .lava-fill {
		animation: lavaChurn 11s ease-in-out infinite alternate;
	}
	.lava.active .lava-fill::after {
		animation: lavaTwinkle 7.5s ease-in-out infinite alternate;
	}

	@keyframes lavaChurn {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 0 -140%;
		}
	}
	@keyframes lavaTwinkle {
		from {
			background-position: 0 1px;
			opacity: 0.22;
		}
		to {
			background-position: 0 -95%;
			opacity: 0.62;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lava.active .lava-fill,
		.lava.active .lava-fill::after {
			animation: none;
		}
	}
</style>
