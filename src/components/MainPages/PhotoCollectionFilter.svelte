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
		top: calc(var(--site-header-height) + 0.35rem);
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
		gap: 0.35rem 0.5rem;
		padding: 0.4rem 0.65rem;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(8px);
		border-radius: 999px;
		pointer-events: auto;
	}

	.collection-pill {
		font-family: 'Anonymous Pro', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.35rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.85);
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.collection-pill:hover {
		border-color: #f6ae2d;
		color: #f6ae2d;
	}

	.collection-pill.active {
		background: #f6ae2d;
		border-color: #f6ae2d;
		color: #1a1a1a;
	}

	@media (max-width: 768px) {
		.collection-header {
			top: calc(var(--site-header-height) + 0.25rem);
		}

		.collection-pill {
			font-size: 0.65rem;
			padding: 0.3rem 0.55rem;
		}
	}
</style>
