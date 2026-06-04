<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { t } from "svelte-i18n";
  import { currentLanguagee } from "../../store/store_";
  import { fadeInImage } from "../../services/fadeInImage";
  import { trackEngagement } from "../../services/engagement";
  import { prefetchImages } from "../../services/imagePreload";
  import Bookmark from "../Shared/Bookmark.svelte";

  // Bookmark sections for /works. "Project 1" is the current page (stays put);
  // "Custom Editions" routes to the sibling page. Rendered as a single row.
  const worksSections = [
    { label: "Project 1", active: true, onSelect: () => {} },
    {
      label: "Custom Editions",
      active: false,
      onSelect: () => goto(`${base}/works/custom_editions`),
    },
  ];
  let innerWidth = 0;
  let innerHeight = 0;
  let reverseDisplay = "w-[100%] w-screen mb-44";
  if (innerHeight < 600) {
    reverseDisplay = "w-[100%] w-screen mb-44";
  }

  let root; // обёртка страницы — через неё находим все <img> для fade-in

  onMount(() => {
    if (!root) return;

    // Картинки здесь захардкожены внешними URL (без системы thumbs), поэтому
    // вместо blur-up применяем общий плавный fade-in ко всем <img>.
    // Мобильная/десктопная сетки рендерятся по innerWidth, который обновляется
    // уже после mount → набор <img> в DOM меняется. Поэтому ловим и текущие,
    // и будущие картинки через MutationObserver, помечая обработанные data-флагом.
    const cleanups = [];

    const apply = (img) => {
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

    // Предзагрузка по вовлечённости — та же логика, что на главной и в магазине.
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
      {$t("PROJECT 1 CAPSULE COLLECTION")}
    </h1>
  </div>
</section>
{#if innerWidth <= 1024}
  <section class={reverseDisplay}>
    <div class="">
      <div>
        <div class="flex">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F1IMGL9203s.jpg?alt=media&token=94cc9adb-c4b9-4e7c-896c-62dbbf279b5d"
            alt="polar bear 1"
            title="polar bear 1"
            class=" h-3/12 w-4/12"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F2IMGL9199s.jpg?alt=media&token=148ce209-950b-4439-ab70-e71ee476264c"
            alt="polar bear 2"
            title="polar bear 2"
            class="h-5/12 w-4/12"
          />
          <div
            class=" bg-cover bg-top w-6/12 h-3/12 bg-[url('https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa')]"
          ></div>
        </div>

        <div class="flex justify-end">
          <div
            class=" bg-cover bg-center w-6/12 h-3/12 bg-[url('https://lh3.googleusercontent.com/pw/AJFCJaWePvjATJe1e5cXk9NParsCaTLT-yE9OTvbGdfsFynItQJ9fg9y_m6bSkK6YqEoFvuvzm3LXxrArlNBxk9DOVg8nmaGH3_RascPJ3m6tSXs9OECRsk=w2400')]"
          ></div>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa"
            alt="chanel 1"
            title="chanel 1"
            class="h-4/12 w-4/12"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMGL9167s.jpg?alt=media&token=90f0214b-12f1-4b91-8068-0133adc43ba70"
            alt="chanel 2"
            title="chanel 2"
            class="h-4/12 w-4/12"
          />
        </div>

        <div class="flex justify-center">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2Fblack2.jpg?alt=media&token=3134c183-7480-4d84-aa4c-6819bf5afde6"
            alt="black 1"
            title="black 1"
            class="h-6/12 w-4/12"
          />

          <img
            src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2Fblack1.jpg?alt=media&token=5dfc90fe-3c78-4f3f-a657-fb2bcfaaca4a"
            alt="black 2"
            title="black 2"
            class="h-6/12 w-4/12"
          />
        </div>
        <div class="flex justify-center">
          <img
            src="https://lh3.googleusercontent.com/I5xvTDQQaLkBipQksD7O02OtjBu0Bb3jUG3H0S7bEqKeO9GovQkF66dS1ZW_Xr2B5BtIwAmFBlxZ7590NOQoIiu7g8qXY3hy9CAVWYUgNO41tqxIUt9GFcKySWqdFcag4xb5fXjRNA=w2400"
            alt="tank 1"
            title="tank 1"
            class="h-6/12 w-4/12"
          />

          <img
            src="https://lh3.googleusercontent.com/AEs9uGffV9Ie4KZoNo5f6ykdIRBM968xjamb3zNlFZQ0KlXHOokOpdTm1JPDgFPFv_2adC6lTNv0S4P5HZtQcaqf_tG8aFKS4qilaoVukeTK-91LbygHwtlFOKdXXZCimy2QiMv4YQ=w2400"
            alt="tank 2"
            title="tank 2"
            class="h-6/12 w-4/12"
          />

          <img
            src="https://lh3.googleusercontent.com/z2ebtCAt5Vrc7loda-LbpH0dtxCx1wRAezzsK3nqYX8egPQTuAe60lFy2kxhyE8dSq_N8A4_4vz0n3sTGUjn6wxscU0G7SmtfCO00fWdKxPMWEjanAQLGFqFQj61iwqOxol8Q7fEDQ=w2400"
            alt="tank 3"
            title="tank 3"
            class="h-6/12 w-4/12"
          />
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
      <!-- <div class=" w-1/6 ">
          3
        </div >  -->
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
        <div class="sm:w-10/12">
          <a
            class=" transition duration-300 delay-100 hover:text-yellow-0"
            href="{base}/posts/wR5Vkuzy3Xc7XeGK4aVI">{$t("circled tank top")}</a
          >
        </div>
      </div>
      {#if innerWidth > 1024}
        <div class="w-3/12 sm:w-0 relative -top-0">
          <div>
            <div class="">
              <div class="flex">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F1IMGL9203s.jpg?alt=media&token=94cc9adb-c4b9-4e7c-896c-62dbbf279b5d"
                  alt="polar bear 1"
                  title="polar bear 1"
                  class=" h-3/12 w-5/12"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F2IMGL9199s.jpg?alt=media&token=148ce209-950b-4439-ab70-e71ee476264c"
                  alt="polar bear 2"
                  title="polar bear 2"
                  class="h-5/12 w-5/12"
                />
                <div
                  class=" bg-cover bg-top w-6/12 h-3/12 bg-[url('https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa')]"
                ></div>
              </div>

              <div class="flex justify-end">
                <div
                  class=" bg-cover bg-center w-6/12 h-3/12 bg-[url('https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa')]"
                ></div>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2F3IMGL9124s.jpg?alt=media&token=85ce8965-3ca9-4530-8027-101b2371c9fa"
                  alt="chanel 1"
                  title="chanel 1"
                  class="h-4/12 w-4/12"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2FIMGL9167s.jpg?alt=media&token=90f0214b-12f1-4b91-8068-0133adc43ba7"
                  alt="chanel 2"
                  title="chanel 2"
                  class="h-4/12 w-4/12"
                />
              </div>

              <div class="flex justify-center">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2Fblack2.jpg?alt=media&token=3134c183-7480-4d84-aa4c-6819bf5afde6"
                  alt="black 1"
                  title="black 1"
                  class="h-6/12 w-6/12"
                />

                <img
                  src="https://firebasestorage.googleapis.com/v0/b/personal-website-with-svelte.appspot.com/o/images%2Fblack1.jpg?alt=media&token=5dfc90fe-3c78-4f3f-a657-fb2bcfaaca4a"
                  alt="black 2"
                  title="black 2"
                  class="h-6/12 w-6/12"
                />
              </div>
              <div class="flex justify-center">
                <img
                  src="https://lh3.googleusercontent.com/I5xvTDQQaLkBipQksD7O02OtjBu0Bb3jUG3H0S7bEqKeO9GovQkF66dS1ZW_Xr2B5BtIwAmFBlxZ7590NOQoIiu7g8qXY3hy9CAVWYUgNO41tqxIUt9GFcKySWqdFcag4xb5fXjRNA=w2400"
                  alt="tank 1"
                  title="tank 1"
                  class="h-6/12 w-5/12"
                />

                <img
                  src="https://lh3.googleusercontent.com/AEs9uGffV9Ie4KZoNo5f6ykdIRBM968xjamb3zNlFZQ0KlXHOokOpdTm1JPDgFPFv_2adC6lTNv0S4P5HZtQcaqf_tG8aFKS4qilaoVukeTK-91LbygHwtlFOKdXXZCimy2QiMv4YQ=w2400"
                  alt="tank 2"
                  title="tank 2"
                  class="h-6/12 w-5/12"
                />

                <img
                  src="https://lh3.googleusercontent.com/z2ebtCAt5Vrc7loda-LbpH0dtxCx1wRAezzsK3nqYX8egPQTuAe60lFy2kxhyE8dSq_N8A4_4vz0n3sTGUjn6wxscU0G7SmtfCO00fWdKxPMWEjanAQLGFqFQj61iwqOxol8Q7fEDQ=w2400"
                  alt="tank 3"
                  title="tank 3"
                  class="h-6/12 w-5/12"
                />
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
</div>
