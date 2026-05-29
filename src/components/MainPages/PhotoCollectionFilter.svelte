<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PHOTO_COLLECTION_YEARS,
		PHOTO_SELECTION_COLLECTION,
		type PhotoCollectionKey
	} from '../../shared/types';

	interface Props {
		selectedCollection: PhotoCollectionKey;
		onSelect: (collection: PhotoCollectionKey) => void;
	}

	let { selectedCollection, onSelect }: Props = $props();

	// tabVisible — закладка выехала из-за края экрана.
	// swaying — закладка развевается «на ветру», пока просто висит.
	// menuOpen — закладка развёрнута в панель меню.
	let tabVisible = $state(false);
	let swaying = $state(false);
	let menuOpen = $state(false);

	let cycleTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let swayTimer: ReturnType<typeof setTimeout> | undefined;
	let menuHideTimer: ReturnType<typeof setTimeout> | undefined;

	// Зона «правый верхний угол, но не хедер» — для появления по наведению/клику.
	let headerPx = 88;
	let inCorner = false;

	function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
		if (timer) clearTimeout(timer);
	}

	// Закладка видна 5 секунд: выезжает, развевается, затем прячется.
	function reveal() {
		if (menuOpen) {
			scheduleNext();
			return;
		}
		tabVisible = true;

		// Развевание включаем после того, как закладка доехала (entrance не конфликтует со sway).
		clearTimer(swayTimer);
		swayTimer = setTimeout(() => {
			if (!menuOpen) swaying = true;
		}, 600);

		clearTimer(hideTimer);
		hideTimer = setTimeout(hide, 5000);
	}

	function hide() {
		if (menuOpen) return;
		swaying = false;
		tabVisible = false;
		scheduleNext();
	}

	// Следующее появление — через случайные 5–15 секунд.
	function scheduleNext() {
		clearTimer(cycleTimer);
		const delay = 5000 + Math.random() * 10000;
		cycleTimer = setTimeout(reveal, delay);
	}

	function openMenu() {
		if (menuOpen) return;
		clearTimer(hideTimer);
		clearTimer(cycleTimer);
		clearTimer(swayTimer);
		swaying = false;
		tabVisible = true;
		menuOpen = true;
	}

	function handleTabKeydown(e: KeyboardEvent) {
		if (menuOpen) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openMenu();
		}
	}

	function selectCollection(collection: PhotoCollectionKey) {
		onSelect(collection);
		// Скрытие — как и раньше: после выбора панель сама закрывается.
		clearTimer(menuHideTimer);
		menuHideTimer = setTimeout(() => {
			menuOpen = false;
			tabVisible = false;
			scheduleNext();
		}, 1200);
	}

	// Точка в правом верхнем углу, ниже хедера (узкая полоса под ним).
	function pointInCorner(x: number, y: number): boolean {
		return x >= window.innerWidth * 0.7 && y > headerPx && y < headerPx + 300;
	}

	function handleMouseMove(e: MouseEvent) {
		const now = pointInCorner(e.clientX, e.clientY);
		// Появляемся при ВХОДЕ в зону (а не на каждое движение), чтобы не сбрасывать таймеры.
		if (now && !inCorner) reveal();
		inCorner = now;
	}

	function handleClick(e: MouseEvent) {
		if (pointInCorner(e.clientX, e.clientY)) reveal();
	}

	onMount(() => {
		// Высота хедера из CSS-переменной (для зоны «угла»).
		const rootStyles = getComputedStyle(document.documentElement);
		const rem = parseFloat(rootStyles.fontSize) || 16;
		const headerVar = rootStyles.getPropertyValue('--site-header-height').trim();
		if (headerVar.endsWith('rem')) headerPx = parseFloat(headerVar) * rem;
		else if (headerVar.endsWith('px')) headerPx = parseFloat(headerVar);

		// Появляется при первой загрузке / переходе на страницу.
		const firstTimer = setTimeout(reveal, 600);

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		window.addEventListener('click', handleClick);

		return () => {
			clearTimeout(firstTimer);
			clearTimer(cycleTimer);
			clearTimer(hideTimer);
			clearTimer(swayTimer);
			clearTimer(menuHideTimer);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('click', handleClick);
		};
	});
</script>

<div class="bookmark-wrap" class:is-in={tabVisible || menuOpen}>
	<!-- Горизонтальная закладка (как повёрнутая на 90° по часовой): раздвоённый
	     острый конец смотрит влево, правый край прижат к краю экрана.
	     Единый морфящийся элемент — из узкого язычка вырастает в панель меню. -->
	<div
		class="bookmark"
		class:swaying={swaying && !menuOpen}
		class:open={menuOpen}
		role={menuOpen ? undefined : 'button'}
		tabindex={menuOpen ? -1 : 0}
		aria-label="Open collection year filter"
		aria-expanded={menuOpen}
		onclick={openMenu}
		onkeydown={handleTabKeydown}
	>
		{#if menuOpen}
			<nav class="collection-nav" aria-label="Collection years">
				<button
					type="button"
					class="collection-pill"
					class:active={selectedCollection === PHOTO_SELECTION_COLLECTION}
					onclick={(e) => {
						e.stopPropagation();
						selectCollection(PHOTO_SELECTION_COLLECTION);
					}}
				>
					Selection
				</button>
				{#each PHOTO_COLLECTION_YEARS as year}
					<button
						type="button"
						class="collection-pill"
						class:active={selectedCollection === year}
						onclick={(e) => {
							e.stopPropagation();
							selectCollection(year);
						}}
					>
						{year}
					</button>
				{/each}
			</nav>
		{:else}
			<!-- Декоративный «хват»: вертикальные штрихи, намёк что закладку можно нажать. -->
			<span class="grip" aria-hidden="true"></span>
			<!-- При наведении закладка чуть подрастает и из-за края выглядывает
			     первая селекция — намёк на спрятанное меню. -->
			<span class="peek" aria-hidden="true">Selection</span>
		{/if}
	</div>
</div>

<style>
	/* Контейнер закреплён у правого края, ниже хедера + зазор от него. */
	.bookmark-wrap {
		position: fixed;
		top: calc(var(--site-header-height) + 0.9rem);
		right: 0;
		z-index: 20;
		pointer-events: none;
		/* Спрятана за правым краем; играющий въезд с лёгким перелётом. */
		transform: translateX(118%);
		transition: transform 560ms cubic-bezier(0.34, 1.45, 0.5, 1);
	}

	.bookmark-wrap.is-in {
		transform: translateX(0);
	}

	/* Свёрнутая закладка: горизонтальный жёлтый язычок с раздвоённым острым
	   концом слева. Фикс. глубина развилки (1.15rem) → острый конец сохраняется
	   и в раскрытом состоянии, и при любой ширине. */
	.bookmark {
		pointer-events: auto;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4.8rem;
		height: 2.8rem;
		padding: 0 0 0 1.15rem;
		border: 0;
		/* «Живой» материал: верхний блик + объёмный жёлтый градиент. */
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 22%),
			linear-gradient(135deg, #ffd071 0%, #f6ae2d 52%, #e0900d 100%);
		color: #1a1a1a;
		cursor: pointer;
		/* clip-path обрезает box-shadow, поэтому тень даём через filter — она
		   повторяет форму язычка. Двойная тень = мягкая + контактная. */
		filter:
			drop-shadow(-6px 7px 10px rgba(120, 75, 5, 0.28))
			drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.18));
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 1.15rem 50%);
		transform-origin: right center;
		transition:
			width 400ms cubic-bezier(0.16, 1, 0.3, 1),
			height 400ms cubic-bezier(0.16, 1, 0.3, 1),
			padding 400ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 300ms ease,
			transform 320ms ease;
	}

	/* Развевание «на ветру»: пивот у правого (закреплённого) края, свободный
	   левый конец-хвост размашисто колышется. Игриво и сильно. */
	.bookmark.swaying {
		animation: tailSway 2.4s ease-in-out infinite;
	}

	/* Хват: три вертикальных штриха по центру тела (правее острого конца). */
	.grip {
		width: 2px;
		height: 1rem;
		border-radius: 999px;
		background: rgba(26, 26, 26, 0.5);
		box-shadow:
			-6px 0 0 rgba(26, 26, 26, 0.5),
			6px 0 0 rgba(26, 26, 26, 0.5);
		margin-left: 0.7rem;
		transition: opacity 180ms ease;
	}

	/* Выглядывающая первая селекция — видна только при наведении. */
	.peek {
		position: absolute;
		left: 1.35rem;
		top: 50%;
		transform: translateY(-50%);
		font-family: 'Anonymous Pro', monospace;
		font-size: 0.64rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
		color: rgba(26, 26, 26, 0.85);
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms ease;
	}

	/* Наведение на свёрнутую закладку: чуть подрастает, грип прячется,
	   проявляется краешек первой селекции. */
	.bookmark:not(.open):hover {
		width: 6.6rem;
	}

	.bookmark:not(.open):hover .grip {
		opacity: 0;
	}

	.bookmark:not(.open):hover .peek {
		opacity: 1;
	}

	/* Раскрытая панель: резко, но плавно вырастает влево; острый конец слева
	   сохраняется (та же clip-path). В раскрытом виде — лёгкое покачивание. */
	.bookmark.open {
		width: 75vw;
		height: auto;
		min-height: 3.1rem;
		padding: 0.95rem 1.2rem 0.95rem 2.2rem;
		cursor: default;
		filter:
			drop-shadow(-10px 12px 18px rgba(120, 75, 5, 0.3))
			drop-shadow(-3px 3px 3px rgba(0, 0, 0, 0.2));
		/* Не раскачка, а спокойное «дыхание»: лента словно только что развернулась
		   и мягко всплывает-оседает с едва заметным микромасштабом. */
		transform-origin: center center;
		animation: panelBreathe 5s ease-in-out infinite;
	}

	.collection-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.45rem 0.6rem;
		width: 100%;
	}

	.collection-pill {
		font-family: 'Anonymous Pro', monospace;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.4rem 0.9rem;
		border: 1px solid rgba(26, 26, 26, 0.45);
		border-radius: 999px;
		background: transparent;
		color: #1a1a1a;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.collection-pill:hover {
		background: #1a1a1a;
		color: #f6ae2d;
		border-color: #1a1a1a;
	}

	.collection-pill.active {
		background: #1a1a1a;
		color: #f6ae2d;
		border-color: #1a1a1a;
	}

	/* Сильный «ветер» для свёрнутой закладки. */
	@keyframes tailSway {
		0% {
			transform: rotate(0deg);
		}
		18% {
			transform: rotate(7deg);
		}
		38% {
			transform: rotate(-5deg);
		}
		58% {
			transform: rotate(4deg);
		}
		78% {
			transform: rotate(-2.4deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	/* «Дыхание» раскрытой панели: мягкое всплытие-оседание + микромасштаб. */
	@keyframes panelBreathe {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.008);
		}
	}

	/* Телефоны: панель на всю ширину экрана. */
	@media (max-width: 768px) {
		.bookmark.open {
			width: 100vw;
		}

		.collection-pill {
			font-size: 0.7rem;
			padding: 0.35rem 0.7rem;
		}
	}

	/* Уважаем «меньше движения»: без развевания и перелёта. */
	@media (prefers-reduced-motion: reduce) {
		.bookmark-wrap {
			transition: transform 240ms ease;
		}

		.bookmark.swaying,
		.bookmark.open {
			animation: none;
		}
	}
</style>
