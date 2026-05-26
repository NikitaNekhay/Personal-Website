<script lang="ts">
    import { onMount } from "svelte";
    import {
        ref,
        uploadBytes,
        getDownloadURL,
        deleteObject,
    } from "firebase/storage";
    import { storage } from "$lib/firebase/firebase";
    import {
        getSliderPhotos,
        addSliderPhoto,
        updateSliderPhoto,
        deleteSliderPhoto,
        reorderSliderPhotos,
    } from "../slider/slider";
    import type { SliderPhoto } from "../../shared/types";
    import piexif from "piexifjs";

    let photos: SliderPhoto[] = $state([]);
    let isLoading = $state(true);
    let isUploading = $state(false);
    let editingPhoto: SliderPhoto | null = $state(null);
    let newPhotoName = $state("");
    let dragIndex: number | null = $state(null);

    async function stripMetadata(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const dataUrl = e.target?.result as string;
                    // Load and strip EXIF data
                    let exifData = piexif.load(dataUrl);
                    // Remove all EXIF data
                    exifData = {
                        "0th": {},
                        "Exif": {},
                        "GPS": {},
                        "1st": {},
                        "thumbnail": null as unknown as number,
                    };
                    const strippedDataUrl = piexif.insert(
                        piexif.dump(exifData),
                        dataUrl
                    );
                    // Convert back to blob
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) {
                            reject(new Error("Failed to get canvas context"));
                            return;
                        }
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(
                            (blob) => {
                                if (blob) resolve(blob);
                                else reject(new Error("Failed to create blob"));
                            },
                            file.type,
                            0.92
                        );
                    };
                    img.onerror = () => reject(new Error("Failed to load image"));
                    img.src = strippedDataUrl;
                } catch (error) {
                    // If metadata stripping fails, return original file
                    resolve(file);
                }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    }

    async function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        isUploading = true;
        try {
            // Strip metadata before uploading
            const strippedBlob = await stripMetadata(file);
            const fileName = `${Date.now()}-${file.name}`;
            const storageRef = ref(storage, `slider/${fileName}`);
            await uploadBytes(storageRef, strippedBlob, {
                contentType: file.type,
            });
            const downloadURL = await getDownloadURL(storageRef);

            const newOrder = photos.length;
            await addSliderPhoto(
                newPhotoName || file.name.replace(/\.[^/.]+$/, ""),
                downloadURL,
                newOrder
            );
            newPhotoName = "";
            await loadPhotos();
        } catch (error) {
            console.error("Failed to upload photo:", error);
            alert("Failed to upload photo");
        } finally {
            isUploading = false;
            input.value = "";
        }
    }

    async function handleDelete(photo: SliderPhoto) {
        if (!confirm(`Delete "${photo.name}"?`)) return;

        try {
            // Delete from Storage
            const storageRef = ref(storage, photo.url);
            try {
                await deleteObject(storageRef);
            } catch (e) {
                console.warn("Storage file not found, skipping deletion");
            }

            // Delete from Firestore
            await deleteSliderPhoto(photo.id);
            await loadPhotos();
        } catch (error) {
            console.error("Failed to delete photo:", error);
            alert("Failed to delete photo");
        }
    }

    async function handleUpdateName() {
        if (!editingPhoto || !newPhotoName.trim()) return;

        try {
            await updateSliderPhoto(editingPhoto.id, { name: newPhotoName.trim() });
            editingPhoto = null;
            newPhotoName = "";
            await loadPhotos();
        } catch (error) {
            console.error("Failed to update photo name:", error);
            alert("Failed to update name");
        }
    }

    function startEdit(photo: SliderPhoto) {
        editingPhoto = photo;
        newPhotoName = photo.name;
    }

    function cancelEdit() {
        editingPhoto = null;
        newPhotoName = "";
    }

    // Drag and drop reordering
    function handleDragStart(index: number) {
        dragIndex = index;
    }

    function handleDragOver(event: DragEvent, index: number) {
        event.preventDefault();
    }

    async function handleDrop(index: number) {
        if (dragIndex === null || dragIndex === index) {
            dragIndex = null;
            return;
        }

        const newPhotos = [...photos];
        const [draggedPhoto] = newPhotos.splice(dragIndex, 1);
        newPhotos.splice(index, 0, draggedPhoto);

        // Update orders
        const updates = newPhotos.map((photo, i) => ({
            id: photo.id,
            order: i,
        }));

        try {
            await reorderSliderPhotos(updates);
            await loadPhotos();
        } catch (error) {
            console.error("Failed to reorder photos:", error);
            alert("Failed to reorder");
        }

        dragIndex = null;
    }

    function handleDragEnd() {
        dragIndex = null;
    }
</script>

<div class="dashboard">
    <h1>Slider Dashboard</h1>

    <div class="upload-section">
        <h2>Add New Photo</h2>
        <div class="upload-form">
            <input
                type="text"
                placeholder="Photo name (optional)"
                bind:value={newPhotoName}
                class="name-input"
            />
            <label class="upload-button">
                {#if isUploading}
                    Uploading...
                {:else}
                    Choose File
                {/if}
                <input
                    type="file"
                    accept="image/*"
                    onchange={handleFileUpload}
                    disabled={isUploading}
                    hidden
                />
            </label>
        </div>
    </div>

    <div class="photos-section">
        <h2>Manage Photos ({photos.length})</h2>

        {#if isLoading}
            <p>Loading...</p>
        {:else if photos.length === 0}
            <p>No photos yet. Upload your first photo above.</p>
        {:else}
            <div class="photo-list">
                {#each photos as photo, index (photo.id)}
                    <div
                        class="photo-item"
                        class:dragging={dragIndex === index}
                        draggable="true"
                        ondragstart={() => handleDragStart(index)}
                        ondragover={(e) => handleDragOver(e, index)}
                        ondrop={() => handleDrop(index)}
                        ondragend={handleDragEnd}
                        role="listitem"
                    >
                        <div class="drag-handle">⋮⋮</div>
                        <div class="photo-preview">
                            <img src={photo.url} alt={photo.name} />
                        </div>
                        <div class="photo-info">
                            <span class="photo-order">#{index + 1}</span>
                            {#if editingPhoto?.id === photo.id}
                                <div class="edit-form">
                                    <input
                                        type="text"
                                        bind:value={newPhotoName}
                                        placeholder="Photo name"
                                        onkeydown={(e) => e.key === "Enter" && handleUpdateName()}
                                    />
                                    <button onclick={handleUpdateName}>Save</button>
                                    <button onclick={cancelEdit}>Cancel</button>
                                </div>
                            {:else}
                                <span class="photo-name">{photo.name}</span>
                                <div class="photo-actions">
                                    <button onclick={() => startEdit(photo)}>Edit</button>
                                    <button
                                        class="delete-btn"
                                        onclick={() => handleDelete(photo)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .upload-section {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .upload-form {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .name-input {
        flex: 1;
        min-width: 200px;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .upload-button {
        background: #007bff;
        color: #fff;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        display: inline-block;
    }

    .upload-button:hover {
        background: #0056b3;
    }

    .photos-section {
        background: #fafafa;
        padding: 1.5rem;
        border-radius: 8px;
    }

    .photo-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .photo-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: grab;
        transition: opacity 0.2s, transform 0.2s;
    }

    .photo-item.dragging {
        opacity: 0.5;
        transform: scale(1.02);
    }

    .drag-handle {
        font-size: 1.5rem;
        color: #888;
        cursor: grab;
        padding: 0 0.5rem;
    }

    .photo-preview {
        width: 80px;
        height: 60px;
        flex-shrink: 0;
        overflow: hidden;
        border-radius: 4px;
    }

    .photo-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .photo-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .photo-order {
        font-weight: bold;
        color: #666;
        min-width: 30px;
    }

    .photo-name {
        flex: 1;
        min-width: 100px;
    }

    .photo-actions {
        display: flex;
        gap: 0.5rem;
    }

    .photo-actions button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        background: #e0e0e0;
    }

    .photo-actions button:hover {
        background: #d0d0d0;
    }

    .delete-btn {
        background: #ff4444 !important;
        color: #fff;
    }

    .delete-btn:hover {
        background: #cc0000 !important;
    }

    .edit-form {
        display: flex;
        gap: 0.5rem;
        flex: 1;
    }

    .edit-form input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .edit-form button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #007bff;
        color: #fff;
    }

    .edit-form button:last-child {
        background: #6c757d;
    }

    @media (max-width: 600px) {
        .dashboard {
            padding: 1rem;
        }

        .photo-item {
            flex-wrap: wrap;
        }

        .photo-info {
            width: 100%;
        }
    }
</style>
