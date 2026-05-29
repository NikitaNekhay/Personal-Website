<script lang="ts">
	// Анимированная иконка бургер ⇄ крестик.
	// open=false  → три линии (одна случайная чуть длиннее влево — намёк, что кликабельно)
	// open=true   → линии плавно складываются в «X»
	export let open = false;

	// Какая из трёх линий «выглядывает» в закрытом состоянии — выбираем один раз.
	const wide = Math.floor(Math.random() * 3);
</script>

<span class="burger" class:open aria-hidden="true">
	<span class="line line-0" class:wide={wide === 0}></span>
	<span class="line line-1" class:wide={wide === 1}></span>
	<span class="line line-2" class:wide={wide === 2}></span>
</span>

<style>
	.burger {
		position: relative;
		display: inline-block;
		width: 26px;
		height: 20px;
	}

	.line {
		position: absolute;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: currentColor;
		/* плавная смена состояния: длина, поворот, сдвиг, прозрачность */
		transition:
			width 320ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 360ms cubic-bezier(0.34, 1.4, 0.5, 1),
			opacity 220ms ease;
		transform-origin: center;
	}

	/* Закрытое состояние — «align-right»-бургер с разной длиной линий. */
	.line-0 {
		top: 2px;
		width: 26px;
	}
	.line-1 {
		top: 9px;
		width: 17px;
	}
	.line-2 {
		top: 16px;
		width: 22px;
	}

	/* Случайная линия чуть длиннее (растёт влево, т.к. выровнено по правому краю). */
	.line-0.wide {
		width: 30px;
	}
	.line-1.wide {
		width: 21px;
	}
	.line-2.wide {
		width: 26px;
	}

	/* Открытое состояние — крестик. */
	.burger.open .line-0 {
		top: 9px;
		width: 26px;
		transform: rotate(45deg);
	}
	.burger.open .line-1 {
		width: 26px;
		opacity: 0;
		transform: scaleX(0.2);
	}
	.burger.open .line-2 {
		top: 9px;
		width: 26px;
		transform: rotate(-45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.line {
			transition: opacity 120ms ease;
		}
	}
</style>
