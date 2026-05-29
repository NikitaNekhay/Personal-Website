<script lang="ts">
	// «Пиксельная лава» поверх вертикального бордюра хедера.
	// Дешёвый эффект: сетка мелких жёлтых точек, прокручиваемая через
	// background-position (GPU-friendly), маска оставляет только вертикальную
	// серединку (у концов гаснет). Анимация работает ТОЛЬКО когда active —
	// в покое не композитится и ничего не нагружает.
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
		width: 6px;
		pointer-events: none;
		overflow: hidden;
		opacity: 0;
		transition: opacity 600ms ease;
		/* видна только середина по высоте, у концов растворяется */
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			#000 30%,
			#000 70%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			#000 30%,
			#000 70%,
			transparent 100%
		);
	}

	.lava.left {
		left: 0;
	}
	.lava.right {
		right: 0;
	}

	.lava.active {
		opacity: 1;
	}

	.lava-fill {
		position: absolute;
		inset: -40% 0;
		/* две сетки мелких «пикселей» жёлтого/янтарного */
		background-image:
			radial-gradient(circle, #ffd071 0 42%, transparent 46%),
			radial-gradient(circle, #f6ae2d 0 42%, transparent 46%);
		background-size:
			3px 3px,
			3px 3px;
		background-position:
			0 0,
			1px 1px;
		image-rendering: pixelated;
		filter: saturate(1.15) brightness(1.05);
	}

	/* движение только пока активно */
	.lava.active .lava-fill {
		animation: lavaFlow 1.15s linear infinite;
	}

	@keyframes lavaFlow {
		to {
			background-position:
				0 -12px,
				1px -11px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lava.active .lava-fill {
			animation: none;
		}
	}
</style>
