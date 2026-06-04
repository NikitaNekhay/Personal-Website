<script>
  // Carbon copy of Works.svelte for the "Custom Editions" section. Same layout and
  // copy; the only structural difference is the right-hand gallery shows just 3
  // photos. The bookmark mirrors Works' but with "Custom Editions" active and
  // "Project 1" routing back to /works.
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { t } from "svelte-i18n";
  import { currentLanguagee } from "../../store/store_";
  import { fadeInImage } from "../../services/fadeInImage";
  import { trackEngagement } from "../../services/engagement";
  import { prefetchImages } from "../../services/imagePreload";
  import Bookmark from "../Shared/Bookmark.svelte";

  let innerWidth = 0;
  let innerHeight = 0;
  let reverseDisplay = "w-[100%] w-screen mb-44";
  if (innerHeight < 600) {
    reverseDisplay = "w-[100%] w-screen mb-44";
  }

  const worksSections = [
    {
      label: "Project 1",
      active: false,
      onSelect: () => goto(`${base}/works`),
    },
    { label: "Custom Editions", active: true, onSelect: () => {} },
  ];

  // Just three photos on the right for this section.
  const editionPhotos = [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F1IMGL9203s.jpg?alt=media&token=94cc9adb-c4b9-4e7c-896c-62dbbf279b5d",
      alt: "custom edition 1",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F2IMGL9199s.jpg?alt=media&token=148ce209-950b-4439-ab70-e71ee476264c",
      alt: "custom edition 2",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa",
      alt: "custom edition 3",
    },
  ];

  /** @type {HTMLDivElement} */
  let root; // обёртка страницы — через неё находим все <img> для fade-in

  onMount(() => {
    if (!root) return;

    /** @type {Array<() => void>} */
    const cleanups = [];

    const apply = (/** @type {HTMLImageElement} */ img) => {
      if (img.dataset.fadeBound) return;
      img.dataset.fadeBound = "1";
      img.loading = "lazy";
      img.decoding = "async";
      const handle = fadeInImage(img);
      if (handle?.destroy) cleanups.push(handle.destroy);
    };

    const scan = () => root.querySelectorAll("img").forEach(apply);

    scan();

    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    const stopEngagement = trackEngagement({
      scrollEngageMs: 400,
      onEngaged: () => {
        const urls = Array.from(root.querySelectorAll("img"))
          .map((img) => img.currentSrc || img.src)
          .filter(Boolean);
        prefetchImages(urls);
      },
    });

    return () => {
      mo.disconnect();
      cleanups.forEach((destroy) => destroy());
      stopEngagement();
    };
  });
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div bind:this={root}>
<Bookmark items={worksSections} ariaLabel="Open works sections" peekLabel="Project 1" />
<section class="h-screen">
  <div
    class="grid h-[100%] px-4 bg-white place-content-center lg:mb-0 md:mb-48 sm:mb-48"
  >
    <h1
      class="tracking-widest mb- text-black-1 font-abril text-6xl sm:text-4xl text-center"
    >
      {$t("CUSTOM EDITIONS")}
    </h1>
  </div>
</section>
{#if innerWidth <= 1024}
  <section class={reverseDisplay}>
    <div class="">
      <div>
        <div class="flex justify-center gap-2">
          {#each editionPhotos as photo}
            <img src={photo.src} alt={photo.alt} title={photo.alt} class="h-6/12 w-4/12" />
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}
<section class="h-[100%] w-screen mb-20 lg:mb-20 xl:mb-80 ">
  <div class="col-span-full sm:h-full">
    <div class="posts flex sm:h-full sm:self-center">
      <div class=" text-transparent w-1/12"></div>
      <div
        class="h-auto w-4/12 sm:w-5/12 mb-20 sm:mb-0 sm:place-content-center justify-center self-center font-anonymous
        text-2xl sm:text-sm md:text-xl lg:text-xl"
      >
        <article class="hyphens-auto" lang={$currentLanguagee}>
          <p>
            {$t(
              "This is a presentation of first capsule collection made by my hands. Also it is my early experience in clothes' making.",
            )}
            <br /><br />
            {$t(
              "Basis of the idea encourages my interest in nature, fashion history and thoughts of future. References during the design stage were my feelings and memories. Not only the clothes, but the lookbook in the whole represent my sight on different things and events. Together they create digital, futuristic, anthic, and sexy appearence.",
            )}
            <br /><br />
            {$t("Each garment is very important and keeps it's own story.")}<br
            />
            {$t("")}<br />
            {$t(
              "It's very important for me to see your attention and support that will provide continuing and growth of this art.",
            )}<br />
          </p>
        </article>
      </div>
      <div class="flex w-1/12">
        <div class=" w-1/2 sm:w-[30%] border-r-2 border-navy-2"></div>
        <div class=" w-1/2 sm:w-[30%] border-l-2 border-navy-2"></div>
      </div>
      <div
        class="h-auto grid w-3/12 md:w-6/12 sm:w-5/12 break-words sm:gap-y-30 justify-center self-center font-anonymous text-2xl sm:text-lg gap-y-20"
        lang={$currentLanguagee}
      >
        <div class="sm:w-10/12">
          <a
            class="transition duration-300 delay-100 hover:text-yellow-0"
            href="{base}/posts/CgF16bXhfrKo5WmhEwgZ"
            >{$t("'Polar bear' longsleeve")}</a
          >
        </div>
        <div class="sm:w-10/12">
          <a
            class=" transition duration-300 delay-100 hover:text-yellow-0"
            href="{base}/posts/js65QLblGNmOhZVTl6W5">{$t("Chanel jacket")}</a
          >
        </div>
        <div class="sm:w-10/12">
          <a
            class=" transition duration-300 delay-100 hover:text-yellow-0"
            href="{base}/posts/5qv9ICdoxyPrFvc4aqEP"
            >{$t("assymetric longsleeve")}</a
          >
        </div>
      </div>
      {#if innerWidth > 1024}
        <div class="w-3/12 sm:w-0 relative -top-0">
          <div class="flex flex-col items-center gap-y-6">
            {#each editionPhotos as photo}
              <img src={photo.src} alt={photo.alt} title={photo.alt} class="w-9/12" />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
</div>
