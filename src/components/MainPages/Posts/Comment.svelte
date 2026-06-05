<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "svelte-i18n";
  import { authStore, triggerComments } from "../../../store/store";
  import type { MessageType } from "../../../shared/types";
  import { page } from "$app/stores";
  import { addComment } from "../../../routes/posts/comments";

  let currentComment: MessageType = {
    id: "",
    post: "",
    comment: "",
  };

  onMount(async () => {
    if ($authStore.user) {
      currentComment.id = $authStore.user.uid;
      currentComment.post = $page.params.id;
    }
  });

  function handleSubmit(event) {
    if (currentComment.comment.length !== 0) {
      addComment(currentComment);

      $triggerComments.value = true;

      setTimeout(() => {
        $triggerComments.value = false;
        ////console.log($triggerComments.value)
      }, 1500);
    } else {
      console.error("please enter the comments");
      return;
    }
    ////console.log(currentComment);
  }
</script>

<div>
  <h1>{$t("Your comment")}</h1>

  <div
    class="overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
  >
    <textarea
      id="OrderNotes"
      class="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
      rows="4"
      placeholder="Enter any additional order notes..."
      bind:value={currentComment.comment}
    ></textarea>

    <div class="flex items-center justify-end gap-2 bg-white p-3">
      <button
        type="button"
        class="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        on:click={(event) => {
          handleSubmit(event);
        }}
      >
        Add
      </button>
    </div>
  </div>
</div>
