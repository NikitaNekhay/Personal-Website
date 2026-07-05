<script lang="ts">
    import Navbar from "../components/NavbarFooter/Navbar.svelte";
    import ContentEditor from "../components/Shared/ContentEditor.svelte";
    import { contentEditorOpen } from "../store/contentEditor";
    import { resetPageKeys } from "$lib/i18n-tracker";
    import EmptyPage from "../components/Shared/EmptyPage.svelte";
    import CustomScrollbar from "../components/Shared/CustomScrollbar.svelte";
    import RouteLoadingOverlay from "../components/Shared/RouteLoadingOverlay.svelte";
    import "../app.css";
    import Footer from "../components/NavbarFooter/Footer.svelte";
    import { page } from "$app/stores";

    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { auth, db } from "$lib/firebase/firebase";
    import { base } from "$app/paths";
    import { authStore, emptyUserData, isAdmin } from "../store/store";

    import {  onMount } from "svelte";
    import type { UserDataType } from "../shared/types";
    import { AdminRoutes, Errors, nonAuthRoutes } from "../shared/types";
    import Analytics from "../lib/Analytics.svelte";

    import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";


    let isUser: boolean = false;
    let isChanged: boolean = false;

    // Reset the per-page i18n key tracker whenever the route changes, so the
    // content editor's "This page" tab reflects the current route only.
    let lastPath = "";
    $: {
        const p = $page.url.pathname;
        if (p !== lastPath) {
            lastPath = p;
            resetPageKeys();
        }
    }

    const checkUserStatus = (user) => {
        isAdmin.set({ value: false });

        if (user) {
            //////console.log("there is a user: ", user);
            isUser = true;
            if (
                user.email === "ktofreesapiens@gmail.com" ||
                user.email === "vaper20041337@gmail.com"
            ) {
                isAdmin.set({ value: true });

            } else {
                //  ////console.log("no admin")
                isAdmin.set({ value: false });
                //$isAdmin.value = false ;
            }
        } else {
            ////console.log("there is no user: ", user);
            ////console.log("no admin")
            isUser = false;
            //$isAdmin.value = false ;
            isAdmin.set({ value: false });
            //isAdmin.update({ value: false });
        }
        let adminadmin = { value: false };
    };

    const handleRedirect = (user, currentPath) => {


        const regex = /\/posts\/([a-zA-Z0-9]+)\/edit/;

        if (
            (AdminRoutes.includes(currentPath) || currentPath.match(regex)) &&
            !$isAdmin.value
        ) {
            ////console.log("you are not admin")
            window.location.href = `${base}/`;
            return;
        }

        if (user && currentPath === `${base}/login`) {
            ////console.log("go to profile")
            window.location.href = `${base}/profile`;

            return;
        }

        if (
            !user &&
            (currentPath === `${base}/profile` ||
                currentPath === `${base}/profile/edit/credentials` ||
                currentPath === `${base}/profile/edit`)
        ) {
            ////console.log("user haven't logged in")
            window.location.href = `${base}/login`;
            return;
        }
    };

    try {
        onMount(() => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                try {
                    const currentPath = window.location.pathname;
                    checkUserStatus(user);
                    handleRedirect(user, currentPath);

                    if (!user) {
                        // Logged-out / guest: resolve auth (so `loading` settles)
                        // and clear any previous user's data — never keep it stale.
                        authStore.set({
                            user: null,
                            data: emptyUserData(),
                            loading: false,
                        });
                        return;
                    }

                    // Sensible defaults sourced from the auth user itself: used as-is
                    // for a brand-new account, and as fallbacks for any missing field.
                    let data: UserDataType = {
                        ...emptyUserData(),
                        id: user.uid,
                        name: user.displayName ?? "template",
                        email: user.email ?? "",
                        phone: user.phoneNumber ?? "",
                    };

                    try {
                        const docRef = doc(db, "user", user.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const d = docSnap.data();
                            data = {
                                id: d.id ?? user.uid,
                                name: d.name ?? data.name,
                                email: d.email ?? data.email,
                                phone: d.phone ?? data.phone,
                                country: d.country ?? "",
                                city: d.city ?? "",
                                adress: d.adress ?? "",
                                description: d.description ?? "",
                                messages: d.messages ?? [],
                                cart: d.cart ?? [],
                            };
                        } else {
                            // First sign-in: create the profile document.
                            await setDoc(docRef, data, { merge: true });
                        }
                    } catch (err) {
                        // Profile read/write failed (offline, security rules, a
                        // transient Firestore error). Keep the safe defaults so the
                        // user stays logged in with an empty cart — the header
                        // counter must never stay stuck on "?".
                        console.error("Failed to load user profile:", err);
                    }

                    authStore.set({ user, data, loading: false });
                } catch (err) {
                    // Any other unexpected failure (redirect/status helpers, etc.)
                    // must still release the loading state.
                    console.error("Auth state handling failed:", err);
                    authStore.update((s) => ({ ...s, loading: false }));
                }
            });



            return unsubscribe;
        });
    } catch (error) {
        console.error("error while mounting", error);
    }

    injectSpeedInsights(); // function to check speed of site
</script>


<Analytics />
<RouteLoadingOverlay />
<CustomScrollbar />
<Navbar />

{#if $isAdmin.value && $contentEditorOpen}
    <ContentEditor />
{/if}

{#if $page.error}
    <EmptyPage />
{:else}
    <slot />
{/if}
<Footer />
