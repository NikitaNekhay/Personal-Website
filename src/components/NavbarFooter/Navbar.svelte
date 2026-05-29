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
				}, 760);
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
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}
					text-2xl transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse"
				>
					<a target="_self" href="{base}/" on:click={closeHeader}>
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
							class="no-underline underline-offset-4 hover:underline
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/about') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
							target="_self"
							href="{base}/about">{$t("About")}</a
						>
						<a
							class="no-underline underline-offset-4 hover:underline
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/contact') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
							target="_self"
							href="{base}/contact">{$t("Contacts")}</a
						>
					</div>
					<div class="border-l-2 border-navy-2">
						<a
							class="no-underline underline-offset-4 hover:underline
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/shop') && !isActive('/shoppingcart')
								? 'text-yellow-0 animate-pulse'
								: 'text-black'}"
							target="_self"
							href="{base}/shop">{$t("Shop")}</a
						>
						<a
							class="no-underline underline-offset-4 hover:underline
							lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
							{isActive('/works') ? 'text-yellow-0 animate-pulse' : 'text-black'}"
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
									class="acc-link {isActive('/login')
										? 'is-active'
										: ''}"
									style="--d: 300ms"
									target="_self"
									href="{base}/login"
									on:click={closeHeader}>{$t("Login")}</a
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
									on:click={closeHeader}>{$t("Profile")}</a
								>
								{#if $isAdmin.value}
									<a
										class="acc-link {isActive('/create')
											? 'is-active'
											: ''}"
										style="--d: 340ms"
										target="_self"
										href="{base}/create"
										on:click={closeHeader}>{$t("Create")}</a
									>
									<a
										class="acc-link {isActive('/photos-dashboard')
											? 'is-active'
											: ''}"
										style="--d: 380ms"
										target="_self"
										href="{base}/photos-dashboard"
										on:click={closeHeader}>{$t("Photos")}</a
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
		display: flex;
		flex-direction: column;
	}

	.header-row {
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
		will-change: transform;
	}
	.logo-char.jump {
		animation: letterJump 0.74s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes letterJump {
		0% {
			transform: translateY(0);
		}
		35% {
			transform: translateY(-0.5em) scale(1.06);
		}
		60% {
			transform: translateY(0.04em);
		}
		100% {
			transform: translateY(0);
		}
	}

	/* ── Раскрытый хедер ──────────────────────────────────────────────────── */
	.header-expanded {
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

	.nav-account {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	/* ── Телефоны (≤1023px): вертикально, высокий раскрытый хедер ──────────── */
	@media (max-width: 1023px) {
		.nav-inline {
			display: none;
		}

		.header-expanded {
			height: 82vh;
		}

		.exp-inner {
			flex-direction: column;
			justify-content: flex-start;
			gap: 1.75rem;
		}

		.nav-main {
			flex-direction: column;
			gap: 1.25rem;
		}

		.nav-group {
			gap: 1rem;
		}

		/* На телефоне разделители-рамки между группами не нужны вертикально */
		.nav-group-a,
		.nav-group-b {
			border: none;
		}

		.exp-link {
			font-size: 1.9rem;
		}

		.acc-link {
			font-size: 1.05rem;
			color: #241e4e;
		}

		.nav-account {
			margin-top: auto;
			padding-top: 1.25rem;
			border-top: 1px solid rgba(36, 11, 54, 0.12);
		}
	}

	/* ── ПК (≥1024px): раскрытый хедер 30vh ───────────────────────────────── */
	@media (min-width: 1024px) {
		/* в раскрытом виде прячем горизонтальные ссылки верхнего ряда */
		.header-shell.is-open .nav-inline {
			display: none;
		}

		.header-expanded {
			height: 30vh;
		}

		.exp-inner {
			align-items: stretch;
			justify-content: space-between;
			padding: 1.75rem 2.5rem;
		}

		.nav-main {
			flex: 0 1 auto;
			align-items: stretch;
		}

		/* Разделители r-2 / l-2 — выше (на всю высоту панели), суммарно 4px */
		.nav-group-a {
			border-right: 2px solid #240b36;
			padding-right: 3.5rem;
		}
		.nav-group-b {
			border-left: 2px solid #240b36;
			padding-left: 3.5rem;
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

		.nav-account {
			justify-content: center;
			align-items: flex-end;
			padding-left: 2rem;
			border-left: 1px solid rgba(36, 11, 54, 0.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-char.jump {
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
	}
</style>
