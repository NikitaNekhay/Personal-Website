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
	// swaying — лёгкое покачивание «на ветру», пока закладка просто висит.
	// menuOpen — закладка развёрнута в панель меню.
	let tabVisible = $state(false);
	let swaying = $state(false);
	let menuOpen = $state(false);

	let cycleTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let swayTimer: ReturnType<typeof setTimeout> | undefined;
	let menuHideTimer: ReturnType<typeof setTimeout> | undefined;

	function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
		if (timer) clearTimeout(timer);
	}

	// Закладка видна 5 секунд: выезжает, чуть качается, затем прячется.
	function reveal() {
		if (menuOpen) {
			scheduleNext();
			return;
		}
		tabVisible = true;

		// Покачивание включаем после того, как закладка доехала (entrance не конфликтует со sway).
		clearTimer(swayTimer);
		swayTimer = setTimeout(() => {
			if (!menuOpen) swaying = true;
		}, 650);

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

	onMount(() => {
		// Появляется при первой загрузке / переходе на страницу.
		const firstTimer = setTimeout(reveal, 600);

		return () => {
			clearTimeout(firstTimer);
			clearTimer(cycleTimer);
			clearTimer(hideTimer);
			clearTimer(swayTimer);
			clearTimer(menuHideTimer);
		};
	});
</script>

<div class="bookmark-wrap" class:is-in={tabVisible || menuOpen}>
	<!-- Единый морфящийся элемент: из узкой закладки разворачивается в панель.
	     Свёрнутый — кликабелен (role=button); раскрытый — контейнер с пилюлями. -->
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
			<!-- Декоративная «насечка»-хват, намекает что закладку можно нажать. -->
			<span class="grip" aria-hidden="true"></span>
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
		/* Спрятана за правым краем; играющий въезд с лёгким перелётом (хвост лисы). */
		transform: translateX(115%);
		transition: transform 540ms cubic-bezier(0.34, 1.4, 0.5, 1);
	}

	.bookmark-wrap.is-in {
		transform: translateX(0);
	}

	/* Свёрнутая закладка: жёлтый «язычок» с раздвоенным низом (как у книжной ленты). */
	.bookmark {
		pointer-events: auto;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.7rem;
		height: 4.6rem;
		padding: 0;
		border: 0;
		background: #f6ae2d;
		color: #1a1a1a;
		cursor: pointer;
		box-shadow: -7px 9px 22px rgba(0, 0, 0, 0.18);
		/* Раздвоённый «ласточкин хвост» снизу. 5 точек — столько же, сколько у
		   раскрытого состояния, чтобы clip-path плавно морфился при разворачивании. */
		clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
		transform-origin: top center;
		transition:
			width 380ms cubic-bezier(0.16, 1, 0.3, 1),
			height 380ms cubic-bezier(0.16, 1, 0.3, 1),
			clip-path 380ms cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 380ms ease,
			padding 380ms ease;
	}

	/* Покачивание «на лёгком ветре»: качается низ-«хвост», пивот сверху.
	   Движения выверенные, амплитуда небольшая. */
	.bookmark.swaying {
		animation: tailSway 3.8s ease-in-out infinite;
	}

	/* Хват: пара тёмных штрихов по центру язычка. */
	.grip {
		width: 0.95rem;
		height: 2px;
		border-radius: 999px;
		background: rgba(26, 26, 26, 0.55);
		box-shadow:
			0 -5px 0 rgba(26, 26, 26, 0.55),
			0 5px 0 rgba(26, 26, 26, 0.55);
		/* приподнимем над развилкой хвоста */
		margin-bottom: 0.7rem;
	}

	/* Раскрытая панель: резко, но плавно вырастает влево от правого края. */
	.bookmark.open {
		width: 75vw;
		height: auto;
		min-height: 4.6rem;
		padding: 0.95rem 1.2rem;
		cursor: default;
		box-shadow: -12px 14px 34px rgba(0, 0, 0, 0.26);
		/* Плоский низ (та же 5-точечная схема, развилка «расправлена»). */
		clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 100%);
		animation: none;
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

	@keyframes tailSway {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(2.4deg);
		}
		55% {
			transform: rotate(-1.6deg);
		}
		80% {
			transform: rotate(1.1deg);
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

	/* Уважаем «меньше движения»: без покачивания и перелёта. */
	@media (prefers-reduced-motion: reduce) {
		.bookmark-wrap {
			transition: transform 240ms ease;
		}

		.bookmark.swaying {
			animation: none;
		}
	}
</style>
