<script lang="ts">
	import { base } from '$app/paths';
	import { authStore } from '../../store/store';
	import { page } from '$app/stores';
	import { cart } from '../../store/cart_store_';
	import BurgerIcon from './BurgerIcon.svelte';

	// Кластер-триггер в правом верхнем углу хедера: корзина + бургер.
	// Состояние «открыт/закрыт» теперь живёт в Navbar — сюда приходит пропсами.
	export let isUser: boolean;
	export let isOpen = false;
	export let onToggle: (e: MouseEvent | KeyboardEvent) => void;

	let currentPage = $page.url.pathname;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			onToggle(e);
		}
	}

	// корзина — «бургерная» страница: помечаем переход для лавы на правом бордюре
	function markCartNav() {
		try {
			sessionStorage.setItem('hdrLava', 'right');
		} catch (_) {}
	}
</script>

<div class="menu relative z-[60] ml-2 flex items-center gap-4 sm:gap-3 md:gap-3">
	<!-- Корзина: на телефоне в закрытом виде прячется (см. .cart-link в Navbar) -->
	<a
		class="cart-link group relative flex justify-center"
		class:cart-hidden={!isOpen}
		target="_self"
		href="{base}/profile/shoppingcart"
		onclick={markCartNav}
	>
		<svg
			class="feather feather-shopping-cart relative top-1.5 transition duration-300 delay-100 group-hover:text-yellow-0 group-hover:animate-pulse {currentPage.includes(
				'/shoppingcart'
			)
				? 'text-yellow-0 animate-pulse'
				: 'text-black'}"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="9" cy="21" r="1"></circle>
			<circle cx="20" cy="21" r="1"></circle>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
		</svg>
		<span
			class="absolute bottom-3 pl-1.5 transition duration-300 delay-100 group-hover:text-yellow-0 group-hover:animate-pulse {currentPage.includes(
				'/shoppingcart'
			)
				? 'text-yellow-0 animate-pulse'
				: 'text-black'}"
		>
			{isUser ? $authStore.data.cart.length : $cart.cart.length}
		</span>
	</a>

	<button
		type="button"
		class="menu-toggle text-black transition duration-300 hover:text-yellow-0"
		aria-label={isOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={isOpen}
		onclick={onToggle}
		onkeydown={handleKeydown}
	>
		<BurgerIcon open={isOpen} />
	</button>
</div>

<style>
	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		color: inherit;
		pointer-events: auto;
	}

	/* Корзина в закрытом виде скрыта только на телефонах (≤1023px). */
	@media (max-width: 1023px) {
		.cart-link.cart-hidden {
			display: none;
		}
	}
</style>
