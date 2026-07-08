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
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8858.jpeg?alt=media&token=60858796-6e39-4ef8-99ca-3820bd4a231a",
      alt: "custom edition 1",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8862.jpeg?alt=media&token=34793a68-6490-4712-91fc-1379ff802be7",
      alt: "custom edition 2",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8859.jpeg?alt=media&token=cd474c3d-b232-4936-9f1b-c217b1e50d0f",
      alt: "custom edition 3",
    },
  ];

  const editionPhotos2 = [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8858.jpeg?alt=media&token=60858796-6e39-4ef8-99ca-3820bd4a231a",
      alt: "custom edition 1",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8862.jpeg?alt=media&token=34793a68-6490-4712-91fc-1379ff802be7",
      alt: "custom edition 2",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_8859.jpeg?alt=media&token=cd474c3d-b232-4936-9f1b-c217b1e50d0f",
      alt: "custom edition 3",
    },
  ];

  const editionPhotos3 = [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_6832.jpeg?alt=media&token=1ee90fbb-aa46-408e-a4db-565e3a2de03d",
      alt: "custom edition 1",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_6833.jpeg?alt=media&token=0f629d7e-b84f-4aa0-8f5d-b158c002bf15",
      alt: "custom edition 2",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMG_6834.jpeg?alt=media&token=f5a2326e-e73a-43c7-acb1-a5abda4c1430",
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
  <Bookmark
    items={worksSections}
    ariaLabel="Open works sections"
    peekLabel="Project 1"
  />
  <section class="h-screen">
    <div
      class="grid h-[100%] px-4 bg-white place-content-center lg:mb-0 md:mb-48 sm:mb-48"
    >
      <h1
        data-scrollmark
        class="tracking-widest mb- text-black-1 font-abril text-6xl sm:text-4xl text-center"
      >
        {$t("CUSTOM EDITIONS")}
      </h1>
    </div>
  </section>

  <!-- ITEM 1 -->

  {#if innerWidth <= 1024}
    <section class={reverseDisplay}>
      <div class="">
        <div>
          <div class="flex justify-center gap-2">
            {#each editionPhotos as photo}
              <img
                src={photo.src}
                alt={photo.alt}
                title={photo.alt}
                class="h-6/12 w-4/12"
              />
            {/each}
          </div>
        </div>
      </div>
    </section>
  {/if}

  <section class="h-[100%] w-screen mb-20 lg:mb-20 xl:mb-80">
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
                "Turquoise, blue color not only of the sky and plants, but also of this piece...",
              )}
              <br /><br />
              {$t(
                "Nothing but simple. Premium Italian Polo by Luigi Borrelli with a mock pad with pearlescent buttons, which are now not only on the collar but also cover the waist.",
              )}<br /><br />
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
              data-scrollmark data-scrollmark-level="2"
              class=" transition duration-300 delay-100 hover:text-yellow-0"
              href="https://nekhaynikita.ru/posts/66wHBRhOuZJldIYccHFL">{$t("Borrelli polo with a perl pad")}</a
            >
          </div>

        </div>
        {#if innerWidth > 1024}
          <div class="w-3/12 sm:w-0 relative -top-0">
            <div class="flex flex-col items-center gap-y-6">
              {#each editionPhotos as photo}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.alt}
                  class="w-9/12"
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- ITEM 2 -->

  {#if innerWidth <= 1024}
    <section class={reverseDisplay}>
      <div class="">
        <div>
          <div class="flex justify-center gap-2">
            {#each editionPhotos2 as photo}
              <img
                src={photo.src}
                alt={photo.alt}
                title={photo.alt}
                class="h-6/12 w-4/12"
              />
            {/each}
          </div>
        </div>
      </div>
    </section>
  {/if}

  <section class="h-[100%] w-screen mb-20 lg:mb-20 xl:mb-80">
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
                "Restored classic women's silk jacket by Brioni",
              )}
              <br /><br />
              {$t(
                "Traditional Japanese repair technique used in the middle of the sleeves.",
              )}
              <br /><br />
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
              class=" transition duration-300 delay-100 hover:text-yellow-0"
              data-scrollmark data-scrollmark-level="2"
              href="https://nekhaynikita.ru/posts/q2TNLSgH5flUxH4DhTXo">{$t("Vintage Brioni in the sashiko technique")}</a
            >
          </div>
        </div>
        {#if innerWidth > 1024}
          <div class="w-3/12 sm:w-0 relative -top-0">
            <div class="flex flex-col items-center gap-y-6">
              {#each editionPhotos2 as photo}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.alt}
                  class="w-9/12"
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- ITEM 3 -->

  {#if innerWidth <= 1024}
    <section class={reverseDisplay}>
      <div class="">
        <div>
          <div class="flex justify-center gap-2">
            {#each editionPhotos3 as photo}
              <img
                src={photo.src}
                alt={photo.alt}
                title={photo.alt}
                class="h-6/12 w-4/12"
              />
            {/each}
          </div>
        </div>
      </div>
    </section>
  {/if}

  <section class="h-[100%] w-screen mb-20 lg:mb-20 xl:mb-80">
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
                "Classic Adidas shirt with three stripes, which begged to be renovated. Now wearer not only streams German culture, but outlines his identity through the unique design, having a ribbed waistband which is in it's nature a majority of stripes.",
              )}
              <br /><br />
              {$t(
                "White on the white… Just words from a song.. But no, here it is beige on white. What could it mean? Reluctance to submit to standards and rules? A desire for perfection and constant change?",
              )}
              <br /><br />
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
              class=" transition duration-300 delay-100 hover:text-yellow-0"
              data-scrollmark data-scrollmark-level="2"
              href="https://nekhaynikita.ru/posts/Ho7Mq63c5YKequeCYbQo">{$t("Adidas shirt with a ribbed waistband")}</a
            >
          </div>
        </div>
        {#if innerWidth > 1024}
          <div class="w-3/12 sm:w-0 relative -top-0">
            <div class="flex flex-col items-center gap-y-6">
              {#each editionPhotos3 as photo}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.alt}
                  class="w-9/12"
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>
</div>
