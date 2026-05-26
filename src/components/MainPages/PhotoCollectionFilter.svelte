<script lang="ts">
	import { PHOTO_COLLECTION_YEARS } from '../../shared/types';

	interface Props {
		selectedYear: number | null;
		onSelect: (year: number | null) => void;
	}

	let { selectedYear, onSelect }: Props = $props();
</script>

<header class="collection-header" aria-label="Filter by collection year">
	<nav class="collection-nav">
		<button
			type="button"
			class="collection-pill"
			class:active={selectedYear === null}
			onclick={() => onSelect(null)}
		>
			Selection
		</button>
		{#each PHOTO_COLLECTION_YEARS as year}
			<button
				type="button"
				class="collection-pill"
				class:active={selectedYear === year}
				onclick={() => onSelect(year)}
			>
				{year}
			</button>
		{/each}
	</nav>
</header>

<style>
	.collection-header {
		position: fixed;
		top: calc(var(--site-header-height) + 0.65rem);
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		justify-content: center;
		pointer-events: none;
		padding: 0 0.75rem;
	}

	.collection-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem 0.8rem;
		padding: 0;
		pointer-events: auto;
	}

	.collection-pill {
		font-family: 'Anonymous Pro', monospace;
		font-size: 0.75rem;
		letter-spacing: 0;
		text-transform: uppercase;
		padding: 0;
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.88);
		cursor: pointer;
		transition:
			color 0.2s ease,
			opacity 0.2s ease;
		text-shadow: 0 1px 18px rgba(0, 0, 0, 0.55);
	}

	.collection-pill:hover {
		color: #f6ae2d;
	}

	.collection-pill.active {
		color: #f6ae2d;
	}

	@media (max-width: 768px) {
		.collection-header {
			top: calc(var(--site-header-height) + 0.5rem);
		}

		.collection-pill {
			font-size: 0.65rem;
		}
	}
</style>
