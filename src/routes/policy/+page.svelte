<script>
    import { t } from "svelte-i18n";

</script>

<svelte:head>
  <title>{$t("POLICY")}</title>
  <meta
    name="description"
    content={$t(
      "Policies working in internet. Detailed and suffisticated information about cookies and processing user's data.",
    )}
  />

  <meta property="og:title" content={$t("POLICY")} />
  <meta
    property="og:description"
    content={$t(
      "Policies working in internet. Detailed and suffisticated information about cookies and processing user's data.",
    )}
  />

  <meta property="og:type" content="article" />

  <meta
    property="og:image"
    content=""
  />

  <meta property="og:url" content="https://nekhaynikita.ru/policy" />
</svelte:head>

<div class="grid h-screen px-4 bg-white place-content-center">
  <h1 class="tracking-widest text-center text-black-1 uppercase font-abril text-3xl">
    404 | {$t("Currently this page is under the maintenance!")}<br>
    
  </h1>
</div>
