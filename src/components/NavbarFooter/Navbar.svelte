    <script>
        // @ts-nocheck

        import { base } from "$app/paths";

        import {  authStore } from "../../store/store";
        import Menu from "./Menu.svelte";

        import { addMessages, locale, t } from "svelte-i18n";
        import ru from "../../services/ru.json";
        import en from "../../services/en.json";
        import { currentLanguagee } from "../../store/store_";

        import { onMount } from "svelte";
        import { Language } from "../../shared/types";
        import { page } from "$app/stores";

        let currentPage = $page.url.pathname;
        ////console.log(currentPage.includes("/about"));

        if ($currentLanguagee !== undefined) {
            const currentValue = $currentLanguagee;
            //console.log("no error while lng",currentValue)
            // Switch the language value
            if (currentValue === Language.English) {
                addMessages(Language.English, en);
                locale.set(Language.English);
            } else {
                addMessages(Language.Russian, ru);
                locale.set(Language.Russian);
            }
            //console.log("no error while lng 2",currentValue)
        } else {
            //console.log("error while lng")
            addMessages(Language.English, en);
            locale.set(Language.English);
        }

        let isUser = false;

        onMount(() => {
            const unsubscribe = authStore.subscribe((authStore) => {
                //////console.log(authStore)
                if (authStore.user) {
                    isUser = true;
                } else {
                    isUser = false;
                }
            });

            return unsubscribe;
        });

    </script>

    <nav class="flex w-[100%] font-anonymous">
        <!--The form itself  -->
        <div class="site-header fixed top-0 z-50 w-full">
            <div
                class="mx-auto flex items-center justify-between border-x-4 border-navy-1
                bg-white-1 shadow-white-2 drop-shadow-2xl sm:border-x-[6px] md:border-x-[6px]
                sm:w-12/12 md:w-12/12 lg:w-11/12 xl:w-11/12 2xl:w-11/12 3xl:w-11/12"
            >
                <div
                    class="mx-2 flex w-full items-center justify-between
                    sm:gap-0 lg:gap-16 xl:gap-16 2xl:gap-16 3x:gap-16"
                >
                    <!-- Logo(Left side) -->
                    <div
                        class="
                    {currentPage === '/' || currentPage === `${base}/`
                            ? 'text-yellow-0 animate-pulse'
                            : 'text-black'}    
                    text-2xl transition duration-300 delay-100 hover:text-yellow-0 hover:animate-pulse"
                    >
                        <a class="" target="_self" href="{base}/">
                            <h1>
                                <p>NEKHAY</p>
                                <p class="flex justify-center">NIKITA</p>
                            </h1>
                        </a>
                    </div>
                    <!-- Links(Center) -->
                    <div
                        class="flex items-center justify-between drop-shadow
                        sm:mx-0 lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
                        "
                    >
                        <div class="border-r-2 border-navy-2 sm:flex sm:flex-col">
                            <a
                                class="no-underline
                            underline-offset-4 hover:underline
                            sm:mx-4 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
                            {currentPage.includes('/about')
                                    ? 'text-yellow-0 animate-pulse'
                                    : 'text-black'}"
                                target="_self"
                                href="{base}/about"
                                >{$t("About")}
                            </a>
                            <a
                                class=" {currentPage.includes('/contact')
                                    ? 'text-yellow-0 animate-pulse'
                                    : 'text-black'}
                                no-underline underline-offset-4 hover:underline
                                sm:mx-4 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
                                "
                                target="_self"
                                href="{base}/contact"
                                >{$t("Contacts")}
                            </a>
                        </div>
                        <div
                            class="border-l-2 border-navy-2 sm:flex sm:flex-col sm:justify-end"
                        >
                            <a
                                class=" {currentPage.includes('/shop') &&
                                !currentPage.includes('/shoppingcart')
                                    ? 'text-yellow-0 animate-pulse'
                                    : 'text-black'}
                                no-underline underline-offset-4 hover:underline
                                sm:mx-4 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
                                "
                                target="_self"
                                href="{base}/shop"
                                >{$t("Shop")}
                            </a>
                            <a
                                class=" {currentPage.includes('/works')
                                    ? 'text-yellow-0 animate-pulse'
                                    : 'text-black'}
                                no-underline
                            underline-offset-4 hover:underline
                            sm:mx-4 md:mx-8 lg:mx-10 xl:mx-12 2xl:mx-20 3xl:mx-20
                            "
                                target="_self"
                                href="{base}/works"
                                >{$t("Works")}
                            </a>
                        </div>
                    </div>

                    <!-- Login/Profile(Right side) -->


                            <Menu {isUser}/>

                </div>
            </div>
        </div>
    </nav>

<style>
    .site-header {
        pointer-events: auto;
        isolation: isolate;
    }
</style>
