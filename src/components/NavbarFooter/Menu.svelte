<script lang="ts">
	import { base } from '$app/paths';
	import { clickOutside } from '../../services/clickOutside';
	import { authHandlers, authStore, isAdmin } from '../../store/store';
	import { t } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { currentLanguagee } from '../../store/store_';
	import { cart } from '../../store/cart_store_';

	export let isUser: boolean;
	let currentPage = $page.url.pathname;
	let isOpen = false;

	function handleClickOutside() {
		isOpen = false;
	}

	function toggleMenu(e: MouseEvent | KeyboardEvent) {
		e.stopPropagation();
		e.preventDefault();
		isOpen = !isOpen;
	}

	function handleMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleMenu(e);
		}
	}
</script>

<div class="menu relative z-50 ml-2">
	{#if !isOpen}
		<div class="flex items-center gap-4 sm:gap-0 sm:-ml-2">
			<a
				class="group relative flex justify-center sm:-left-2"
				target="_self"
				href="{base}/profile/shoppingcart"
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
				class="menu-toggle mt-1 transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse"
				aria-label="Open menu"
				aria-expanded="false"
				onclick={toggleMenu}
				onkeydown={handleMenuKeydown}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon icon-tabler icon-tabler-align-right fill-current"
					width="26"
					height="26"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M4 6l16 0" />
					<path d="M10 12l10 0" />
					<path d="M6 18l14 0" />
				</svg>
			</button>
		</div>
	{:else if !isUser}
		<div class="menu-panel" use:clickOutside onclickoutside={handleClickOutside}>
			<button
				type="button"
				class="menu-toggle mb-2 text-black hover:text-yellow-0"
				aria-label="Close menu"
				aria-expanded="true"
				onclick={toggleMenu}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="26"
					height="26"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					fill="none"
				>
					<path d="M4 6l16 0" />
					<path d="M10 12l10 0" />
					<path d="M6 18l14 0" />
				</svg>
			</button>
			<a
				class="transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
					'/login'
				)
					? 'text-yellow-0 animate-pulse'
					: 'text-black'}"
				target="_self"
				href="{base}/login"
			>
				{$t('Login')}
			</a>
		</div>
	{:else}
		<div
			class="menu-panel flex flex-col text-center rounded-lg text-black break-words -ml-4"
			use:clickOutside
			onclickoutside={handleClickOutside}
			lang={currentLanguagee.language}
		>
			<button
				type="button"
				class="menu-toggle mb-2 self-end text-black hover:text-yellow-0"
				aria-label="Close menu"
				aria-expanded="true"
				onclick={toggleMenu}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="26"
					height="26"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					fill="none"
				>
					<path d="M4 6l16 0" />
					<path d="M10 12l10 0" />
					<path d="M6 18l14 0" />
				</svg>
			</button>
			<a
				class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
					'/profile'
				) && !currentPage.includes('/shoppingcart')
					? 'text-yellow-0 animate-pulse'
					: 'text-black'}"
				target="_self"
				href="{base}/profile"
			>
				{$t('Profile')}
			</a>
			{#if $isAdmin.value}
				<a
					class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
						'/create'
					)
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}"
					target="_self"
					href="{base}/create"
				>
					{$t('Create')}
				</a>
				<!-- <a
					class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
						'/dashboard'
					)
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}"
					target="_self"
					href="{base}/dashboard"
				>
					{$t('Users')}
				</a>
				<a
					class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
						'/stat'
					)
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}"
					target="_self"
					href="{base}/stat"
				>
					{$t('Stat')}
				</a>
				<a
					class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
						'/slider-dashboard'
					)
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}"
					target="_self"
					href="{base}/slider-dashboard"
				>
					{$t('Slider')}
				</a> -->
				<a
					class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse {currentPage.includes(
						'/photos-dashboard'
					)
						? 'text-yellow-0 animate-pulse'
						: 'text-black'}"
					target="_self"
					href="{base}/photos-dashboard"
				>
					{$t('Photos')}
				</a>
			{/if}
			<a
				onclick={authHandlers.logout}
				class="col-span-full grid-row-auto transition duration-300 delay-100 hover:text-red-2 hover:animate-pulse"
				target="_self"
				href="{base}/login"
			>
				{$t('Logout')}
			</a>
		</div>
	{/if}
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

	.menu-panel {
		position: relative;
		z-index: 51;
		pointer-events: auto;
		background: transparent;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
	}
</style>
