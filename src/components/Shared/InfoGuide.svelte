<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
	let isOpen = $state(false);
	let isHovered = $state(false);

	const isVisible = $derived(isOpen || isHovered);

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isOpen = !isOpen;
	}
</script>

<span class="guide">
	<button
		type="button"
		class="guide-button"
		aria-label="Show field guide"
		aria-expanded={isVisible}
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		onclick={toggle}
		onblur={() => (isOpen = false)}
	>
		<img src="{base}/media/info.svg" alt="" />
	</button>
	{#if isVisible}
		<span class="guide-popover" role="tooltip">
			{text}
		</span>
	{/if}
</span>

<style>
	.guide {
		position: relative;
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		z-index: 5;
	}

	.guide-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: help;
		color: #241e4e;
		opacity: 0.78;
	}

	.guide-button:hover,
	.guide-button:focus-visible {
		opacity: 1;
		outline: none;
	}

	.guide-button img {
		width: 0.95rem;
		height: 0.95rem;
		display: block;
	}

	.guide-popover {
		position: absolute;
		left: 50%;
		bottom: calc(100% + 0.45rem);
		width: min(16rem, 78vw);
		transform: translateX(-50%);
		padding: 0.55rem 0.65rem;
		border: 1px solid #f6ae2d;
		border-radius: 6px;
		background: #ffffff;
		color: #241e4e;
		box-shadow: 0 12px 28px rgba(36, 30, 78, 0.16);
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.35;
		text-align: left;
		white-space: normal;
		pointer-events: none;
	}

	.guide-popover::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		width: 0.55rem;
		height: 0.55rem;
		transform: translate(-50%, -50%) rotate(45deg);
		border-right: 1px solid #f6ae2d;
		border-bottom: 1px solid #f6ae2d;
		background: #ffffff;
	}
</style>
