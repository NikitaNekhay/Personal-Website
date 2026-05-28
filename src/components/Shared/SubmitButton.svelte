<script lang="ts">
    import { t, type MessageObject } from 'svelte-i18n';
    import LoadingButton from './LoadingButton.svelte';
   export let passedfunction: () => void;
   export let isLoading:boolean;
   export let submitClicked:boolean;
   export let text:String | MessageObject;
    // ////console.log(isLoading)
    // ////console.log(////console.log(isLoading))
    
</script>

{#if submitClicked && isLoading}
<LoadingButton />
{:else}
    <button
    tabindex="0"
        class="group relative  flex
  w-48 sm:w-36 items-center justify-center overflow-hidden
rounded-md border border-orange-0
px-8 py-3 focus:outline-none focus:ring"
        onclick={passedfunction}
        type="button"
    >
        <span
            class="absolute inset-x-0 bottom-0 h-[2px]
bg-orange-0 transition-all group-hover:h-full
group-active:bg-orange-0"
        ></span>

        <span
            class="relative text-sm font-medium
text-orange-0 transition-colors group-hover:text-white"
        >
            {$t(text)}
        </span>
    </button>
{/if}
