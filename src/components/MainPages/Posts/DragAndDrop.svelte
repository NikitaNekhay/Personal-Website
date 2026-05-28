<script lang="ts">
    import { base } from "$app/paths";
    import { onDestroy } from "svelte";
    import type { ProductType } from "../../../shared/types";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import { storage } from "$lib/firebase/firebase";
    import InfoGuide from "../../Shared/InfoGuide.svelte";
    import ConfirmationPopUp from "../../Shared/ConfirmationPopUp.svelte";

    export let tempProductStore: ProductType;
    let dragTargetIndex: number | null = null;
    let removeConfirmOpen = false;
    let pendingRemoveIndex: number | null = null;

    async function uploadImage(image: File) {
        try {

            const storageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("error while uploading the image", error);
        }
    }

    async function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            tempProductStore.images = Array.from(input.files);
            const imageUrls = await Promise.all(
                tempProductStore.images.map(uploadImage),
            );
            tempProductStore.images = imageUrls.filter(
                (url): url is string => url !== undefined,
            );
            ////console.log(tempProductStore)
            ////console.log(tempProductStore.images)
        }
    }

    function dragstart(event: DragEvent, index: number) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", index.toString());
    }

    function drop(event: DragEvent, targetIndex: number) {
        const sourceIndex = parseInt(event.dataTransfer.getData("text/plain"));
        let updatedImages = [...tempProductStore.images];
        const [removed] = updatedImages.splice(sourceIndex, 1);
        updatedImages.splice(targetIndex, 0, removed);
        tempProductStore.images = updatedImages;
        dragTargetIndex = null;
    }

    function removeImage(index: number) {
        let updatedImages = [...tempProductStore.images];
        updatedImages.splice(index, 1);
        tempProductStore.images = updatedImages;
    }

    function requestRemoveImage(index: number) {
        pendingRemoveIndex = index;
        removeConfirmOpen = true;
    }

    function confirmRemoveImage() {
        if (pendingRemoveIndex === null) return;
        removeImage(pendingRemoveIndex);
        pendingRemoveIndex = null;
        removeConfirmOpen = false;
    }

    function dragover(event: DragEvent) {
        event.preventDefault();
    }

    function dragenter(event: DragEvent, index: number) {
        event.preventDefault();
        dragTargetIndex = index;
    }

    function dragleave(event: DragEvent) {
        event.preventDefault();
        dragTargetIndex = null;
    }

    onDestroy(() => {
        tempProductStore.images.forEach((image) => {
            if (typeof image !== "string") {
                URL.revokeObjectURL(image.name);
            }
        });
    });
</script>

<ConfirmationPopUp
    bind:isOpen={removeConfirmOpen}
    title="Remove image"
    message="Remove this image from the product edit list? Save the product afterwards to keep the change."
    confirmText="Remove"
    cancelText="Cancel"
    confirmfunction={confirmRemoveImage}
/>

<div class="p-3 rounded mx-auto w-full h-auto bg-white-0">
    <div
        class="relative flex flex-col p-1 text-gray-400 border bg-white-2 border-white-0 rounded-md"
    >
        <div
            class="relative flex flex-col text-gray-400 bg-white-1 border border-navy-1 border-dashed rounded cursor-pointer"
        >
            <input
                type="file"
                multiple
                class="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                on:change={handleImageUpload}
                title=""
            />
            <div
                class="flex flex-col items-center justify-center py-10 text-center"
            >
                <img src="{base}/media/cloud-upload.svg" alt="upload icon" />
                <div>
                    <p class="mb-2 text-sm text-gray-00 inline-flex items-center justify-center gap-2">
                        <span>
                            <span class="font-semibold">Click to upload</span> or drag
                            and drop
                        </span>
                        <InfoGuide text="Product images are uploaded to Firebase Storage immediately. The first image becomes the shop card cover; drag thumbnails below to change order." />
                    </p>
                    <p class="text-xs text-gray-00">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div>
            </div>
        </div>

        {#if tempProductStore.images.length > 0}
            <div
                class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6 w-full h-auto"
            >
                {#each tempProductStore.images as url, index}
                    <div
                        class="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
                        class:highlight={dragTargetIndex === index}
                        draggable="true"
                        on:dragstart={(event) => dragstart(event, index)}
                        on:dragover={dragover}
                        on:dragenter={(event) => dragenter(event, index)}
                        on:dragleave={dragleave}
                        on:drop={(event) => drop(event, index)}
                        role="button"
                        tabindex="0"
                    >
                        <button
                            class="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
                            type="button"
                            on:click={() => requestRemoveImage(index)}
                        >
                            <img
                                src="{base}/media/trash.svg"
                                alt="trash icon"
                            />
                        </button>

                        <div class="file-preview-container">
                            <img
                                class="object-cover w-full h-full border-4 border-white preview"
                                src={url}
                                alt="Source preview"
                            />
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
