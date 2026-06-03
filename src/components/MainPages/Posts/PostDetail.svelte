<script
    lang="ts"
    src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js"
    defer
>
    import { base } from "$app/paths";
    import { t } from "svelte-i18n";
    import { handleCart, handleCartNoUser } from "../../../routes/posts/post";
    import {
        Errors,
        type ProductType,
        type Slide,
    } from "../../../shared/types";
    import { authStore } from "../../../store/store";
    import CartAdded from "../../Shared/CartAdded.svelte";
    import CommonPopUp from "../../Shared/CommonPopUp.svelte";

    import { writable } from "svelte/store";
    import SquareButton from "../../Shared/SquareButton.svelte";

    import { fly } from "svelte/transition";
    import { smoothDetails } from "../../../services/smoothDetails";
    import { currentLanguagee } from "../../../store/store_";
    import { cart } from "../../../store/cart_store_";

    export let post: ProductType;
    let isChanged: boolean = false;
    let isChangedCart: boolean = false;
    let msg: String = "";
    let smmsg: String = "Something went wrong while fetching the data.";
    let href: string = `${base}/shop`;
    let isError: boolean = true;
    export let slides: Slide[];

    if (post === undefined) {
        isChanged = true;
        msg = Errors.FetchPost;
    }

    async function handleCartClicked() {
        try {
            //console.log($authStore);
            if (!$authStore.user) {
                await handleCartNoUser(post,$cart)
            } else {
                await handleCart(post, $authStore);
            }


            // HANDLE DOUBLE CLICK
            if (isChangedCart) {
                isChangedCart = false;
                setTimeout(() => {
                    isChangedCart = true;
                }, 700);
            } else {
                isChangedCart = !isChangedCart;
            }
        } catch (err) {
            ////console.log("error in PostDetail");
            if (typeof err === "string") {
                msg = err;
            } else if (err.message !== undefined) {
                msg = err.message;
            } else {
                msg = Errors.AddToCart;
            }
            isChanged = true;
            throw msg;
        }
    }

    let localCurrentIndex = 0; // Local variable to track the index
    const currentIndex = writable(0);

    let touchstartX = 0;
    let touchendX = 0;
    let isRightSwipe: boolean = true;
    let innerWidth = 0;
    let innerHeight = 0;

    function handleSwipe(direction: "left" | "right"): void {
        if (direction === "left") {
            localCurrentIndex = Math.max(0, localCurrentIndex - 1);
            isRightSwipe = false;
        } else {
            localCurrentIndex = Math.min(
                slides.length - 1,
                localCurrentIndex + 1,
            );
            isRightSwipe = true;
        }

        currentIndex.set(localCurrentIndex);
    }
</script>

{#if isChanged}
    <CommonPopUp
        bind:isChanged
        {href}
        {isError}
        isPreviev={false}
        message={msg}
        smallMessage={smmsg}
    />
{:else if isChangedCart}
    <CartAdded bind:isChangedCart />
{/if}
<svelte:window bind:innerWidth bind:innerHeight />
<section class="w-screen h-auto sm:w-screen">
    <div
        class="
            mt-28 mx-12 sm:mt-20 md:mt-20 sm:mx-0 md:mx-0
            flex
            sm:flex-col sm:justify-center sm:items-center sm:gap-y-4
            md:flex-col md:justify-center md:items-center md:gap-y-4
            
            "
    >
        <!-- LEFT SIDE FOR IMAGE -->
        <div
            class="w-[80%] h-[80%] sm:w-screen md:w-[80%]
                    place-self-center select-none"
        >
            <div
                class=" grid grid-flow-col sm:grid-flow-row relative max-w-md sm:max-w-sm sm:w-[90%] mx-auto shadow-lg"
            >
                {#each slides as slide, index}
                    {#if index === $currentIndex}
                        <div
                            class="mx-auto shadow-lg sm:w-[100%] max-w-md h-max w-max relative"
                            in:fly={{
                                x:
                                    innerWidth > 1024
                                        ? isRightSwipe
                                            ? 500
                                            : -500
                                        : isRightSwipe
                                          ? 10
                                          : -10,
                                duration: 2000,
                            }}
                        >
                            <!-- Left clickable area for swiping left -->
                            <div
                                role="button"
                                tabindex="0"
                                class="absolute left-0 top-0 bottom-0 w-3/12 group"
                                on:click={() => handleSwipe("left")}
                                on:keyup={() => handleSwipe("left")}
                            >
                                <div
                                    class="absolute justify-center top-[50%] right-[50%] transition-all duration-200 group-hover:scale-150 animate-pulse"
                                >
                                    <img
                                        class=""
                                        src="{base}/media/chevrons-left.svg"
                                        alt="right icon"
                                    />
                                </div>
                            </div>

                            <!-- Image -->

                            <img
                                src={slide.img}
                                alt="imgs"
                                class=" w-full sm:w-[100%] h-full object-cover"
                                on:pointerdown={(e) =>
                                    (touchstartX = e.screenX)}
                                on:pointerup={(e) => {
                                    touchendX = e.screenX;
                                    handleSwipe("right");
                                }}
                            />

                            <!-- Right clickable area for swiping right -->
                            <div
                                role="button"
                                tabindex="0"
                                class="absolute right-0 top-0 bottom-0 w-3/12 cursor-pointer group"
                                on:click={() => handleSwipe("right")}
                                on:keyup={() => handleSwipe("right")}
                            >
                                <div
                                    class="absolute justify-center top-[50%] left-[50%] group-hover:scale-150 transition-all duration-200 animate-pulse"
                                >
                                    <img
                                        src="{base}/media/chevrons-right.svg"
                                        alt="right icon"
                                    />
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
            <!-- Navigation Dots -->
            <div class="flex justify-center mt-4 relative">
                {#each slides as _, index}
                    <span
                        class="w-4 h-1 mx-1"
                        class:bg-yellow-0={$currentIndex === index}
                        class:bg-red-0={$currentIndex !== index}
                        class:w-[8px]={$currentIndex !== index}
                    >
                    </span>
                {/each}
            </div>
        </div>

        <!-- RIGHT SIDE FOR ABOUT NEKHAY NIKITA -->
        <div
            class=" m-12 flex flex-col items-center place-content-center
        text-black-1 font-anonymous text-2xl md:m-6 sm:m-6
             gap-y-12 w-[80%]
            "
        >
            <!-- TITLE + SMALL DESCRIPTION -->
            <div class="w-[100%] flex flex-col gap-y-4">
                
                    <h1
                        class="font-abril sm:text-4xl text-center break-words text-6xl sm:tracking-tight text-black-0"
                        lang={$currentLanguagee}
                    >
                        {$t(post.title)}
                    </h1>
                
                <p
                    class="text-center text-xl break-words"
                    lang={$currentLanguagee}
                >
                    {$t(post.description["smallDescription"])}
                </p>
            </div>
            <div
                class="flex flex-col items-center place-content-center
                     w-[80%] sm:w-[100%] md:w-[100%]
                         sm:mx-4 md:mx-6"
            >
                <!-- COLOR AVAILABLE -->
                <div class="text-center w-[100%] py-1.5 shadow-xl bg-white-1">
                    <p class="text-navy-1 text-3xl">{$t("COLORS")}:</p>
                    <div class="flex flex-row gap-3 place-content-center">
                        {#each post.description["colors"] as colorItem}
                            <div class="">{$t(colorItem)}</div>
                        {/each}
                    </div>
                </div>

                <!-- SIZE'S INFO -->
                <div
                    class="pt-3 w-[80%] sm:w-[100%] md:w-[100%] flex flex-col text-center mb-8"
                >
                    <!-- SIZE GUIDE -->

                    <p
                        class="text-3xl select-none transition duration-300 delay-100 hover:text-yellow-0"
                    >
                        <!-- {$t("SIZE GUIDE")} -->
                        {$t("SIZES")}:
                    </p>
                    <!-- LIST OF SIZES -->
                    <div class="flex flex-row gap-3 place-content-center">
                        {#each post.description["sizes"] as sizeItem}
                            <p class="underline-offset-4 underline">
                                {sizeItem}
                            </p>
                        {/each}
                    </div>
                    <p class="mt-3 text-xs italic text-gray-600">
                        {$t(
                            "I can sew clothes for your measurements. For this option I will contact yout directly.",
                        )}
                    </p>
                </div>

                <!-- PURCHASE BUTTONS -->
                <div
                    class=" flex flex-row justify-center gap-x-4 px-2 border-x-4 border-navy-2 shadow-2xl bg-white-1"
                >
                    <!-- PRICE -->
                    <div class="flex self-center text-3xl">
                        <p class="select-none text-center">{$t("Price")}</p>
                        <p>:</p>
                        <p
                            class=" text-transparent bg-clip-text
                        bg-gradient-to-t from-green-950 via-green-1 to-green-0 text-center animate-pulse"
                        >
                            {post.price} BYN
                        </p>
                    </div>
                    <div class="flex">
                        <SquareButton
                            passedfunction={handleCartClicked}
                            typeSquare="cart"
                        />
                    </div>

                    <!-- <SubmitButton bind:submitClicked bind:isLoading passedfunction={handleCart} text={""}/> -->
                </div>

                <!-- BLOCK OF DESCRIPTION AND DETAILS -->
                <div
                    class="grid divide-y-2 divide-navy-2 mx-auto mt-6 w-[100%]"
                >
                    <!-- DESCRIPTION -->
                    {#if post.description["bigDescription"].length !== 0}
                        <div class="py-5 shadow-xl bg-white-1">
                            <details class="group" use:smoothDetails>
                                <summary
                                    class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                                >
                                    <span class="text-3xl select-none"
                                        >{$t("DESCRIPTION")}</span
                                    >
                                    <span
                                        class="transition group-open:rotate-180"
                                    >
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
                                <p
                                    class="text-gray-700 mx-4 mt-3"
                                >
                                    {$t(post.description["bigDescription"])}
                                </p>
                            </details>
                        </div>
                    {/if}
                    <!-- MATERIALS -->
                    {#if post.description["materialsDescription"].length !== 0}
                        <div class="py-5 shadow-xl bg-white-1">
                            <details class="group" use:smoothDetails>
                                <summary
                                    class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                                >
                                    <span class="text-3xl select-none">
                                        {$t("MATERIALS")}
                                    </span>
                                    <span
                                        class="transition group-open:rotate-180"
                                    >
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
                                <p
                                    in:fly={{ x: 200, duration: 700 }}
                                    class="text-gray-700 mt-3 mx-4"
                                >
                                    {$t(
                                        post.description[
                                            "materialsDescription"
                                        ],
                                    )}
                                </p>
                            </details>
                        </div>
                    {/if}
                    <!-- MODEL -->
                    {#if post.description["materialsDescription"].length !== 0}
                        <div class="py-5 shadow-xl bg-white-1">
                            <details class="group" use:smoothDetails>
                                <summary
                                    class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                                >
                                    <span class="text-3xl select-none">
                                        {$t("MODEL")}
                                    </span>
                                    <span
                                        class="transition group-open:rotate-180"
                                    >
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
                                <p
                                    class="text-gray-700 mt-3 mx-4"
                                >
                                    {$t(post.description["modelDescription"])}
                                </p>
                            </details>
                        </div>
                    {/if}

                    <!-- PAYMENT METHODS AND KLARNA -->
                    <div class="py-5 shadow-xl bg-white-1">
                        <details class="group" use:smoothDetails>
                            <summary
                                class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                            >
                                <span class="text-3xl select-none">
                                    {$t("PAYMENT METHODS")}
                                </span>
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
                            <p
                                class="text-gray-700 mt-3 mx-4"
                            >
                                {$t(
                                    "We accept cash, cashless payments. Order is performed only with a prepayment. Return conditions vary.",
                                )}
                                <br /><br />
                                {$t("We suggest some shipping solutions:")}<br
                                />
                                {$t(
                                    "Minsk: Self-delivery/Delivery by our courier to your door;",
                                )}<br />
                                {$t(
                                    "RB: Self-delivery from any Evropochta's office;",
                                )}<br />
                                {$t("RF: Self-delivery from CDEK;")}<br />
                                {$t(
                                    "Other countries: EMS or any personal agreements;",
                                )}<br />
                                <em
                                    >{$t(
                                        "Price of mail services will be included in the order price.",
                                    )}</em
                                ><br />
                                <br />
                                {$t(
                                    "More detailed description of shipping, purchase, return conditions and policy:",
                                )}
                                <a
                                    href="{base}/purchase"
                                    class="underline transition duration-300 delay-100 hover:text-yellow-0"
                                    >{$t("forward link")}</a
                                >
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
