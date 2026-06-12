<script lang="ts">
    import { authHandlers } from "../../store/store";
    import {  t } from "svelte-i18n";
    import { base } from "$app/paths";
    import { Errors } from "../../shared/types";
    import CommonPopUp from "../Shared/CommonPopUp.svelte";
    import SubmitButton from "../Shared/SubmitButton.svelte";

    let innerWidth = 0;
    let innerHeight = 0;

    let isPassHidden:boolean = true;
    let submitClicked = false;
    let isLoading = true;

    let register = false;
    let authenticating = false;

    let isChanged: boolean = false;
    let msg: String = "";
    let smmsg: String = "Something went wrong while creating your account.";

    let email = "";
    let password = "";
    let rpassword = "";



    function togglePasswordVisibility(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        isPassHidden = !isPassHidden;
    }

    async function handleAuthenticate() {
        if (authenticating) return;

        try {
            submitClicked = true;
            isLoading = true;
            authenticating = true;

            if (register && rpassword !== password) {
                throw Errors.RepeatPass;
            }

            if (
                register &&
                (email.length === 0 || password.length === 0 || rpassword.length === 0)
            ) {
                throw Errors.EmptyInput;
            }

            if (!register && (email.length === 0 || password.length === 0)) {
                throw Errors.EmptyInput;
            }

            if (!register) {
                await authHandlers.login(email, password);
            } else {
                await authHandlers.signup(email, password);
            }
        } catch (err: unknown) {
            if (typeof err === 'string') {
                msg = err;
            } else if (err instanceof Error && err.message) {
                msg = err.message;
            } else {
                msg = register ? Errors.Register : Errors.Authentication;
            }
            isChanged = true;
        } finally {
            isLoading = false;
            authenticating = false;
            setTimeout(() => {
                submitClicked = false;
            }, 2500);
        }
    }

    function handleFormSubmit(e: SubmitEvent) {
        e.preventDefault();
        handleAuthenticate();
    }

    function handleRegister() {
        register = !register;
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if isChanged}
    <CommonPopUp
        bind:isChanged
        isPreviev={false}
        isError={true}
        message={msg}
        smallMessage={smmsg}
        href=""
    />
{/if}
<section class="h-screen w-screen 3xl:pb-[40%] 2xl:pb-[40%] xl:pb-[40%]">
    <div
        class="flex place-content-center px-[20%] py-[14%] sm:px-6 sm:py-[25%] 
        {innerWidth > 620 ? 'md:py-[15%]' : 'md:py-[25%]'} lg:px-8 xl:py-[8%] 2xl:py-[8%] 3xl:py-[9%]"
    />
    <div>
        <header class="mb-6 justify-center text-center">
            <h1 class="font-abril text-4xl text-blue-0">
                {register ? $t("REGISTER") : $t("LOGIN")}
            </h1>
        </header>

        <div class="flex sm:px-[4%] place-content-center">
            <form
                class="w-full max-w-lg flex flex-col justify-center items-center"
                method="post"
                onsubmit={handleFormSubmit}
            >
                <div class="-mx-3 mb-6 flex flex-wrap w-full">
                    <div class="w-full px-3">
                        <label
                            class="relative block overflow-hidden rounded-md
                            border border-gray-200 bg-white-1
                            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
                            focus-within:ring-white-2"
                            for="email"
                        >
                        
                        <div class="text-gray-400 absolute right-3 inset-y-2 my-auto active:text-gray-600"
                      
                        >
                        <img src="{base}/media/envelop.svg" alt="mail icon">
                        </div> 
                            <input
                                class="peer h-8 w-full border-none bg-transparent
                            bg-white-1 p-0 placeholder-transparent
                            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="email"
                                autocomplete="email"
                                bind:value={email}
                            />
                            <span
                                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                            bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                            peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
                            >
                                {$t("Email")}
                                
                            </span>
                            
                        </label>
                    </div>
                </div>

                <div class="-mx-3 mb-3 flex flex-wrap w-full">
                    <div class="w-full px-3">
                        <label
                            class="relative block overflow-hidden rounded-md
                            border border-gray-200 bg-white-1
                            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
                            focus-within:ring-white-2"
                            for="password"
                        >

                        <button
                            type="button"
                            class="text-gray-400 absolute right-3 inset-y-0 z-10 my-auto active:text-gray-600"
                            aria-label={isPassHidden ? 'Show password' : 'Hide password'}
                            onclick={togglePasswordVisibility}
                        >
                            {#if isPassHidden}
                                <img src="{base}/media/closed-eye.svg" alt="" />
                            {:else}
                                <img src="{base}/media/open-eye.svg" alt="" />
                            {/if}
                        </button>
                            <input
                            class="peer h-8 w-full border-none bg-transparent
                        bg-white-1 p-0 placeholder-transparent
                        focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                            bind:value={password}
                            id="password"
                            placeholder="Password"
                            name="password"
                            type={isPassHidden ? 'password' : 'text'}
                            autocomplete="current-password"
                            required
                        />

                            <span
                                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                            bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                            peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
                            >
                                {$t("Password")}
                            </span>
                        </label>
                        <p class="mt-3 text-xs italic text-gray-600">
                            {$t(
                                "Password must consist at least from 6 symbols",
                            )}
                        </p>
                    </div>
                </div>

                {#if register}
                    <div class="-mx-3 mb-3 flex flex-wrap w-full">
                        <div class="w-full px-3">
                            <label
                                class="relative block overflow-hidden rounded-md
                            border border-gray-200 bg-white-1
                            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
                            focus-within:ring-white-2"
                                for="password"
                            >
                                <input
                                    class="peer h-8 w-full border-none bg-transparent
                            bg-white-1 p-0 placeholder-transparent
                            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                    bind:value={rpassword}
                                    id="rpassword"
                                    placeholder="   Repeat password"
                                    name="rpassword"
                                    type={isPassHidden ? 'password' : 'text'}
                                    autocomplete="new-password"
                                    required
                                />
                                <span
                                    class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                            bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                            peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
                                >
                                    {$t("Repeat Password")}
                                </span>
                            </label>
                        </div>
                    </div>
                {/if}

                <SubmitButton
                    bind:submitClicked
                    bind:isLoading
                    passedfunction={handleAuthenticate}
                    text={"Submit"}
                />
            </form>
        </div>
        <div class="flex h-2/6">
            <div class="options">
                {#if register}
                    <div>
                        <p>
                            {$t("Already have an account?")}
                        </p>
                        <button
                            tabindex="0"
                            class=" bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
                             duration-300 delay-100 bg-clip-text font-anonymous text-base font-extrabold text-transparent transition hover:text-red-0 hover:opacity-75"
                            type="button"
                            onclick={handleRegister}
                            onkeydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') handleRegister();
                            }}
                        >
                            {$t("Login")}
                        </button>
                    </div>
                {:else}
                <div>
                    <p class="">{$t("Don't have an account?")}</p>
    
                    <button
                        tabindex="0"
                        class="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
                         duration-300 delay-100 hover:opacity-75 hover:text-red-0  bg-clip-text font-anonymous text-base font-extrabold text-transparent transition "
                        type="button"
                        onclick={handleRegister}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') handleRegister();
                        }}
                    >
                        {$t("Register")}
                    </button>
                </div>

                {/if}
            </div>
        </div>
    </div>
</section>

<style>
    h1 {
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    form,
    .options {
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }


    .options {
        padding: 14px 0;
        overflow: hidden;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .options div {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
    }
</style>
