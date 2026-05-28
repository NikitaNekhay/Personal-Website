<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { Errors, type MessageType } from "../../../shared/types";
    import {
        deleteComment,
        getComments,
        updateComment,
    } from "../../../routes/posts/comments";
    import { page } from "$app/stores";
    import { authStore, isAdmin, triggerComments } from "../../../store/store";
    import CommonPopUp from "../../Shared/CommonPopUp.svelte";
    import ConfirmationPopUp from "../../Shared/ConfirmationPopUp.svelte";


    let commentaries: MessageType[] = [];

    let editClicked = {
        value: false,
        index: -1,
    };
    let isLoading: boolean = true;
    let showTrigger: boolean;

    let isChanged: boolean = false;
    let msgT: String = "Your changes have been saved.";
    let msg: String = "Your changes have been saved.";
    let smmsg: String = "Changes saved!";
    let smmsgE: String = "Error while editing commentaries!";
    let smmsgT: String = "Changes saved!";
    let isError: boolean = false;
    let deleteConfirmOpen = false;
    let deletingComment = false;
    let pendingDeleteCommentId: string | null = null;

    onMount(async () => {
        try {
            const unsubscribe = authStore.subscribe((authStore) => {
                if ($authStore.loading) isLoading = false;
                else isLoading = true;
            });

            try {
                commentaries = await getComments();

                commentaries = commentaries.filter(
                    (obj) => obj.post === $page.params.id,
                );
            } catch (error) {
                throw Errors.FetchComments;
            }

            isLoading = false;
        } catch (err) {
            if (typeof err === "string") {
                msg = err;
            } else if (err.message !== undefined) {
                msg = err.message;
            } else {
                msg = Errors.FetchPost;
            }
            isChanged = true;
            isError = true;
            smmsg = smmsgE;
            isLoading = false;
        }
    });

    afterUpdate(async () => {
        showTrigger = $triggerComments.value;
        //////console.log(showTrigger)
    });

    function checkUserRight(comment: MessageType) {
        ////console.log($authStore.user)
        if ($authStore.user) {
            if ($authStore.user.uid === comment.id || $isAdmin.value) {
                return true;
            } else {
                return false;
            }
        } else {
            console.error("no user to check the rights");
            isLoading = false;
            return false;
        }
    }

    function handleSave(event, comment) {
        event.preventDefault();
        editClicked = !editClicked;

        try {
            updateComment(comment);
            ////console.log(comment)
            $triggerComments.value = true;

            setTimeout(() => {
                $triggerComments.value = false;
                ////console.log($triggerComments.value)
            }, 1500);
            isChanged = true;
            isError = false;
            msg = msgT;
            smmsg = smmsgT;
        } catch (error) {
            ////console.log("error while save comment")
            throw Errors.SaveComment;
        }
    }

    function handleEdit(event, commentIndex) {
        editClicked.value = !editClicked.value;
        editClicked.index = commentIndex;
    }

    function requestDelete(event, cid: string) {
        event.preventDefault();
        pendingDeleteCommentId = cid;
        deleteConfirmOpen = true;
    }

    async function confirmDeleteComment() {
        if (!pendingDeleteCommentId) return;
        deletingComment = true;
        const cid = pendingDeleteCommentId;
        try {
            $triggerComments.value = true;

            setTimeout(() => {
                $triggerComments.value = false;
                ////console.log($triggerComments.value)
            }, 1500);
            await deleteComment(cid);
            commentaries = commentaries.filter((comment) => comment.cid !== cid);
            isChanged = true;
            isError = false;
            msg = msgT;
            smmsg = smmsgT;
            deleteConfirmOpen = false;
            pendingDeleteCommentId = null;
        } catch (error) {
            isChanged = true;
            isError = true;
            msg = Errors.DeleteComment;
            smmsg = "Error";
            ////console.log("error while delete comment")
        } finally {
            deletingComment = false;
        }
    }
</script>

<ConfirmationPopUp
    bind:isOpen={deleteConfirmOpen}
    bind:isLoading={deletingComment}
    title="Delete comment"
    message="Are you sure you want to delete this comment? This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
    confirmfunction={confirmDeleteComment}
/>

{#if isChanged}
    <CommonPopUp
        bind:isChanged
        {isError}
        isPreviev={false}
        message={msg}
        smallMessage={smmsg}
        href=""
    />
{/if}

<div>
    <h1 class="text-center w-full mt-4">Commentaries:</h1>
</div>

{#key triggerComments}
    {#if commentaries.length !== 0}
        <ul>
            {#each commentaries as comment, i}
                {#if $isAdmin.value}
                    <li>{comment.id}: {comment.comment}</li>
                {:else}
                    <li>Someone thinks: {comment.comment}</li>
                {/if}

                <div class="flex items-center justify-end gap-2 bg-white p-3">
                    {#if checkUserRight(comment)}
                        <p>What to do with your comment?</p>
                        {#if editClicked && editClicked.index === i}
                            <input type="text" bind:value={comment.comment} />
                            <button
                                type="button"
                                class="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-600"
                                on:click={(event) => {
                                    handleSave(event, comment);
                                }}
                            >
                                Save
                            </button>
                        {:else}
                            <button
                                type="button"
                                class="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-600"
                                on:click={(event) => {
                                    handleEdit(event, i);
                                }}
                            >
                                Edit
                            </button>
                        {/if}

                        <button
                            type="button"
                            class="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                            on:click={(event) => {
                                requestDelete(event, comment.cid);
                            }}
                        >
                            Delete
                        </button>
                    {/if}
                </div>
            {/each}
        </ul>
    {:else}
        <div>
            <h1 class="text-center w-full mt-4">Please leave a comment!</h1>
        </div>
    {/if}
{/key}
