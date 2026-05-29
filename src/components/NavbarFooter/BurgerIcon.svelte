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
	/* Базовые (телефон): палочки длиннее, чем были (+~7px). */
	.burger {
		color:#241e4e;
		position: relative;
		display: inline-block;
		width: 40px;
		height: 22px;
		right: 3px;
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
		top: 3px;
		width: 33px;
	}
	.line-1 {
		top: 10px;
		width: 24px;
	}
	.line-2 {
		top: 17px;
		width: 29px;
	}

	/* Случайная линия чуть длиннее (растёт влево, т.к. выровнено по правому краю). */
	.line-0.wide {
		width: 37px;
	}
	.line-1.wide {
		width: 28px;
	}
	.line-2.wide {
		width: 33px;
	}

	/* Открытое состояние — аккуратный крестик (короче закрытых палочек). */
	.burger.open .line-0 {
		top: 10px;
		width: 26px;
		transform: rotate(45deg);
	}
	.burger.open .line-1 {
		width: 26px;
		opacity: 0;
		transform: scaleX(0.2);
	}
	.burger.open .line-2 {
		top: 10px;
		width: 26px;
		transform: rotate(-45deg);
	}

	/* ── ПК (≥1024px): палочки ещё длиннее (+~15px к исходным). ── */
	@media (min-width: 1024px) {
		.burger {
			width: 48px;
			height: 24px;
		}
		.line-0 {
			top: 3px;
			width: 41px;
		}
		.line-1 {
			top: 11px;
			width: 32px;
		}
		.line-2 {
			top: 19px;
			width: 37px;
		}
		.line-0.wide {
			width: 45px;
		}
		.line-1.wide {
			width: 36px;
		}
		.line-2.wide {
			width: 41px;
		}
		.burger.open .line-0,
		.burger.open .line-1,
		.burger.open .line-2 {
			top: 11px;
			width: 30px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.line {
			transition: opacity 120ms ease;
		}
	}
</style>
