<script lang="ts">
    import { onMount } from "svelte";
    import ShoppingCart from "../../../components/MainPages/Profile/ShoppingCart.svelte";
    import LoadingSpinner from "../../../components/Shared/LoadingSpinner.svelte";
    import CountryData from "../../../CountryData.json";
    import { t } from "svelte-i18n";
    import { cart } from "../../../store/cart_store_";
    import { authStore } from "../../../store/store";
    import { base } from "$app/paths";

    let userCountry = "Unknown";
    let userCity = "Unknown";

    // onMount(async () => {
    //     // Fetch the user's IP and location using a public IP API (consider using a more private/secure method in production)
    //     const res = await fetch("https://ipapi.co/json/");
    //     const locationData = await res.json();
    //     //console.log(locationData);
    //     if (locationData && locationData.country && locationData.city) {
    //         userCountry = locationData.country;
    //         userCity = locationData.city;

    //         if (!$authStore.user) {
    //             //console.log("cart in page.svelte cart",$cart)
    //             $cart.country = userCountry;
    //             $cart.city = userCity;
    //         }
    //     } else {
    //         //console.log("bad luck on fetch");
    //     }
    // });

    onMount(async () => {
        try {
            const res = await fetch(
                "https://ipinfo.io/json?token=f795a8243455e9",
            );
            const locationData = await res.json();

            if (locationData && locationData.country && locationData.city) {
                userCountry = locationData.country;
                userCity = locationData.city;

                if (!$authStore.user) {
                    $cart.country = userCountry;
                    $cart.city = userCity;
                }
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    });

    const sendEmailPost = async (
        to: string,
        subject: string,
        text: string,
        type: string,
    ) => {
        //console.log("here");
        const response = await fetch(`${base}/api/sendEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: to,
                subject: subject,
                text: text,
                type: type,
            }),
        });

        //console.log(response);

        if (response.ok) {
            console.log("Email sent");
        } else {
            console.error("Failed to send email");
        }
    };
</script>

<svelte:head>
    <title>{$t("SHOPPING CART")}</title>
    <meta
        name="description"
        content={$t(
            "Page of shopping cart and checkout. You can fill all required forms: country, name, contacts, delivery, purchase method. You will get calculated price of your order and then you can follow to purchase it.",
        )}
    />

    <meta property="og:title" content={$t("SHOPPING CART")} />
    <meta
        property="og:description"
        content={$t(
            "Page of shopping cart and checkout. You can fill all required forms: country, name, contacts, delivery, purchase method. You will get calculated price of your order and then you can follow to purchase it.",
        )}
    />

    <meta property="og:type" content="website" />

    <meta property="og:image" content="" />

    <meta
        property="og:url"
        content="https://nekhaynikita.ru/profile/shoppingcart"
    />
</svelte:head>

{#if userCountry !== "Unknown"}
    <ShoppingCart countries={CountryData} sendEmail={sendEmailPost} />
{:else}
    <LoadingSpinner />
{/if}
