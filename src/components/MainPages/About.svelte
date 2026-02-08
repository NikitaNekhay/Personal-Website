<script>
    import { t } from "svelte-i18n";

    import { base } from "$app/paths";

    let innerWidth = 0;
    let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="flex flex-col h-auto ml-[2%] mr-[5%]">
    <!-- BRIEF TEXT -->
    <div class="mt-[20%] sm:mt-[30%]">
        <p class="">
            {$t(
                "My name is Nikita and here you will find some things about me especially what I do.",
            )}<br />
        </p>
    </div>

    <!-- 2 columns -->
    <div
        class="grid grid-cols-2 gap-x-[7%] mt-[3%] mb-[20%] sm:mb-[42%] lg:mb-[35%] {innerWidth <
            1023 && innerWidth > 775
            ? 'md:mb-[0%]'
            : innerWidth <= 775 && innerWidth >= 610
              ? 'md:mb-[16%]'
              : 'md:mb-[38%]'}"
    >
        <!-- 1 column -->
        <div class="grid grid-flow-row">
            <div class="">
                <div class="h-[40%] sm:h-[20%] md:h-[30%] flex justify-center">
                    <!-- {#key innerWidth}
                    <Authorphoto bind:innerWidth/>
                    {/key} -->
                    <img
                        class="h-auto {innerWidth < 410
                            ? 'md:h-[100%]'
                            : 'md:h-[99%] '} lg:h-[100%] xl:h-[100%] 2xl:h-[100%] 3xl:h-[100%]"
                        src="{base}/media/nik_rotate.gif"
                        alt="nikita's portrait"
                    />
                </div>

                <div class="z-10 grid gap-y-[10%] mx-auto mt-6">
                    <!-- What i sew -->
                    <div
                        class="py-5 shadow-xl border-b-2 border-navy-2 bg-white-1"
                    >
                        <details class="group" open>
                            <summary
                                class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                            >
                                <span class="text-3xl sm:text-lg select-none"
                                    >{$t("WHAT I SEW")}</span
                                >
                                <span class="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shape-rendering="geometricPrecision"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        ><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>

                            <ul
                                class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                            >
                                <li>
                                    <p>{$t("my ideas")}</p>
                                </li>
                            </ul>
                        </details>
                    </div>

                    <!-- small space for small text -->
                    <div class="mt-[40%] sm:mt-[10%]">
                        <p class="relative -bottom-60 sm:-bottom-[75vh]">
                            {$t("aaaam I digiiitilizedd?")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 2 column -->
        <div class="grid grid-flow-row">
            <div class="">
                <div class=" grid gap-y-[10%] mt-6">
                    <!-- who am i -->
                    <div
                        class="py-5 shadow-xl bg-white-1 border-navy-2 border-x-2"
                    >
                        <details class="group" open>
                            <summary
                                class="flex mx-2 justify-between items-center font-medium cursor-pointer list-none"
                            >
                                <span class="text-3xl sm:text-lg select-none"
                                    >{$t("WHO AM I")}</span
                                >
                                <span class="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shape-rendering="geometricPrecision"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        ><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>

                            <ul
                                class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                            >
                                <li>
                                    <p>
                                        {$t(
                                            "master degree student (DevOps & Security Engineering) seeking for a job as a front-end developer in React, Svelte, Bitrix1C",
                                        )}
                                    </p>
                                    
                                </li>
                                  <li>
                                    <p>
                                        {$t(
                                            "graduate (programming and logistics)",
                                        )}
                                    </p>
                                    
                                </li>
                                
                                <li>
                                    <p>
                                        {$t(
                                            "master degree student (DevOps & Security Engineering), graduate (programming and logistics) seeking for a job as a front-end developer in React, Svelte, Bitrix1C",
                                        )}
                                    </p>
                                    
                                </li>
                                <li>
                                    <p>
                                        {$t(
                                            "a young clothing designer who has graduated 2 sewing, cutting and modeling courses",
                                        )}
                                    </p>
                                </li>
                            
                            </ul>
                        </details>
                    </div>
                    <!-- what i do -->
                    <div
                        class="py-5 shadow-xl bg-white-1 border-navy-2 border-x-2"
                    >
                        <details class="group" open>
                            <summary
                                class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                            >
                                <span class="text-3xl sm:text-lg select-none"
                                    >{$t("WHAT I DO")}</span
                                >
                                <span class="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shape-rendering="geometricPrecision"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        ><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>

                            <ul
                                class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                            >
                                <li>
                                    <p>
                                        {$t(
                                            "sew myself, design myself, make photos myself, write web-sites myself",
                                        )}
                                    </p>
                                </li>
                            </ul>
                        </details>
                    </div>
                    <!-- small space for small text -->
                    <div class="mt-[40%] sm:mt-[30%] md:mt-[35%]">
                        <p class="relative bottom-10">
                            {$t("guesss what else?..")}
                        </p>
                    </div>

                    <!-- what i suggest -->
                    <div
                        class="py-5 shadow-xl bg-white-1 border-navy-2 border-t-2"
                    >
                        <details class="group" open>
                            <summary
                                class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                            >
                                <span class="text-3xl sm:text-lg select-none"
                                    >{$t("WHAT I SELL")}</span
                                >
                                <span class="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shape-rendering="geometricPrecision"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        ><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>

                            <ul
                                class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                            >
                                <li>
                                    <p>
                                        {$t("finished clothes")}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        {$t(
                                            "individual tailoring of my clothes",
                                        )}
                                    </p>
                                </li>
                            </ul>
                        </details>
                    </div>
                    <!-- where are photos -->
                    <div></div>
                </div>
            </div>
        </div>
    </div>

    <!-- LAST 2 BLOCKS -->
    <div
        class="grid grid-cols-2 gap-x-[7%] mt-[10%] sm:mt-[35%]
        xl:mt-[0%] lg:mt-[7%] 2xl:mt-[0%] 3xl:mt-[0%]
        {innerWidth < 1023 && innerWidth > 775
            ? 'md:mt-[10%]'
            : innerWidth <= 775 && innerWidth >= 610
              ? 'md:mt-[26%]'
              : 'md:mt-[35%]'}"
    >
        <div class="grid grid-flow-row">
            <div>
                <!-- where to read -->
                <div class="py-5 shadow-xl bg-white-1 border-navy-2 border-b-2">
                    <details class="group" open>
                        <summary
                            class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                        >
                            <span class="text-3xl sm:text-lg select-none"
                                >{$t("WHERE TO READ ME")}</span
                            >
                            <span class="transition group-open:rotate-180">
                                <svg
                                    fill="none"
                                    height="24"
                                    shape-rendering="geometricPrecision"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    ><path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                        </summary>

                        <ul
                            class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                        >
                            <li>
                                <p>
                                    
                                    {$t("technical portfolio aka CV")} ->
                                    <a
                                        class="p-link"
                                        target="_blank"
                                        href="{$t("cv-link")}"
                                        >{$t("here")}</a
                                    > 
                                </p>
                            </li>

                            <li>
                                <p>
                                    {$t("group in the telegram")} ->
                                    <a
                                        class="p-link"
                                        target="_blank"
                                        href="https://t.me/nikitanekhay"
                                        >{$t("here")}</a
                                    >
                                </p>
                            </li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
        <div class="grid grid-flow-row">
            <div>
                <!-- where to see my photos -->
                <div class="py-5 shadow-xl bg-white-1 border-navy-2 border-b-2">
                    <details class="group" open>
                        <summary
                            class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                        >
                            <span class="text-3xl sm:text-lg select-none"
                                >{$t("WHERE TO SEE MY PHOTOS")}</span
                            >
                            <span class="transition group-open:rotate-180">
                                <svg
                                    fill="none"
                                    height="24"
                                    shape-rendering="geometricPrecision"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    ><path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                        </summary>

                        <ul
                            class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn"
                        >
                            <li>
                                <p>
                                    {$t("home page of the site")} ->
                                    <a class="p-link" href="{base}/"
                                        >{$t("here")}</a
                                    >
                                </p>
                            </li>
                            <li>
                                <p>
                                    {$t("profile at Behance")} ->
                                    <a
                                        class="p-link"
                                        target="_blank"
                                        href="https://www.behance.net/nekhaynikita"
                                        >{$t("here")}</a
                                    >
                                </p>
                            </li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    ul {
        @apply list-disc pl-4;
    }
</style>
