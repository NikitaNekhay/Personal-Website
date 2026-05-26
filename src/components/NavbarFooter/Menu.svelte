<script lang="ts">
    import { base } from "$app/paths";
    import { clickOutside } from "../../services/clickOutside";
    import {
        authHandlers,
        authStore,
        isAdmin,
    } from "../../store/store";
    import {  t } from "svelte-i18n";
    import { page } from "$app/stores";
    import { currentLanguagee } from "../../store/store_";
    import { cart } from "../../store/cart_store_";
    export let isUser: boolean;
    let currentPage = $page.url.pathname;

    export let isOpen = false;

    let name_menu = "";
    //////console.log($authStore.data.name)
    if ($authStore.data.name === undefined) {
        name_menu = "template_name";
    } else {
        ////console.log($authStore.data)
        name_menu = $authStore.data.name;
    }

    //   export let isAdmin

    function handleClickOutside() {
        isOpen = false;
    }

    function openMenu() {
        isOpen = !isOpen;
    }
</script>

<div class="menu relative cursor-pointer ml-2">
    <div
        class="grid-column-auto grid-row-auto"
        on:click={openMenu}
        on:keydown={openMenu}
        use:clickOutside
        on:clickOutside={handleClickOutside}
        role="button"
        tabindex="0"
    >
        {#if !isOpen}
            <div class="flex gap-4 sm:gap-0 items-center sm:-ml-2"
                >

                <a
                    class="group relative sm:-left-2
                            flex justify-center col-span-full grid-row-auto
                            
                "
                    target="_self"
                    href="{base}/profile/shoppingcart"
                >
                    <svg
                        class="feather feather-shopping-cart
        relative top-1.5
        {currentPage.includes('/shoppingcart')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'} 
        transition duration-300 delay-100 group-hover:text-yellow-0 group-hover:animate-pulse"
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
                        <path
                            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                        ></path>
                    </svg>
                    <span
                        class="absolute bottom-3 pl-1.5
                {currentPage.includes('/shoppingcart')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}
         transition duration-300 delay-100
         group-hover:text-yellow-0 group-hover:animate-pulse"
                        >{isUser ? $authStore.data.cart.length : $cart.cart.length}</span
                    >
                </a>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mt-1 icon icon-tabler icon-tabler-align-right
                col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse
            fill-current"
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

            </div>
        {:else if !isUser}
            <a
                on:click={authHandlers.login}
                class="{currentPage.includes('/login')
                    ? 'text-yellow-0 animate-pulse'
                    : 'text-black'}
                                grid-row-auto
                            col-span-full transition duration-300 delay-100
                            hover:text-yellow-0 hover:animate-pulse"
                target="_self"
                href="{base}/login"
            >
                {$t("Login")}
            </a>
        {:else}
            <div
                class="flex flex-col text-center rounded-lg
            text-black break-words -ml-4"
                use:clickOutside
                on:clickOutside={handleClickOutside}
                lang={currentLanguagee.language}
            >
                <a
                    class="{currentPage.includes('/profile') &&
                    !currentPage.includes('/shoppingcart')
                        ? 'text-yellow-0 animate-pulse'
                        : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse"
                    target="_self"
                    href="{base}/profile"
                >
                    {$t("Profile")}
                </a>
                <!-- <a class="{currentPage.includes('/shoppingcart')
            ? 'text-yellow-0 animate-pulse'
            : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100 
            hover:text-yellow-0 hover:animate-pulse" target="_self" href='{base}/profile/shoppingcart'>
                {$t('Shopping cart')} : {($authStore.data.cart).length}
            </a> -->
                {#if $isAdmin.value}
                    <a
                        class="
            {currentPage.includes('/create')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse"
                        target="_self"
                        href="{base}/create"
                    >
                        {$t("Create")}
                    </a>
                    <!-- <a class="col-span-full grid-row-auto transition duration-300 delay-100 
            hover:text-yellow-0 hover:animate-pulse" target="_self" href='{base}/posts'>
                {$t('View')} 
            </a> -->
                    <a
                        class="{currentPage.includes('/dashboard')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse"
                        target="_self"
                        href="{base}/dashboard"
                    >
                        {$t("Users")}
                    </a>
                    <a
                        class="
            {currentPage.includes('/stat')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse"
                        target="_self"
                        href="{base}/stat"
                    >
                        {$t("Stat")}
                    </a>
                    <a
                        class="
            {currentPage.includes('/slider-dashboard')
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}
            col-span-full grid-row-auto transition duration-300 delay-100
            hover:text-yellow-0 hover:animate-pulse"
                        target="_self"
                        href="{base}/slider-dashboard"
                    >
                        {$t("Slider")}
                    </a>
                {/if}
                <a
                    on:click={authHandlers.logout}
                    class="col-span-full grid-row-auto
            transition duration-300 delay-100 hover:text-red-2 hover:animate-pulse"
                    target="_self"
                    href="{base}/login"
                >
                    {$t("Logout")}
                </a>
            </div>
        {/if}
    </div>
</div>
