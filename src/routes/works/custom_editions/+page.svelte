<script>
  import { t } from "svelte-i18n";
  import WorksCustomEditions from "../../../components/MainPages/WorksCustomEditions.svelte";
</script>

<svelte:head>
  <title>{$t("NEKHAY NIKITA - CUSTOM EDITIONS")}</title>
  <meta
    name="description"
    content={$t(
      "Custom editions by NEKHAY NIKITA — bespoke pieces and special one-off works.",
    )}
  />
  <meta property="og:title" content={$t("NEKHAY NIKITA - CUSTOM EDITIONS")} />
  <meta
    property="og:description"
    content={$t(
      "Custom editions by NEKHAY NIKITA — bespoke pieces and special one-off works.",
    )}
  />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://nekhaynikita.ru/works/custom_editions" />
</svelte:head>

<WorksCustomEditions />
