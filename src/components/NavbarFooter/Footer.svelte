<script>
    import { addMessages, locale, t } from "svelte-i18n";
    import ru from "../../services/ru.json";

    import en from "../../services/en.json";
    import { base } from "$app/paths";
    import { currentLanguagee } from "../../store/store_";
    import { Language } from "../../shared/types";

    let innerWidth = 0;
    let innerHeight = 0;

    // version 2
    function changeLanguage() {
        // Get the current value of the store
        if ($currentLanguagee !== undefined) {
            const currentValue = $currentLanguagee;
            let newLanguage = Language.Russian;
            // Switch the language value
            if (currentValue === Language.English) {
                newLanguage = Language.Russian;
                addMessages(Language.Russian, ru);
                locale.set(Language.Russian);
            } else {
                newLanguage = Language.English;
                addMessages(Language.English, en);
                locale.set(Language.English);
            }

            //console.log("change language in footer");
            // Update the store with the new value
            $currentLanguagee = newLanguage;
            $currentLanguagee.set(newLanguage);
        } else {
            let userLng = (window.navigator.userLanguage || window.navigator.language.split("-", 2)[1]).toLowerCase();
            //console.log("window navigate",window.navigator)
            userLng.toLowerCase;
            ////console.log(userLng)
            $currentLanguagee = userLng.length !== 0 ? (userLng === 'ru' ? Language.Russian : Language.English) : Language.English;
            
            console.error(
                "access to localStorage for languages is restricted...",
            );
        }
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<footer
    aria-label="Site Footer"
    class="
w-screen
relative bg-white-1
sm:grid sm:grid-cols-1
md:grid md:grid-cols-2
lg:grid lg:grid-cols-6
xl:grid xl:grid-cols-6
2xl:grid 2xl:grid-cols-6
3xl:grid 3xl:grid-cols-6
font-anonymous bottom-0 mt-20 shadow-white-2 drop-shadow-2xl"
>
    <div
        class="relative block h-32
        sm: md:col-span-2 lg:col-span-4 xl:col-span-4 lg:h-full xl:h-full 2xl:col-span-3 2xl:h-full 3xl:col-span-3 3xl:h-full"
    >
        <img
            src="https://lh3.googleusercontent.com/pw/AJFCJaWk73NiFqnvmE4ERdCThcHS_cjkfnjyMZT77oTLttHPaAYfRT2E0vWixrFc_Yk_PkkbBO6EunYTPi65rkik7TkcgBi1Av-UeGfMTcww1syn7ZlhRpU=w2400"
            alt="pink flower in lake"
            class="absolute inset-0 object-cover w-full h-full"
        />
    </div>

    <div
        class="px-4 sm:px-4 md:px-6 lg:px-8 2xl:px-16 3xl:px-16
            py-16
             sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2
             2xl:col-span-3 3xl:col-span-3"
    >
        <div
            class="grid grid-cols-1 gap-8
            sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2
            2xl:gap-0 3xl:gap-0 md:gap-0 xl:gap-8"
        >
            <div>
                <p>
                    <span class="text-xs tracking-wide text-black-0">
                        {$t("CALL US")}
                    </span>

                    <a
                        href="tel:+375445785057"
                        class="block text-2xl font-medium text-black-1 transition duration-300 delay-100 hover:opacity-75 hover:text-blue-0 sm:text-3xl"
                    >
                        <!-- {#if innerWidth > 374 && innerWidth<414}
                    +37544...
                    {:else}
                    +375445785057
                    {/if} -->
                        +375445785057
                    </a>
                </p>

                <ul class="mt-8 space-y-1 text-sm text-black-0">
                    <li>{$t("Monday to Friday")} : 10am - 5pm</li>
                    <li>{$t("Weekend")} : 10am - 3pm</li>
                </ul>

                <ul class="flex gap-6 mt-8">
                    <li class="">
                        <a
                            href="https://t.me/nikitanekhay"
                            rel="noreferrer"
                            target="_blank"
                            class="text-gray-700 transition duration-300 delay-100 hover:opacity-75 hover:text-blue-0"
                        >
                            <span class="sr-only">Telegram</span>

                            <svg
                                class=""
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                viewBox="0 0 66 66"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    fill="currentColor"
                                    d="M63.712 13.29 55.28 53.896C54.364 58.397 51.322 60 48.779 60c-1.312 0-2.674-.393-4.052-1.171l-.229-.131-.214-.16L26.75 45.302l-.659 7.735c-.344 1.807-1.988 3.105-3.859 2.951a3.634 3.634 0 0 1-3.091-2.32l-2.926-8.785A1.974 1.974 0 0 1 16 44a2 2 0 0 1 2-2c.873 0 1.605.56 1.879 1.338.002 0 .005-.002.007-.005l2.402 7.215.352-4.129v-.007a4.806 4.806 0 0 1 5.183-4.396c.873.07 1.666.381 2.335.847l16.535 12.482c.77.434 1.47.654 2.086.654 1.277 0 2.184-.95 2.581-2.901l8.448-40.682c.69-2.82-.559-4.416-2.24-4.416-.429 0-.885.104-1.348.317L6.616 27.864c-3.387 1.389-3.367 3.318-.618 4.177l8.199 2.616c.002 0 .01-.005.012-.003a2.087 2.087 0 0 0 1.733-.223c.01-.005.017-.003.026-.008l21.938-13.825a3.997 3.997 0 0 1 5.474 1.261 3.993 3.993 0 0 1-.468 4.87L31.414 38.226v.002l-.031.029-.002-.002a1.988 1.988 0 0 1-1.379.558 2 2 0 0 1-2-2c0-.536.213-1.021.558-1.38l-.002-.002 11.394-11.396-21.937 13.824a6.105 6.105 0 0 1-5.023.604c-.012-.005-.024 0-.037-.005l-8.15-2.599C.51 34.516.046 31.403.005 30.482c-.065-1.552.506-4.438 5.093-6.32l.024-.01.026-.01 49.515-19.51A7.148 7.148 0 0 1 57.568 4c1.959 0 3.766.87 4.958 2.391 1.4 1.779 1.819 4.227 1.186 6.899zM30 50a2 2 0 1 1 .001 3.999A2 2 0 0 1 30 50z"
                                />
                            </svg>
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://instagram.com/nekhaynikita"
                            rel="noreferrer"
                            target="_blank"
                            class="text-gray-700 transition duration-300 delay-100 hover:opacity-75 hover:text-blue-0"
                        >
                            <span class="sr-only">Instagram</span>

                            <svg
                                class="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </li>

                    <li>
                        <a
                            href="mailto:nekhaymikita@gmail.com"
                            rel="noreferrer"
                            target="_blank"
                            class="text-gray-700 transition duration-300 delay-100 hover:opacity-75 hover:text-blue-0"
                        >
                            <span class="sr-only">Mail</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <div
                class="grid grid-cols-1 gap-4 sm:gap-8 2xl:gap-8
            sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 3xl:"
            >
                <div>
                    <p
                        class="font-medium text-gray-700 lg:grid lg:place-items-end"
                    >
                        {$t("Services")}
                    </p>

                    <nav aria-label="Footer Navigation - Services" class="mt-6">
                        <ul class="space-y-4 text-sm">
                            <li>
                                <a
                                    href="{base}/"
                                    class="text-black-0 transition duration-300 delay-100 hover:text-yellow-0"
                                >
                                    {$t("Individual sewing")}
                                </a>
                            </li>

                            <li>
                                <a
                                    href="{base}/"
                                    class="text-black-0 transition duration-300 delay-100 hover:text-yellow-0"
                                >
                                    {$t("Creative director")}
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.behance.net/nekhaynikita"
                                    target="_blank"
                                    class="text-black-0 transition duration-300 delay-100 hover:text-yellow-0"
                                >
                                    {$t("Photography")}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div>
                    <p
                        class="font-medium text-gray-700 lg:grid lg:place-items-end"
                    >
                        {$t("Company")}
                    </p>

                    <nav aria-label="Footer Navigation - Company" class="mt-6">
                        <ul class="space-y-4 text-sm">
                            <li>
                                <a
                                    href="{base}/about"
                                    class="text-black-0 transition duration-300 delay-100 hover:text-yellow-0"
                                >
                                    {$t("About")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="{base}/contact"
                                    class="text-black-0 transition duration-300 delay-100 hover:text-yellow-0"
                                >
                                    {$t("Contacts")}
                                </a>
                            </li>
                            <!-- <li>
                        <a href="{base}/" class="text-red-2 transition hover:opacity-75">
                           {$t('Accounts Review')} 
                        </a>
                    </li> -->
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <div class="pt-12 mt-12 border-navy-1 border-t-2">
            <div class="sm:flex sm:items-center sm:justify-between">
                <nav aria-label="Footer Navigation - Support">
                    <ul class="flex flex-wrap gap-4 text-xs">
                        <li>
                            <a
                                href="{base}/purchase"
                                class="text-red-2 transition duration-300 delay-100 hover:opacity-75"
                            >
                                {$t("Purchase Conditions")}
                            </a>
                        </li>

                        <li>
                            <a
                                href="{base}/policy"
                                class="text-red-2 transition duration-300 delay-100 hover:opacity-75"
                            >
                                {$t("Privacy Policy")}
                            </a>
                        </li>
                        <li>
                            <button on:click={changeLanguage}>
                                <form
                                    method="POST"
                                    action="/?/setLang"
                                    class="font-extrabold text-transparent bg-clip-text
                        bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                        transition duration-300 delay-100 hover:opacity-75 hover:text-red-0"
                                >
                                    [{$t("language")}: {$currentLanguagee} :{$t(
                                        "language",
                                    )}]
                                </form>
                            </button>
                        </li>
                    </ul>
                </nav>

                <p
                    class="mt-8 text-xs text-gray-700 sm:mt-0 text-transparent bg-clip-text
                bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500"
                >
                    &copy; 2025. NEKHAY NIKITA. {$t("All rights reserved")}.
                </p>
            </div>
        </div>
    </div>
</footer>

<style>
</style>
