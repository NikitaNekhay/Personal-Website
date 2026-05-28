<script lang="ts">
  import { onMount } from "svelte";
  import Gallery from "../../components/MainPages/Gallery.svelte";
  import LoadingSpinner from "../../components/Shared/LoadingSpinner.svelte";
  import type { ProductType } from "../../shared/types";
  import { getProducts } from "../posts/post";
    import { t } from "svelte-i18n";
  let passComponent = false;
  let tempProductStore: ProductType[];
  onMount(async () => {
    ////console.log("mounting in posts...", passComponent);
    tempProductStore = await getProducts();
    passComponent = true;
  });
</script>

<svelte:head>
  <title>{$t("NEKHAY NIKITA - DESIGNER SHOP")}</title>
  <meta
    name="description"
    content={$t("Shop page of available clothes made by NIKITA. There you can scroll down and see the images, available sizes and price. Tap on the image and check the details.")}
  />

  <meta
  property="og:title"
  content={$t("NEKHAY NIKITA - DESIGNER SHOP")}
/>
<meta
  property="og:description"
  content={$t("Shop page of available clothes made by NIKITA. There you can scroll down and see the images, available sizes and price. Tap on the image and check the details."
  )}
/>
<meta property="og:type" content="website" />
<meta
  property="og:image"
  content="https://lh3.googleusercontent.com/pw/ABLVV849q3OAFt3dNbHh5oichVxRiu3Q6vBl6-m4hNikPR0bXi2Es-u3XHiueD-dqbboyBaWXt1JDq9GLmfPZxuTrWYMHAxGCqKqEY6bIHQxz8w9nrBsm_q51OM5WQkAwd8y7xA6IVOod726Mig9kQ_8FlrvpX_eEHoQBjLKm5EOX0lSnX-ZAQRth86XLjXyhoMmCMBnXvSUfnlXI9rsA66c7NhIZiNJ_J9CGt1LRWkidhIQNRs_-YFIM_6iixEAhjT6VJRuGPucUpbHLCq1fA2TOD65Ounkgo_i92i2ttze-o48SUbu6C8YzFrtxZ-75Kcp5Uw13KgVNV6vkiFyUWP9PQKPFrfkKpjX3PtTJoElMR2kJOJTFlb7NqCV00hfGrIzCsS6sGH6u-gHc6QoJPMtOYoeJfF0B_bv_JGH3ad--a4sqEed_iKMWt5TNMd9aDVDVETR0ilnBZ7IGmt32Ozr3WWxHNf7zFYAX6LbbzyZQPxGilUgKZg_3EoJUzKwr6DFWhcvVJe9pEFR_sDFvwZOXB1LJJMI04bZVaz2QpI_9WzTv7eMQHT4WWPI0M8YT-o38B8s8Kq59q-IH-lxwKmmSjbB4bHoLujnIWDRyXCPPrIt5Olp53JvSWKu9E_6mv2_zx6vwXJ1borunbNDYFL-liEHidar_QiR51Hv1Amk4o3I0TDZKYmbyeJ6ToGzUxWAmMHhe5ZlTjKQJcwYOe76bnOhJhMAFI695ElB2hBpRsjkPwHZRLUI018wCXttBrLUbmggENSFJ2fhaq8qIJ7kdfFadLUZ4btX53ngVgAPfzST4TTsDzTVPG7n576HzAZp3waADmvHPCUGD5LJVOkZ1V7lJiMc64GNgUnjZ5mVGOxGbWqnk2OkZRNdGo-VS3QvVtzTBTZVZiKJSyhuRszSasLDMDVOlEQoB3vW6GtvUlIwyvJoTUZ6HAbgT6F5yUZRunLNbTtOKuPOgmuAdg7LM86uCgtqNyD1HRjCicbhBJDg_X95qOtYXQoZHb_6VPFWDYp4Qd4=w623-h934-s-no-gm?authuser=0"
/>
<meta property="og:url" content="https://nekhaynikita.ru/shop" />

<meta name="twitter:image" content="https://lh3.googleusercontent.com/pw/ABLVV849q3OAFt3dNbHh5oichVxRiu3Q6vBl6-m4hNikPR0bXi2Es-u3XHiueD-dqbboyBaWXt1JDq9GLmfPZxuTrWYMHAxGCqKqEY6bIHQxz8w9nrBsm_q51OM5WQkAwd8y7xA6IVOod726Mig9kQ_8FlrvpX_eEHoQBjLKm5EOX0lSnX-ZAQRth86XLjXyhoMmCMBnXvSUfnlXI9rsA66c7NhIZiNJ_J9CGt1LRWkidhIQNRs_-YFIM_6iixEAhjT6VJRuGPucUpbHLCq1fA2TOD65Ounkgo_i92i2ttze-o48SUbu6C8YzFrtxZ-75Kcp5Uw13KgVNV6vkiFyUWP9PQKPFrfkKpjX3PtTJoElMR2kJOJTFlb7NqCV00hfGrIzCsS6sGH6u-gHc6QoJPMtOYoeJfF0B_bv_JGH3ad--a4sqEed_iKMWt5TNMd9aDVDVETR0ilnBZ7IGmt32Ozr3WWxHNf7zFYAX6LbbzyZQPxGilUgKZg_3EoJUzKwr6DFWhcvVJe9pEFR_sDFvwZOXB1LJJMI04bZVaz2QpI_9WzTv7eMQHT4WWPI0M8YT-o38B8s8Kq59q-IH-lxwKmmSjbB4bHoLujnIWDRyXCPPrIt5Olp53JvSWKu9E_6mv2_zx6vwXJ1borunbNDYFL-liEHidar_QiR51Hv1Amk4o3I0TDZKYmbyeJ6ToGzUxWAmMHhe5ZlTjKQJcwYOe76bnOhJhMAFI695ElB2hBpRsjkPwHZRLUI018wCXttBrLUbmggENSFJ2fhaq8qIJ7kdfFadLUZ4btX53ngVgAPfzST4TTsDzTVPG7n576HzAZp3waADmvHPCUGD5LJVOkZ1V7lJiMc64GNgUnjZ5mVGOxGbWqnk2OkZRNdGo-VS3QvVtzTBTZVZiKJSyhuRszSasLDMDVOlEQoB3vW6GtvUlIwyvJoTUZ6HAbgT6F5yUZRunLNbTtOKuPOgmuAdg7LM86uCgtqNyD1HRjCicbhBJDg_X95qOtYXQoZHb_6VPFWDYp4Qd4=w623-h934-s-no-gm?authuser=0" />
<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if passComponent}
  <Gallery {tempProductStore} />
{:else}
  <LoadingSpinner />
{/if}
