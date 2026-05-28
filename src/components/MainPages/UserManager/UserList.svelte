<script lang="ts">
    import { base } from "$app/paths";
    import { handleDelete as deleteUserProfile, updateUserProfile } from "../../../routes/profile/user";
    import type { UserDataType } from "../../../shared/types";
    import { t } from "svelte-i18n";
    import ConfirmationPopUp from "../../Shared/ConfirmationPopUp.svelte";


    export let userProfiles:UserDataType[];
    export let latestProfiles:UserDataType[];
    let triggerProfiles:UserDataType[]=[];
    let deleteConfirmOpen = false;
    let deletingUser = false;
    let pendingDeleteUser: UserDataType | null = null;



    async function handleSubmit(curentUser) {
    // event.preventDefault();
    //////console.log(curentUser)
    if(curentUser && userProfiles && latestProfiles){
        
        try {
        
      await updateUserProfile(
        curentUser,
        userProfiles[userProfiles.indexOf(curentUser)].name,
        userProfiles[userProfiles.indexOf(curentUser)].email,
        userProfiles[userProfiles.indexOf(curentUser)].phone,
        userProfiles[userProfiles.indexOf(curentUser)].country,
        userProfiles[userProfiles.indexOf(curentUser)].city,
        userProfiles[userProfiles.indexOf(curentUser)].description,
        userProfiles[userProfiles.indexOf(curentUser)].messages,
        userProfiles[userProfiles.indexOf(curentUser)].cart
      )
        .then(() => {
          ////console.log("Profile updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating profile:", error.message);
        });

      //window.location.href = `${base}/profile/edit/`
    } catch (error) {
      console.error("error while sumbitting changes for a user",error);
    }
    } else {
        ////console.log("passed vairables don't exist in UserList")
    }
   
  }

  function requestDeleteUser(user: UserDataType) {
    pendingDeleteUser = user;
    deleteConfirmOpen = true;
  }

  async function confirmDeleteUser() {
    if (!pendingDeleteUser) return;
    deletingUser = true;
    try {
      await deleteUserProfile(pendingDeleteUser.id);
      userProfiles = userProfiles.filter((item) => item.id !== pendingDeleteUser?.id);
      latestProfiles = latestProfiles.filter((item) => item.id !== pendingDeleteUser?.id);
      pendingDeleteUser = null;
      deleteConfirmOpen = false;
    } catch (error) {
      console.error("error while deleting user", error);
    } finally {
      deletingUser = false;
    }
  }
</script>

{#key userProfiles}
{#each latestProfiles as user, i}
<tr>
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    <div class="mt-4 flex">
      <div
        class="place -mx-3 mb-6 flex flex-wrap place-content-center"
      >
        <div class="w-full px-3">
          <label
            class="relative block overflow-hidden
            rounded-md border border-transparent
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2"
            for="first-name"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent
            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              type="text"
              bind:value={user.name}
              required
              id="name"
              autocomplete="given-name"
            />
            <span
              class=" whitespace-no-wrap absolute start-3 top-3 -translate-y-1/2
                cursor-text text-xs text-gray-900 transition-all peer-placeholder-shown:top-1/2
                peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
            >
              {$t("Enter the name")}
            </span>
          </label>
        </div>
      </div>
    </div></td
  >
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    <p class="whitespace-no-wrap text-gray-900">
      {#if user.email === "ktofreesapiens@gmail.com" || user.email === "vaper20041337@gmail.com"}
        {$t("Admin")}
      {:else}
        {$t("User")}
      {/if}
    </p>
  </td>
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    <div class="mt-4 flex">
      <div
        class="place -mx-3 mb-6 flex flex-wrap place-content-center"
      >
        <div class="w-full px-3">
          <label
            class="relative block overflow-hidden
            rounded-md border border-transparent
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2"
            for="first-name"
          >
            <input
              class="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent
            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              type="text"
              bind:value={user.email}
              required
              id="email"
              autocomplete="given-name"
            />
            <span
              class=" whitespace-no-wrap absolute start-3 top-3 -translate-y-1/2
                cursor-text text-xs text-gray-900 transition-all peer-placeholder-shown:top-1/2
                peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
            >
              {$t("Enter email")}
            </span>
          </label>
        </div>
      </div>
    </div></td
  >
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    <p class="whitespace-no-wrap text-gray-900">
      {#if user.cart}
        {user.cart.length}
    {:else}
        cart is undefined
      {/if}
    </p>
  </td>
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    <span
      class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
    >
      <span
        aria-hidden="true"
        class="absolute inset-0 rounded-full bg-green-200 opacity-50"
      ></span>
      <span class="relative">{user.id}</span>
    </span>
  </td>
  <td
    class="border-b border-gray-200 bg-white px-5 py-5 text-sm"
  >
    {#if i === 0}
      <ConfirmationPopUp
        bind:isOpen={deleteConfirmOpen}
        bind:isLoading={deletingUser}
        title="Delete user"
        message={pendingDeleteUser
          ? `Are you sure you want to delete "${pendingDeleteUser.email}" from Firestore? Auth account deletion is not handled here.`
          : "Are you sure you want to delete this user?"}
        confirmText="Delete"
        cancelText="Cancel"
        confirmfunction={confirmDeleteUser}
      />
    {/if}
    <div class="flex justify-items-center gap-4">
      <div class="">
        <div
          class="group relative inline-block text-sm font-medium text-black-1
          hover:cursor-pointer focus:outline-none focus:ring active:text-black-1"
          on:click={() => handleSubmit(user)}
          on:keypress={() => handleSubmit(user)}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          role="button"
          tabindex="0"
        >
          <span
            class="absolute inset-0 translate-x-0 translate-y-0 bg-navy-1 transition-transform
            group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          ></span>

          <span
            class="relative block border border-current bg-white px-8 py-3"
          >
            <img
              class="mr-1"
              alt="setting"
              src="{base}/media/edit.svg"
            />
          </span>
        </div>
      </div>
      <div>
        <div
          class="group relative inline-block text-sm font-medium text-black-1
            hover:cursor-pointer focus:outline-none focus:ring active:text-black-1"
          on:click={() => {
            requestDeleteUser(user);
          }}
          on:keypress={() => {
            requestDeleteUser(user);
          }}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          role="button"
          tabindex="0"
        >
          <span
            class="absolute inset-0 translate-x-0 translate-y-0 bg-navy-1 transition-transform
            group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          ></span>

          <span
            class="relative block border border-current bg-white px-8 py-3"
          >
            <img
              class="mr-1"
              alt="setting"
              src="{base}/media/trash.svg"
            />
          </span>
        </div>
      </div>
    </div>
  </td>
</tr>
{/each}
{/key}
