<script>
	// @ts-nocheck

	import { base } from "$app/paths";

	import { authStore, isAdmin, authHandlers } from "../../store/store";
	import Menu from "./Menu.svelte";
	import { clickOutside } from "../../services/clickOutside";

	import { addMessages, locale, t } from "svelte-i18n";
	import ru from "../../services/ru.json";
	import en from "../../services/en.json";
	import { currentLanguagee } from "../../store/store_";
	import { contentEditorOpen } from "../../store/contentEditor";

	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import { Language } from "../../shared/types";
	import { page } from "$app/stores";

	let currentPage = $page.url.pathname;

	if ($currentLanguagee !== undefined) {
		const currentValue = $currentLanguagee;
		if (currentValue === Language.English) {
			addMessages(Language.English, en);
			locale.set(Language.English);
		} else {
			addMessages(Language.Russian, ru);
			locale.set(Language.Russian);
		}
	} else {
		addMessages(Language.English, en);
		locale.set(Language.English);
	}

	let isUser = false;

	// ── Открытый/закрытый хедер ───────────────────────────────────────────────
	let headerOpen = false;

	function toggleHeader(e) {
		e?.stopPropagation?.();
		e?.preventDefault?.();
		headerOpen = !headerOpen;
	}

	function closeHeader() {
		headerOpen = false;
	}

	// клик по «бургерной» ссылке (профиль/фото/создать/логин/корзина и т.п.)
	function goBurgerLink() {
		closeHeader();
	}

	function handleWindowKeydown(e) {
		if (e.key === "Escape" && headerOpen) closeHeader();
	}

	// ── Прыгающая буква в логотипе NEKHAY / NIKITA ────────────────────────────
	const word1 = "NEKHAY".split("");
	const word2 = "NIKITA".split("");
	let jumpingIndex = -1;

	onMount(() => {
		const unsubscribe = authStore.subscribe((authStore) => {
			isUser = authStore.user ? true : false;
		});

		const prefersReduced =
			typeof window !== "undefined" &&
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

		let jumpTimer;
		let resetTimer;
		const total = word1.length + word2.length;

		const scheduleJump = () => {
			// случайная пауза 5–20 секунд
			const delay = 5000 + Math.random() * 15000;
			jumpTimer = setTimeout(() => {
				jumpingIndex = Math.floor(Math.random() * total);
				resetTimer = setTimeout(() => {
					jumpingIndex = -1;
					scheduleJump();
				}, 1150);
			}, delay);
		};

		if (!prefersReduced) scheduleJump();

		window.addEventListener("keydown", handleWindowKeydown);

		return () => {
			unsubscribe();
			clearTimeout(jumpTimer);
			clearTimeout(resetTimer);
			window.removeEventListener("keydown", handleWindowKeydown);
		};
	});

	function isActive(path) {
		return currentPage.includes(path);
	}
</script>

<nav class="flex w-[100%] font-anonymous">
	<div class="site-header fixed top-0 z-50 w-full">
		<div
			class="header-shell mx-auto border-x-4 border-navy-1 bg-white-1 shadow-white-2
			drop-shadow-2xl sm:border-x-[6px] md:border-x-[6px]
			sm:w-12/12 md:w-12/12 lg:w-11/12 xl:w-11/12 2xl:w-11/12 3xl:w-11/12"
			class:is-open={headerOpen}
			use:clickOutside
			on:clickoutside={() => headerOpen && closeHeader()}
		>
			<!-- ── Верхний ряд: лого · центральные ссылки (ПК, закрытый) · корзина+бургер ── -->
			<div class="header-row mx-2 flex w-full items-center justify-between">
				<!-- Логотип -->
				<div
					class="logo {currentPage === '/' || currentPage === `${base}/`
						? 'text-yellow-0 logo-glow'
						: 'text-black'}
					text-2xl transition duration-300 delay-100 hover:text-yellow-0"
				>
					<a
						target="_self"
						href="{base}/"
						on:click={closeHeader}
					>
						<h1 class="logo-type">
							<span class="logo-word">
								{#each word1 as ch, i}
									<span class="logo-char" class:jump={jumpingIndex === i}>{ch}</span>
								{/each}
							</span>
							<span class="logo-word logo-word-2">
								{#each word2 as ch, i}
									<span
										class="logo-char"
										class:jump={jumpingIndex === i + word1.length}>{ch}</span
									>
								{/each}
							</span>
						</h1>
					</a>
				</div>

				<!-- Центральные ссылки — только ПК и только в закрытом виде -->
				<div
					class="nav-inline flex items-center justify-between drop-shadow
					lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20"
				>
					<div class="border-r-2 border-navy-2">
						<a
							class="nav-link no-underline transition duration-300 hover:opacity-75 hover:text-yellow-0 animate-pulse
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/about') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
							style="--d: 0ms"
							target="_self"
							href="{base}/about">{$t("About")}</a
						>
						<a
							class="nav-link no-underline transition duration-300 hover:opacity-75 hover:text-yellow-0 animate-pulse
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/contact') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
							style="--d: 70ms"
							target="_self"
							href="{base}/contact">{$t("Contacts")}</a
						>
					</div>
					<div class="border-l-2 border-navy-2">
						<a
							class="nav-link no-underline transition duration-300 hover:opacity-75 hover:text-yellow-0 animate-pulse
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/shop') && !isActive('/shoppingcart')
								? 'text-yellow-0 animate-pulse'
								: 'text-black'}"
							style="--d: 140ms"
							target="_self"
							href="{base}/shop">{$t("Shop")}</a
						>
						<a
							class="nav-link no-underline transition duration-300 hover:opacity-75 hover:text-yellow-0 animate-pulse
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/works') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
							style="--d: 210ms"
							target="_self"
							href="{base}/works">{$t("Works")}</a
						>
					</div>
				</div>

				<!-- Корзина + бургер -->
				<Menu {isUser} isOpen={headerOpen} onToggle={toggleHeader} />
			</div>

			<!-- ── Раскрытый хедер ── -->
			{#if headerOpen}
				<div
					class="header-expanded"
					transition:slide={{ duration: 420, easing: cubicOut }}
					lang={$currentLanguagee}
				>
					<div class="exp-inner">
						{#if $isAdmin.value}
							<button
								class="acc-link ce-toggle"
								style="--d: 60ms"
								type="button"
								on:click={() => {
									closeHeader();
									contentEditorOpen.set(true);
								}}>{$t("Edit content")}</button
							>
						{/if}
						<!-- Основная навигация (крупнее) -->
						<nav class="nav-main">
							<div class="nav-group nav-group-a">
								<a
									class="exp-link {isActive('/about')
										? 'is-active'
										: ''}"
									style="--d: 60ms"
									target="_self"
									href="{base}/about"
									on:click={closeHeader}>{$t("About")}</a
								>
								<a
									class="exp-link {isActive('/contact')
										? 'is-active'
										: ''}"
									style="--d: 120ms"
									target="_self"
									href="{base}/contact"
									on:click={closeHeader}>{$t("Contacts")}</a
								>
							</div>
							<div class="nav-group nav-group-b">
								<a
									class="exp-link {isActive('/shop') &&
									!isActive('/shoppingcart')
										? 'is-active'
										: ''}"
									style="--d: 180ms"
									target="_self"
									href="{base}/shop"
									on:click={closeHeader}>{$t("Shop")}</a
								>
								<a
									class="exp-link {isActive('/works')
										? 'is-active'
										: ''}"
									style="--d: 240ms"
									target="_self"
									href="{base}/works"
									on:click={closeHeader}>{$t("Works")}</a
								>
							</div>
						</nav>

						<!-- Доп. ссылки аккаунта (справа на ПК, ниже на телефоне) -->
						<nav class="nav-account">
							{#if !isUser}
								<a
									class="exp-link {isActive('/login')
										? 'is-active'
										: ''}"
									style="--d: 300ms"
									target="_self"
									href="{base}/login"
									on:click={goBurgerLink}>{$t("Login")}</a
								>
							{:else}
								<a
									class="acc-link {isActive('/profile') &&
									!isActive('/shoppingcart')
										? 'is-active'
										: ''}"
									style="--d: 300ms"
									target="_self"
									href="{base}/profile"
									on:click={goBurgerLink}>{$t("Profile")}</a
								>
								{#if $isAdmin.value}
									<a
										class="acc-link {isActive('/create')
											? 'is-active'
											: ''}"
										style="--d: 340ms"
										target="_self"
										href="{base}/create"
										on:click={goBurgerLink}>{$t("Create")}</a
									>
									<a
										class="acc-link {isActive('/photos-dashboard')
											? 'is-active'
											: ''}"
										style="--d: 380ms"
										target="_self"
										href="{base}/photos-dashboard"
										on:click={goBurgerLink}>{$t("Photos")}</a
									>
									<a
										class="acc-link {isActive('/memories')
											? 'is-active'
											: ''}"
										style="--d: 400ms"
										target="_self"
										href="{base}/memories"
										on:click={goBurgerLink}>{$t("Memories")}</a
									>
								{/if}
								<a
									class="acc-link acc-logout"
									style="--d: 420ms"
									target="_self"
									href="{base}/login"
									on:click={(e) => {
										closeHeader();
										authHandlers.logout(e);
									}}>{$t("Logout")}</a
								>
							{/if}
						</nav>
					</div>
				</div>
			{/if}
		</div>
	</div>
</nav>

<style>
	.site-header {
		pointer-events: auto;
		isolation: isolate;
	}

	.header-shell {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.header-row {
		position: relative;
		z-index: 2;
		min-height: 3.5rem;
	}

	/* ── Логотип: прыгающие буквы ─────────────────────────────────────────── */
	.logo-type {
		line-height: 1.05;
	}
	.logo-word {
		display: flex;
	}
	.logo-word-2 {
		justify-content: center;
	}
	.logo-char {
		display: inline-block;
		transform-origin: 50% 100%;
		will-change: transform;
	}
	.logo-char.jump {
		animation: letterJump 1.1s cubic-bezier(0.3, 0.9, 0.4, 1);
	}

	/* Прыжок «как у лампы Pixar»: присед-подготовка → вылет с растяжением →
	   приземление-сквош → лёгкое покачивание и устаканивание. */
	@keyframes letterJump {
		0% {
			transform: translateY(0) scale(1, 1) rotate(0deg);
		}
		14% {
			/* подготовка: присед + расплющивание */
			transform: translateY(0.07em) scale(1.12, 0.82) rotate(0deg);
		}
		38% {
			/* вылет вверх с вытягиванием */
			transform: translateY(-0.58em) scale(0.92, 1.16) rotate(0deg);
		}
		60% {
			/* приземление: сквош */
			transform: translateY(0) scale(1.1, 0.88) rotate(-2deg);
		}
		74% {
			/* отскок + качок в другую сторону */
			transform: translateY(-0.09em) scale(0.98, 1.04) rotate(1.6deg);
		}
		87% {
			transform: translateY(0) scale(1.03, 0.98) rotate(-0.8deg);
		}
		100% {
			transform: translateY(0) scale(1, 1) rotate(0deg);
		}
	}

	/* Сияние логотипа на главной — мягче, тусклее и медленнее, чем animate-pulse. */
	.logo-glow {
		animation: logoGlow 4.5s ease-in-out infinite;
	}
	@keyframes logoGlow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.86;
		}
	}

	/* ── Раскрытый хедер ──────────────────────────────────────────────────── */
	.header-expanded {
		position: relative;
		z-index: 2;
		width: 100%;
		border-top: 2px solid rgba(36, 11, 54, 0.12);
		overflow-y: auto;
	}

	.exp-inner {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 1.5rem 1.25rem 2rem;
		gap: 1.5rem;
	}

	.nav-main {
		display: flex;
		flex: 1 1 auto;
		width: 100%;
	}

	.nav-group {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.65rem;
	}

	.exp-link,
	.acc-link {
		display: inline-block;
		color: #000;
		text-decoration: none;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		transition:
			color 220ms ease,
			transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
		/* «contemporary» вход: стартовое смещение + появление со стаггером */
		animation: linkIn 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--d, 0ms);
	}

	.exp-link:hover,
	.acc-link:hover {
		color: #f6ae2d;
		transform: translateX(6px);
	}

	.exp-link.is-active,
	.acc-link.is-active {
		color: #f6ae2d;
	}

	.acc-logout:hover {
		color: #c53030;
	}

	/* Admin "Edit content" toggle — gradient text matching the footer copyright.
	   This rainbow gradient lives ONLY here, never inside the editor itself. */
	.exp-inner .ce-toggle {
		background-color: transparent;
		background-image: linear-gradient(to right, #eab308, #ef4444, #ec4899);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		border: none;
		padding: 0;
		font-weight: 700;
		cursor: pointer;
		order: 99; /* phones: keep it at the end of the column */
		align-self: flex-start; /* phones: left-aligned */
	}
	.exp-inner .ce-toggle:hover {
		color: transparent;
		filter: brightness(1.12);
	}
	/* PC: pin it to the LEFT side of the expanded header (mirrors .nav-account on the right). */
	@media (min-width: 1024px) {
		.exp-inner .ce-toggle {
			position: absolute;
			left: 2.5rem;
			top: 50%;
			transform: translateY(-50%);
			order: 0;
		}
		.exp-inner .ce-toggle:hover {
			transform: translateY(-50%);
		}
	}

	@keyframes linkIn {
		0% {
			opacity: 0;
			transform: translateY(12px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Верхние центральные ссылки (ПК): мягкое появление при загрузке/закрытии
	   и зеркальное (реверс) исчезновение при раскрытии хедера — как в раскрытом
	   меню, но наоборот. ──────────────────────────────────────────────────── */
	.nav-inline .nav-link {
		display: inline-block;
		animation: navLinkIn 440ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--d, 0ms);
	}

	/* Разделители-рамки плавно гаснут/появляются вместе со ссылками. */
	.nav-inline > div {
		transition: border-color 320ms ease;
	}

	@keyframes navLinkIn {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes navLinkOut {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	.nav-account {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
	}

	/* ── Телефоны (≤1023px): вертикально, высокий раскрытый хедер ──────────── */
	@media (max-width: 1023px) {
		.nav-inline {
			display: none;
		}

		.header-expanded {
			height: 68vh;
		}

		.exp-inner {
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-end;
			text-align: right;
			gap: 1rem;
		}

		.nav-main {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.9rem;
			flex: 0 1 auto; 
		}

		.nav-group {
			align-items: flex-end;
			gap: 0.8rem;
		}

		/* На телефоне разделители-рамки между группами не нужны вертикально */
		.nav-group-a,
		.nav-group-b {
			border: none;
			padding: 0;
		}

		.exp-link {
			font-size: 1.9rem;
		}

		.acc-link {
			font-size: 1.05rem;
			color: #241e4e;
		}

		/* Доп. ссылки сразу под основными — небольшой отступ, не у самого низа */
		.nav-account {
			align-items: flex-end;
			margin-top: 0.6rem;
			padding-top: 0.85rem;
			border-top: 1px solid rgba(36, 11, 54, 0.12);
		}
	}

	/* ── ПК (≥1024px): раскрытый хедер 30vh ───────────────────────────────── */
	@media (min-width: 1024px) {
		/* В раскрытом виде ссылки верхнего ряда уходят зеркально появлению
		   раскрытого меню (staggered fade+slide вверх), а не исчезают рывком. */
		.header-shell.is-open .nav-inline {
			pointer-events: none;
		}
		.header-shell.is-open .nav-inline .nav-link {
			animation-name: navLinkOut;
			animation-duration: 320ms;
			animation-fill-mode: both;
		}
		.header-shell.is-open .nav-inline > div {
			border-color: transparent;
		}

		.header-expanded {
			height: 30vh;
		}

		/* Основная навигация — по центру (как закрытый ряд), доп.ссылки — справа */
		.exp-inner {
			position: relative;
			align-items: center;
			justify-content: center;
			padding: 1.75rem 2.5rem;
		}

		/* Ссылки в один ряд, группы по бокам от вертикального разделителя */
		.nav-main {
			flex: 0 0 auto;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin-right: 8px;
		}

		.nav-group {
			flex-direction: row;
			align-items: center;
			gap: 2rem;
		}

		/* Разделители r-2 / l-2 — выше (на всю высоту панели), суммарно 4px */
		.nav-group-a {
			border-right: 2px solid #240b36;
			padding-right: 3rem;
		}
		.nav-group-b {
			border-left: 2px solid #240b36;
			padding-left: 3rem;
		}

		/* центральные ссылки чуть крупнее */
		.exp-link {
			font-size: 1.5rem;
		}

		.acc-link {
			font-size: 1rem;
			color: #241e4e;
			text-align: right;
		}

		/* Доп.ссылки прижаты к правому краю, по вертикали — по центру панели.
		   width:auto критично: базовое правило задаёт width:100%, и при
		   position:absolute такой бокс растягивается на всю панель поверх
		   центральных ссылок .nav-main, перехватывая по ним клики. */
		.nav-account {
			position: absolute;
			right: 2.5rem;
			top: 50%;
			width: auto;
			transform: translateY(-50%);
			justify-content: center;
			align-items: flex-end;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-char.jump,
		.logo-glow {
			animation: none;
		}
		.exp-link,
		.acc-link {
			animation: none;
		}
		.exp-link:hover,
		.acc-link:hover {
			transform: none;
		}
		.nav-link {
			animation: none;
		}
		/* Без анимации просто прячем верхние ссылки при раскрытии (как раньше). */
		.header-shell.is-open .nav-inline {
			display: none;
		}
	}
</style>
