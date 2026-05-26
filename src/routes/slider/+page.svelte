<script lang="ts">
    import { onMount } from "svelte";
    import { getSliderPhotos } from "./slider";
    import type { SliderPhoto } from "../../shared/types";

    let photos: SliderPhoto[] = $state([]);
    let currentIndex = $state(0);
    let isLoading = $state(true);
    let touchStartX = 0;
    let touchEndX = 0;

    onMount(async () => {
        try {
            photos = await getSliderPhotos();
        } catch (error) {
            console.error("Failed to load slider photos:", error);
        } finally {
            isLoading = false;
        }
    });

    function nextSlide() {
        if (photos.length > 0) {
            currentIndex = (currentIndex + 1) % photos.length;
        }
    }

    function prevSlide() {
        if (photos.length > 0) {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        }
    }

    function goToSlide(index: number) {
        currentIndex = index;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") prevSlide();
        if (event.key === "ArrowRight") nextSlide();
    }

    function handleTouchStart(event: TouchEvent) {
        touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd(event: TouchEvent) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }

    function handleMouseDown(event: MouseEvent) {
        touchStartX = event.clientX;
    }

    function handleMouseUp(event: MouseEvent) {
        const swipeThreshold = 50;
        const diff = touchStartX - event.clientX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="slider-container">
    {#if isLoading}
        <div class="loading">Loading...</div>
    {:else if photos.length === 0}
        <div class="empty">No photos available</div>
    {:else}
        <div
            class="slider-wrapper"
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
            onmousedown={handleMouseDown}
            onmouseup={handleMouseUp}
            role="region"
            aria-label="Photo slider"
        >
            <div
                class="slides"
                style="transform: translateX(-{currentIndex * 100}%)"
            >
                {#each photos as photo, index}
                    <div class="slide" class:active={index === currentIndex}>
                        <img
                            src={photo.url}
                            alt={photo.name}
                            draggable="false"
                            oncontextmenu={(e) => e.preventDefault()}
                        />
                    </div>
                {/each}
            </div>

            <button
                class="nav-button prev"
                onclick={prevSlide}
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                class="nav-button next"
                onclick={nextSlide}
                aria-label="Next slide"
            >
                ›
            </button>

            <div class="indicators">
                {#each photos as _, index}
                    <button
                        class="indicator"
                        class:active={index === currentIndex}
                        onclick={() => goToSlide(index)}
                        aria-label="Go to slide {index + 1}"
                    ></button>
                {/each}
            </div>

            <div class="photo-name">
                {photos[currentIndex]?.name || ""}
            </div>
        </div>
    {/if}
</div>

<style>
    .slider-container {
        width: 100%;
        height: 100vh;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .loading,
    .empty {
        color: #fff;
        font-size: 1.5rem;
    }

    .slider-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: grab;
        user-select: none;
    }

    .slider-wrapper:active {
        cursor: grabbing;
    }

    .slides {
        display: flex;
        height: 100%;
        transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .slide {
        min-width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slide img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        pointer-events: none;
        -webkit-user-drag: none;
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        border: none;
        color: #fff;
        font-size: 3rem;
        width: 60px;
        height: 60px;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-button:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    .prev {
        left: 20px;
    }

    .next {
        right: 20px;
    }

    .indicators {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: background 0.3s;
    }

    .indicator.active {
        background: #fff;
    }

    .photo-name {
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        font-size: 1.2rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        white-space: nowrap;
    }

    @media (max-width: 768px) {
        .nav-button {
            width: 44px;
            height: 44px;
            font-size: 2rem;
        }

        .prev {
            left: 10px;
        }

        .next {
            right: 10px;
        }

        .photo-name {
            font-size: 1rem;
            bottom: 60px;
        }

        .indicator {
            width: 10px;
            height: 10px;
        }

        .indicators {
            gap: 8px;
            bottom: 20px;
        }
    }
</style>
