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
        class="top-cards grid grid-cols-2 gap-x-[7%] mt-[3%] mb-[20%] sm:mb-[42%] lg:mb-[35%] {innerWidth <
            1023 && innerWidth > 775
            ? 'md:mb-[0%]'
            : innerWidth <= 775 && innerWidth >= 610
              ? 'md:mb-[16%]'
              : 'md:mb-[38%]'}"
    >
        <!-- 1 column -->
        <div class="col grid grid-flow-row">
            <div class="col-inner">
                <div class="about-photo h-[40%] sm:h-[20%] md:h-[30%] flex justify-center">
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

                <div class="card-stack z-10 grid gap-y-[10%] mx-auto mt-6">
                    <!-- What i sew -->
                    <div
                        class="about-card card-left py-5 shadow-xl border-b-2 border-navy-2 bg-white-1"
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
                    <div class="joke-text mt-[40%] sm:mt-[10%]">
                        <p class="relative -bottom-60 sm:-bottom-[75vh]">
                            {$t("aaaam I digiiitilizedd?")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 2 column -->
        <div class="col grid grid-flow-row">
            <div class="col-inner">
                <div class="card-stack grid gap-y-[10%] mt-6">
                    <!-- who am i -->
                    <div
                        class="about-card card-right py-5 shadow-xl bg-white-1 border-navy-2 border-x-2"
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
                                            "master degree student seeking for a job as a DevOps & Security Engineer",
                                        )}
                                    </p>
                                    
                                </li>
                                  <li>
                                    <p>
                                        {$t(
                                            "bachelor graduate (programming and logistics)",
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
                        class="about-card card-left py-5 shadow-xl bg-white-1 border-navy-2 border-x-2"
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
                                            "sew myself, design myself, make photos myself, write web-sites myself, set up infrastructure myself",
                                        )}
                                    </p>
                                </li>
                            </ul>
                        </details>
                    </div>
                    <!-- small space for small text -->
                    <div class="joke-text mt-[40%] sm:mt-[30%] md:mt-[35%]">
                        <p class="relative bottom-10">
                            {$t("guesss what else?..")}
                        </p>
                    </div>

                    <!-- what i suggest -->
                    <div
                        class="about-card card-right py-5 shadow-xl bg-white-1 border-navy-2 border-t-2"
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
                    <div class="card-empty"></div>
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
        <div class="col grid grid-flow-row">
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
        <div class="col grid grid-flow-row">
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

    /* ── Телефоны/планшеты (≤1023px): чиним наезжание карточек ──────────────
       Раскладку «по бокам, как на ПК» сохраняем: верхние карточки идут
       половиной ширины и чередуются лево/право — две в один ряд не попадают.
       На остальных дисплеях (≥1024px) ничего не меняется. */
    @media (max-width: 1023px) {
        /* сплющиваем две колонки в один поток, чтобы карточки можно было
           чередовать по сторонам, а не держать жёстко в 2 столбца */
        .top-cards {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
        }
        .top-cards :global(.col),
        .top-cards :global(.col-inner),
        .top-cards :global(.card-stack) {
            display: contents;
        }

        /* фото — на всю ширину сверху */
        .top-cards :global(.about-photo) {
            width: 100%;
        }

        /* верхние карточки: половина ширины, чередуем стороны */
        .top-cards :global(.about-card) {
            width: 50%;
            box-sizing: border-box;
        }
        .top-cards :global(.card-left) {
            margin-right: auto;
        }
        .top-cards :global(.card-right) {
            margin-left: auto;
        }

        /* мелкие текстовые приписки — на всю ширину, без «вылетов» вверх/вниз,
           которые и устраивали наезжание */
        .top-cards :global(.joke-text) {
            width: 100%;
            margin-top: 0;
            text-align: center;
        }
        .top-cards :global(.joke-text p) {
            position: static;
            bottom: auto;
        }

        .top-cards :global(.card-empty) {
            display: none;
        }
    }
</style>
