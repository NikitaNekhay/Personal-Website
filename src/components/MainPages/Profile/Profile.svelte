<script lang="ts">
  import { onMount } from "svelte";
  import {
    getUserProfile,
    updateUserProfile,
  } from "../../../routes/profile/user";
  import { auth } from "../../../lib/firebase/firebase";
  import { isAdmin } from "../../../store/store";
  import { base } from "$app/paths";

  import ProfileOptions from "./ProfileOptions.svelte";
  import {  t } from "svelte-i18n";

  import LoadingSpinner from "../../Shared/LoadingSpinner.svelte";
  import type { UserDataType } from "../../../shared/types";


  let isLoading = true; // Initialize the loading state

  let userCountry = "Unknown";
  let userCity = "Unknown";

  let profileValue: UserDataType;
  let isthereadmin = false;

  onMount(() => {
    isthereadmin = $isAdmin.value;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          let Ready_profile: UserDataType = await getUserProfile(user);

          if (Ready_profile) {
            profileValue = Ready_profile;

            // Parse the creation time from the metadata
            const creationTime = new Date(user.metadata.creationTime);
            const currentTime = new Date();
            const timeDiffMinutes =
              (currentTime.getTime() - creationTime.getTime()) / (1000 * 60);

            if (timeDiffMinutes <= 3) {
              const res = await fetch("https://ipapi.co/json/");
              const locationData = await res.json();

              if (locationData && locationData.country && locationData.city) {
                userCountry = locationData.country;
                userCity = locationData.city;

                // Update user profile with fetched country and city
                profileValue.country = userCountry;
                profileValue.city = userCity;

                // Update user profile in Firebase
                await updateUserProfile(
                  user,
                  profileValue.name,
                  profileValue.email,
                  profileValue.phone,
                  profileValue.country,
                  profileValue.city,
                  profileValue.description,
                  profileValue.messages,
                  profileValue.cart,
                );

              } else {
                //console.log("Bad luck on fetch");
              }
            }

            isLoading = false;
          } else {
            window.location.href = `${base}/`;
            return;
          }
          // ////console.log("Restoring profileValue from user profile data",profileValue);
        } else {
          ////console.log("no user in Profile.svelte");
          return;
        }
      } catch (error) {
        console.error("error while updating profile", error);
        return;
      }
    });
    return unsubscribe;
  });

  let isView = true;
</script>

<div class="isolate bg-white px-10 pt-36">
  <div>
    <ProfileOptions />
  </div>
  {#if isLoading || !profileValue}
    <LoadingSpinner />
  {:else}
    <div>
      <div class="mt-6 border-t border-gray-100">
        <div class="ml-8">
          <dl class="divide-y divide-gray-100">
            <div class="grid grid-cols-4 gap-4 px-4 py-6 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">
                {$t("User name")}
              </dt>
              <dd
                class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              >
                {profileValue.name}
              </dd>
            </div>

            <div class="grid grid-cols-4 gap-4 px-4 py-6 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">
                {$t("Email address")}
              </dt>
              <dd
                class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              >
                {profileValue.email}
              </dd>
            </div>
            <div class="grid grid-cols-4 gap-4 px-4 py-6 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">
                {$t("Country")}
              </dt>
              <dd
                class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              >
                {profileValue.country} : {profileValue.city} 
              </dd>
            </div>
            <div class="grid grid-cols-4 gap-4 px-4 py-6 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">
                {$t("Number phone")}
              </dt>
              <dd
                class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              >
                {profileValue.phone}
              </dd>
            </div>
            <div class="grid grid-cols-4 gap-4 px-4 py-6 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">
                {$t("About")}
              </dt>
              <dd
                class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              >
                {profileValue.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  {/if}

  <!-- <div /> -->
</div>
