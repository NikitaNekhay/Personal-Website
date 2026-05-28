<script lang="ts">


  import {  onMount } from "svelte";

    import LoadingSpinner from "../../components/Shared/LoadingSpinner.svelte";
    import Gallery from "../../components/MainPages/Gallery.svelte";
    import type { ProductType } from "../../shared/types";
    import { getProducts } from "./post";


  let passComponent = false;
  let tempProductStore:ProductType[];
  ////console.log("mounting in posts...",passComponent);
  onMount(async() => {
    tempProductStore = await getProducts();

    passComponent = true;
  })  
</script>

<svelte:head>
  <title>List of products</title>
  <meta name="description" content="Page of products, with available options to delete or edit the item." />
</svelte:head>

{#if passComponent}
  <Gallery tempProductStore={tempProductStore}/>
{:else}
  <LoadingSpinner />
{/if}
