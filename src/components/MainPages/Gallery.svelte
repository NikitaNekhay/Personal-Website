<script lang="ts">
  // import states
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { deleteProduct, handleCart } from "../../routes/posts/post";
  import { base } from "$app/paths";
  import { authStore, isAdmin, productStore } from "../../store/store";
  import { t } from "svelte-i18n";
  import { currentLanguagee } from "../../store/store_";

  import NoPosts from "../Shared/NoPosts.svelte";
  import LoadingSpinner from "../Shared/LoadingSpinner.svelte";
  import { fadeInImage } from "../../services/fadeInImage";
  import { trackEngagement } from "../../services/engagement";
  import { prefetchImages } from "../../services/imagePreload";
  import {
    Errors,
    type AuthStoreType,
    type ProductType,
  } from "../../shared/types";
  import CartAdded from "../Shared/CartAdded.svelte";
  import CommonPopUp from "../Shared/CommonPopUp.svelte";
  import ConfirmationPopUp from "../Shared/ConfirmationPopUp.svelte";
  import SquareButton from "../Shared/SquareButton.svelte";

  let isLoading: boolean = true;
  let isEmpty: boolean = false;
  let passComponent = false;
  export let tempProductStore: ProductType[];
  let tempAuthStore: AuthStoreType;
  let isChangedCart: boolean = false;
  let isChanged: boolean = false;
  let msg: String = "";
  let smmsg: String = "Something went wrong while scrolling the shop.";
  let deleteConfirmOpen = false;
  let deletingProduct = false;
  let pendingDeleteProduct: ProductType | null = null;

  onMount(async () => {
    try {
      isLoading = true;
      isEmpty = false;
      passComponent = false;

      const unsubscribe = authStore.subscribe((authStore) => {
        // get user info for cart
        tempAuthStore = authStore;
        ////console.log(tempAuthStore);
      });

      // Fetch blog posts from the database
      if (tempProductStore.length === 0) {
        isEmpty = true;
      }
      isLoading = false;
      //////console.log(tempProductStore);
      if (!passComponent) {
        const interval = setTimeout(() => {
          ////console.log("gall");
          passComponent = true;
        }, 2000);
      }
    } catch (error) {}
  });

  // Умная предзагрузка фото товаров: ждём, пока пользователь вовлечётся
  // (залип/скроллит), и только потом «разогреваем» превью всех карточек, чтобы
  // при скролле сетки они появлялись мгновенно и плавно. Логика общая с главной.
  onMount(() => {
    const stopEngagement = trackEngagement({
      scrollEngageMs: 400,
      onEngaged: () => {
        const urls = (tempProductStore ?? [])
          .map((p) => p.images?.[0])
          .filter((url): url is string => Boolean(url));
        prefetchImages(urls);
      },
    });

    return () => {
      stopEngagement();
    };
  });

  function handleClick(id: string) {
    // Navigate to the detailed page of the selected blog post
    ////console.log("handle click for ", id);
    $productStore.id = id;
    //////console.log($productStore.id);
    window.location.href = `${base}/posts/${id}`;
  }

  async function handleCartClicked(post: ProductType) {
    try {
      await handleCart(post, tempAuthStore);
      // HANDLE DOUBLE CLICK
      if (isChangedCart) {
        isChangedCart = false;
        setTimeout(() => {
          isChangedCart = true;
        }, 700);
      } else {
        isChangedCart = !isChangedCart;
      }
    } catch (err) {
      ////console.log("error in gallery");
      if (typeof err === "string") {
        msg = err;
      } else if (err.message !== undefined) {
        msg = err.message;
      } else {
        msg = Errors.AddToCart;
      }
      isChanged = true;
      throw msg;
    }
  }

  function handleEdit(id: string) {
    // Navigate to the edit page of the selected blog post
    $productStore.id = id;
    window.location.href = `${base}/posts/${id}/edit`;
  }

  function requestDelete(post: ProductType) {
    pendingDeleteProduct = post;
    deleteConfirmOpen = true;
  }

  async function confirmDeleteProduct() {
    if (!pendingDeleteProduct) return;
    deletingProduct = true;
    const productToDelete = pendingDeleteProduct;

    try {
      await deleteProduct(productToDelete.id);
      tempProductStore = tempProductStore.filter((post) => post.id !== productToDelete.id);
      isEmpty = tempProductStore.length === 0;
      msg = `"${productToDelete.title}" was deleted.`;
      smmsg = "Changes saved";
      isError = false;
      isChanged = true;
      deleteConfirmOpen = false;
      pendingDeleteProduct = null;
    } catch (err) {
      msg = err instanceof Error ? err.message : Errors.DeletePost || "Error while deleting product.";
      smmsg = "Error";
      isError = true;
      isChanged = true;
    } finally {
      deletingProduct = false;
    }
  }
</script>

<ConfirmationPopUp
  bind:isOpen={deleteConfirmOpen}
  bind:isLoading={deletingProduct}
  title="Delete product"
  message={pendingDeleteProduct
    ? `Are you sure you want to delete "${pendingDeleteProduct.title}"? This action cannot be undone.`
    : "Are you sure you want to delete this product? This action cannot be undone."}
  confirmText="Delete"
  cancelText="Cancel"
  confirmfunction={confirmDeleteProduct}
/>

<section class="bg-white">
  <div
    class="px-8 py-28
  sm:py-28 md:py-28 xl:py-28 2xl:py-32 3xl:py-32
  sm:px-4 md:px-6 lg:px-11 xl:px-14 2xl:px-20"
  >
    {#if isLoading}
      <LoadingSpinner />
    {:else if isEmpty}
      <NoPosts />
    {:else}
      <div
        class="grid grid-cols-3
        sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
        gap-x-24 sm:gap-x-24 md:gap-x-4 xl:gap-x-16 2xl:gap-x-20
        gap-y-6 xl:gap-y-20
        "
      >
        {#if isChangedCart}
          <CartAdded bind:isChangedCart />
        {/if}
        {#if isChanged}
          <CommonPopUp
            bind:isChanged
            isError={true}
            isPreviev={false}
            message={msg}
            smallMessage={smmsg}
          />
        {/if}
        {#key tempProductStore.length}
          {#each tempProductStore as post}
            {#if !post.isArchive || $isAdmin.value}
              <div class="flex" transition:fade={{ duration: 180 }}>
                <div class=" h-[800px]">
                  <div
                        on:click={() => handleClick(post.id)}
                        on:keypress={() => handleClick(post.id)}
                        class=" overflow-hidden  bg-gray-200 hover:cursor-pointer transition duration-200 delay-100 hover:scale-105 hover:animate-pulse
                      "
                        aria-expanded="true"
                        aria-haspopup="true"
                        role="button"
                        tabindex="0"
                  >
                    <img
                      src={post.images[0]}
                      alt="Blog Post"
                      class="object-cover w-[100%] h-[620px] "
                      loading="lazy"
                      decoding="async"
                      use:fadeInImage
                    />
                  </div>
                  <div
                    class="mt-2 flex flex-col sm:flex-col md:flex-col justify-between shadow-xl p-4 sm:p-3 md:p-3"
                  >
                    <div
                      class="sm:grid sm:grid-flow-col sm:cols-2
                    md:grid md:grid-flow-col md:cols-2 grid grid-flow-col cols-2"
                    >
                      <h3
                        class="sm:grid sm:grid-cols-2 md:grid md:grid-cols-2 grid grid-cols-2 text-lg font-bold text-gray-900 sm:text-xl"
                      >
                        <div
                          class="sm:col-span-1 md:col-span-2  break-words"
                          lang={$currentLanguagee}
                        >
                          {$t(post.title)}
                        </div>
                      </h3>
                      {#if post.isArchive}
                        <div
                          class="grid col-span-1 sm:grid sm:col-span-1 md:grid md:col-span-1 sm:justify-end md:justify-end "
                        >
                          <img
                            src="{base}/media/archive.svg"
                            alt="archive icon"
                          />
                        </div>
                      {/if}

                      <!-- SIZES -->
                      <!-- <div>
                        <h3 class=" text-sm text-gray-700">
                          <div
                            class="flex flex-row gap-x-4 md:gap-x-2 sm:justify-center md:justify-end {post
                              .description['sizes'].length > 3
                              ? 'md:grid md:grid-cols-2'
                              : ''}"
                          >
                            {#each post.description["sizes"] as sizeItem}
                              <p>{sizeItem}</p>
                            {/each}
                          </div>
                        </h3>
                      </div> -->
                    </div>
                    <div
                      class="mx-3 sm:mx-0 md:mx-0 lg:mx-3 xl:mx-3
            flex  flex-col place-items-start
            sm:flex-col sm:place-items-start md:flex-col md:place-items-start"
                    >
                      <h2
                        class="break-words text-gray-700 text-center self-center
                        sm:self-start sm:text-left
                        md:self-end md:text-right"
                        lang={$currentLanguagee}
                      >
                        {$t(post.description["smallDescription"])}
                      </h2>
                    </div>
                    {#if $isAdmin.value}
                      <div
                        class="flex flex-row gap-8 justify-center  md:flex-row md:justify-around sm:flex-row sm:justify-around
                        "
                      >
                        <SquareButton
                          passedfunction={() => {
                            handleEdit(post.id);
                          }}
                          typeSquare="edit"
                        />
                        <SquareButton
                          passedfunction={() => {
                            requestDelete(post);
                          }}
                          typeSquare="delete"
                        />
                      </div>
                    {:else}
                      <div
                        class="grid-rows grid items-center justify-items-end
                    sm:grid-cols-2 sm:justify-items-stretch
                    md:grid-cols-2 md:justify-items-stretch"
                      >
                        <div
                          class=" sm:grid-col-1 sm:col-span-1 md:grid-col-1 md:col-span-1"
                        >
                          <p
                            class="font-anonymous text-3xl font-medium text-gray-900"
                          >
                            {post.price}BYN
                          </p>
                        </div>
                        <!-- <div
                          class="md:grid md:justify-items-end md:grid-col-2 md:grid-col-span-1
                      sm:grid sm:justify-items-end sm:grid-col-2 sm:grid-col-span-1
                       "
                        >
                          <SquareButton
                            passedfunction={() => {
                              handleCartClicked(post);
                            }}
                            typeSquare="cart"
                          />
                        </div> -->
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        {/key}
      </div>
    {/if}
  </div>
</section>
