<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { getUserProfile, updateUserProfile } from "../../../routes/profile/user";
  import type { User } from "firebase/auth";
  import { auth, db } from "../../../lib/firebase/firebase";
  import { authHandlers, authStore, currentLanguage } from "../../../store/store";
  import { base } from "$app/paths";
  import { clickOutside } from "../../../services/clickOutside";
  import ProfileOptions from "./ProfileOptions.svelte";
  import { addMessages, locale, t } from "svelte-i18n";
  import ru from "../../../services/ru.json";
  import ProfileEditDone from "./ProfileEditDone.svelte";
  import en from "../../../services/en.json";
  import LoadingButton from "../../Shared/LoadingButton.svelte";

  let sumbitClicked = false;
  let isLoading = false;

  let profileValue = {
    name: "",
    email: "",
    phone: "",
    country: "",
    description: "",
    messages: [],
  };

  onMount(() => {
    //console.log("updating profile...")
    isLoading = false;
    //console.log("authStore in prfile.svelte before everything",$authStore);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      let Ready_profile = await getUserProfile(user);
      if (user) {
        //  console.log("Restoring profileValue from user profile data");
        profileValue.name = Ready_profile.name ?? profileValue.name;
        profileValue.email = Ready_profile.email ?? profileValue.email;
        profileValue.phone = Ready_profile.phone ?? profileValue.phone;
        profileValue.country = Ready_profile.country ?? profileValue.country;
        profileValue.description =
          Ready_profile.description ?? profileValue.description;
        profileValue.messages = Ready_profile.messages ?? profileValue.messages;

        //   console.log($authStore)
        //   if (!$authStore.data) {
        //   // Restore profileValue from user profile data
        //   profileValue.name = Ready_profile.name;
        //   profileValue.email = Ready_profile.email;
        //   profileValue.phone = Ready_profile.phone;
        //   profileValue.country = Ready_profile.country;
        //   profileValue.description = Ready_profile.description;
        //   profileValue.messages = Ready_profile.messages;
        // } else {
        //   // Use the values from authStore
        //   profileValue.name = $authStore.data.name;
        //   profileValue.email = $authStore.data.email;
        //   profileValue.phone = $authStore.data.phone;
        //   profileValue.country = $authStore.data.country;
        //   profileValue.description = $authStore.data.description;
        //   profileValue.messages = $authStore.data.messages;
        // }

        // updateUserProfile(
        //   user,
        //   profileValue.name,
        //   profileValue.email,
        //   profileValue.phone,
        //   profileValue.country,
        //   profileValue.description,
        //   profileValue.messages
        // );

        //  console.log("after onMount",isLoading)
      } else {
        console.log("no user in Profile.svelte");
      }
    });
    return unsubscribe;
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const user = auth.currentUser;
    sumbitClicked = true;
    //console.log("authStore in prfile.svelte before handling",$authStore.data);
    try {
      await updateUserProfile(
        user,
        profileValue.name,
        profileValue.email,
        profileValue.phone,
        profileValue.country,
        profileValue.description,
        profileValue.messages
      )
        .then(() => {
          console.log("Profile updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating profile:", error.message);
        });

      isLoading = true;
      //console.log("after submit",isLoading)
      window.location.href = `${base}/profile/#`;
      //window.location.href = `${base}/profile/edit/`
    } catch (error) {
      console.error(error);
    }
    // console.log("authStore in prfile.svelte after handling",$authStore.data);
  }

  let isView = false;
</script>

<div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
  <!-- {#if isLoading}
    <ProfileEditDone />
  {/if} -->

  <ProfileOptions />

  <div class="place mt-40 flex place-content-center">
    <form class="w-full max-w-lg">
      <div class=" mb-6 flex justify-center">
        <h1 class="font-abril text-4xl text-blue-0">{$t("EDIT PROFILE")}</h1>
      </div>

      <div class="-mx-3 mb-6 flex flex-wrap">
        <div class="w-full px-3">
          <label
            class="relative block overflow-hidden rounded-md
            border border-gray-200 bg-white-1
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2"
            for="first-name"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              type="text"
              bind:value={profileValue.name}
              required
              id="name"
              autocomplete="given-name"
            />
            <span
              class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
              bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
            >
              {$t("User name")}
            </span>
          </label>
        </div>
      </div>
      <div class="-mx-3 mb-4 flex flex-wrap">
        <div class="h-full w-full px-3">
          <label
            class="relative block overflow-hidden rounded-md
            border border-gray-200 bg-white-1
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2"
            for="description"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent
              bg-white-1 p-0 placeholder-transparent
              focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              bind:value={profileValue.description}
              id="description"
              placeholder="Description"
            />
            <span
              class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
              bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
            >
              {$t("Short description about you")}
            </span>
          </label>
          <p class="mt-3 text-xs italic text-gray-600">
            {$t("Don't hesitate write as much as you want")}
          </p>
        </div>
      </div>

      <div class="-mx-3 mb-6 flex flex-wrap">
        <div class="w-full px-3">
          <label
            class="relative block overflow-hidden rounded-md
            border border-gray-200 bg-white-1
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2"
            for="email"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent
              bg-white-1 p-0 placeholder-transparent
              focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              type="email"
              bind:value={profileValue.email}
              required
              id="email"
              autocomplete="email"
              placeholder="email@web.net"
            />
            <span
              class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
              bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
            >
              {$t("Email")}
            </span>
          </label>
        </div>
      </div>

      <div class="-mx-3 mb-6 flex flex-wrap">
        <div class=" w-1/2 px-3">
          <label
            class="relative block overflow-hidden rounded-md
              border border-gray-200 bg-white-1
              px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
              focus-within:ring-white-2"
            for="phone-number"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
                focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              type="tel"
              bind:value={profileValue.phone}
              id="phone"
              required
              autocomplete="tel"
            />
            <span
              class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                  bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                  peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
            >
              {$t("Phone number")}
            </span>
          </label>
        </div>
        <div class="w-1/2 px-3">
          <label
            class="relative block overflow-hidden rounded-md
              border border-gray-200 bg-white-1
              px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
              focus-within:ring-white-2"
            for="first-name"
          >
            <select
              class=" peer h-[34px] w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
              focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              id="country"
              bind:value={profileValue.country}
              required
            >
              <option value="">-- {$t("Select Country")} --</option>
              <option value="Russia">Russia</option>
              <option value="Europe">Asia</option>
              <option value="Europe">Europe</option>
              <option value="South America">South America</option>
              <option value="North America">North America</option>
              <option value="Australia">Africa</option>
              <option value="Australia">Australia</option>
              <option value="Antarctic">Antarctic</option>
            </select>
            <span
              class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
            >
              {$t("Country")}
            </span>
          </label>
        </div>
      </div>

      {#if sumbitClicked && !isLoading}
        <LoadingButton />
      {:else}
        <button
          class="group relative mx-[136px] flex
    w-1/2 items-center justify-center overflow-hidden
     rounded-md border border-orange-0
    px-8 py-3 focus:outline-none"
          type="button"
          on:click={handleSubmit}
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px]
      bg-orange-0 transition-all group-hover:h-full
      group-active:bg-orange-0"
          />

          <span
            class="relative text-sm font-medium
      text-orange-0 transition-colors group-hover:text-white"
          >
            {$t("Submit")}
          </span>
        </button>
      {/if}

    </form>
  </div>
</div>
