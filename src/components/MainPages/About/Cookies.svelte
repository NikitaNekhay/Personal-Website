<script lang="ts">
    import { t } from "svelte-i18n";
</script>

<div class="w-screen h-auto">
    <div class="flex flex-col h-auto ml-[2%] mr-[5%]">
        <div
            class="my-[20%] sm:my-[30%]
            w-3/5 sm:w-[100%] md:w-[100%]"
        >
            <section>

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Privacy Policy")}
                </h1>

                <div
                    class="my-8 border-l-2 border-red-2 bg-white-1 px-6 py-5"
                >
                    <p class="font-sans mb-0">
                        {$t("Privacy Policy building notice")}
                    </p>
                </div>

                <p>
                    {$t("Privacy Policy introduction")}
                </p>

                <p>
                    {$t("Privacy Policy last updated")}
                    <strong>{$t("Privacy Policy date")}</strong>
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("About this website")}
                </h1>

                <p>
                    {$t("Privacy Policy operator")}
                </p>

                <p>
                    {$t("Privacy Policy personal website")}
                </p>

                <p>
                    {$t("Privacy Policy contact text")}
                    <a
                        class="p-link"
                        href="mailto:nekhaymikita@gmail.com"
                    >
                        nekhaymikita@gmail.com
                    </a>.
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Personal data")}
                </h1>

                <p>
                    {$t("Personal data introduction")}
                </p>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Account data")}
                </h2>

                <p>
                    {$t("Account data description")}
                </p>

                <ul>
                    <li>
                        <p>{$t("Account data name")}</p>
                    </li>
                    <li>
                        <p>{$t("Account data email")}</p>
                    </li>
                    <li>
                        <p>{$t("Account data phone")}</p>
                    </li>
                    <li>
                        <p>{$t("Account data country city")}</p>
                    </li>
                    <li>
                        <p>{$t("Account data address")}</p>
                    </li>
                    <li>
                        <p>{$t("Account data profile")}</p>
                    </li>
                </ul>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Order data")}
                </h2>

                <p>
                    {$t("Order data description")}
                </p>

                <ul>
                    <li>
                        <p>{$t("Order data contact")}</p>
                    </li>
                    <li>
                        <p>{$t("Order data delivery")}</p>
                    </li>
                    <li>
                        <p>{$t("Order data cart")}</p>
                    </li>
                    <li>
                        <p>{$t("Order data communication")}</p>
                    </li>
                </ul>

                <p>
                    {$t("Payment data statement")}
                </p>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Technical data")}
                </h2>

                <p>
                    {$t("Technical data description")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Purposes of processing")}
                </h1>

                <p>
                    {$t("Purposes introduction")}
                </p>

                <ul>
                    <li>
                        <p>{$t("Purpose account")}</p>
                    </li>
                    <li>
                        <p>{$t("Purpose orders")}</p>
                    </li>
                    <li>
                        <p>{$t("Purpose communication")}</p>
                    </li>
                    <li>
                        <p>{$t("Purpose security")}</p>
                    </li>
                    <li>
                        <p>{$t("Purpose analytics")}</p>
                    </li>
                    <li>
                        <p>{$t("Purpose site operation")}</p>
                    </li>
                </ul>

                <p>
                    {$t("Purpose limitation")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Cookies")}
                </h1>

                <p>
                    {$t("Cookies introduction")}
                </p>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Necessary cookies")}
                </h2>

                <p>
                    {$t("Necessary cookies description")}
                </p>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Analytics cookies")}
                </h2>

                <p>
                    {$t("Analytics cookies description")}
                </p>

                <p>
                    {$t("Analytics cookies review")}
                </p>

                <h2
                    class="tracking-widest uppercase text-black-1 font-serif text-lg"
                >
                    {$t("Cookie table")}
                </h2>

                <div class="w-full overflow-x-auto">
                    <table class="w-full border-collapse text-sm">
                        <thead>
                            <tr class="border-b-2 border-black-1">
                                <th class="p-3 text-left font-medium">
                                    {$t("Cookie name")}
                                </th>
                                <th class="p-3 text-left font-medium">
                                    {$t("Cookie type")}
                                </th>
                                <th class="p-3 text-left font-medium">
                                    {$t("Cookie purpose")}
                                </th>
                                <th class="p-3 text-left font-medium">
                                    {$t("Cookie provider")}
                                </th>
                                <th class="p-3 text-left font-medium">
                                    {$t("Cookie retention")}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr class="border-b border-black-1/20">
                                <td class="p-3 align-top">
                                    nekhay_gdpr
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Necessary")}
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Cookie consent storage")}
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Website")}
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Cookie retention 400 days")}
                                </td>
                            </tr>

                            <tr class="border-b border-black-1/20">
                                <td class="p-3 align-top">
                                    _ga
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Analytics")}
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Google Analytics cookie")}
                                </td>
                                <td class="p-3 align-top">
                                    Google
                                </td>
                                <td class="p-3 align-top">
                                    {$t("According to provider configuration")}
                                </td>
                            </tr>

                            <tr class="border-b border-black-1/20">
                                <td class="p-3 align-top">
                                    _ga_R7KENNJDBP
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Analytics")}
                                </td>
                                <td class="p-3 align-top">
                                    {$t("Google Analytics session information")}
                                </td>
                                <td class="p-3 align-top">
                                    Google
                                </td>
                                <td class="p-3 align-top">
                                    {$t("According to provider configuration")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="mt-4">
                    {$t("Google third party cookies")}
                </p>

                <p>
                    {$t("Browser storage description")}
                </p>

                <p>
                    {$t("Cookie changes statement")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Third party services")}
                </h1>

                <p>
                    {$t("Third party introduction")}
                </p>

                <ul>
                    <li>
                        <p>
                            <strong>Firebase Authentication</strong> —
                            {$t("Firebase Authentication description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>Firebase Firestore</strong> —
                            {$t("Firebase Firestore description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>Google Analytics</strong> —
                            {$t("Google Analytics description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>Google Tag Manager</strong> —
                            {$t("Google Tag Manager description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>Yandex Metrica</strong> —
                            {$t("Yandex Metrica description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>Vercel Speed Insights</strong> —
                            {$t("Vercel Speed Insights description")}
                        </p>
                    </li>

                    <li>
                        <p>
                            <strong>reCAPTCHA</strong> —
                            {$t("reCAPTCHA description")}
                        </p>
                    </li>
                </ul>

                <p>
                    {$t("Third party policies")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Social media links")}
                </h1>

                <p>
                    {$t("Social media links description")}
                </p>

                <p>
                    {$t("Social media no embed")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Legal basis")}
                </h1>

                <p>
                    {$t("Legal basis introduction")}
                </p>

                <p>
                    {$t("Legal basis account")}
                </p>

                <p>
                    {$t("Legal basis order")}
                </p>

                <p>
                    {$t("Legal basis analytics")}
                </p>

                <p>
                    {$t("Legal basis cookies")}
                </p>

                <p>
                    {$t("Legal basis applicable law")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Consent")}
                </h1>

                <p>
                    {$t("Consent introduction")}
                </p>

                <p>
                    {$t("Consent necessary cookies")}
                </p>

                <p>
                    {$t("Consent withdrawal")}
                </p>

                <p>
                    {$t("Consent record")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Data sharing")}
                </h1>

                <p>
                    {$t("Data sharing introduction")}
                </p>

                <ul>
                    <li>
                        <p>{$t("Data sharing providers")}</p>
                    </li>
                    <li>
                        <p>{$t("Data sharing legal requirement")}</p>
                    </li>
                    <li>
                        <p>{$t("Data sharing security")}</p>
                    </li>
                </ul>

                <p>
                    {$t("Data sharing no sale")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Cross border processing")}
                </h1>

                <p>
                    {$t("Cross border processing description")}
                </p>

                <p>
                    {$t("Cross border processing safeguards")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Data retention")}
                </h1>

                <p>
                    {$t("Data retention introduction")}
                </p>

                <p>
                    {$t("Data retention account")}
                </p>

                <p>
                    {$t("Data retention orders")}
                </p>

                <p>
                    {$t("Data retention cookies")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Your rights")}
                </h1>

                <p>
                    {$t("Your rights introduction")}
                </p>

                <ul>
                    <li>
                        <p>{$t("Right information")}</p>
                    </li>
                    <li>
                        <p>{$t("Right correction")}</p>
                    </li>
                    <li>
                        <p>{$t("Right deletion")}</p>
                    </li>
                    <li>
                        <p>{$t("Right withdraw")}</p>
                    </li>
                    <li>
                        <p>{$t("Right restriction")}</p>
                    </li>
                    <li>
                        <p>{$t("Right complaint")}</p>
                    </li>
                </ul>

                <p>
                    {$t("Rights limitations")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Data security")}
                </h1>

                <p>
                    {$t("Data security description")}
                </p>

                <p>
                    {$t("Data security limitation")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Children")}
                </h1>

                <p>
                    {$t("Children description")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Policy changes")}
                </h1>

                <p>
                    {$t("Policy changes description")}
                </p>

                <p>
                    {$t("Policy changes date")}
                </p>

                <br />

                <h1
                    data-scrollmark
                    class="tracking-widest text-black-1 uppercase font-serif text-2xl"
                >
                    {$t("Contact")}
                </h1>

                <p>
                    {$t("Contact description")}
                </p>

                <p>
                    <a
                        class="p-link"
                        href="mailto:nekhaymikita@gmail.com"
                    >
                        nekhaymikita@gmail.com
                    </a>
                </p>

                <br />

                <p>
                    {$t("Privacy Policy legal disclaimer")}
                </p>

            </section>
        </div>
    </div>
</div>

<style>
    h1 {
        @apply my-4;
    }

    h2 {
        @apply my-4;
    }

    p {
        @apply font-sans mb-2;
    }

    li {
        @apply list-disc ml-4;
    }

    table {
        @apply font-sans;
    }

    th,
    td {
        vertical-align: top;
    }

    @media only screen and (max-width: 640px) {
        table {
            min-width: 760px;
        }
    }
</style>