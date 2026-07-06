<script lang="ts">
	/**
	 * Toggle-chip group letting an admin assign a photo to several collection
	 * buckets at once (the editorial "Selection" group and/or one or more years).
	 * Reused across the photos dashboard: per-staged-upload, per-existing-photo,
	 * and both bulk-apply panels.
	 */
	import { PHOTO_COLLECTION_YEARS, PHOTO_SELECTION_COLLECTION, type PhotoCollectionKey } from '../../shared/types';

	interface Props {
		value: PhotoCollectionKey[];
		onChange: (next: PhotoCollectionKey[]) => void;
		id?: string;
	}

	let { value, onChange, id }: Props = $props();

	const options = [PHOTO_SELECTION_COLLECTION, ...PHOTO_COLLECTION_YEARS] as const;

	function label(option: PhotoCollectionKey): string {
		return option === PHOTO_SELECTION_COLLECTION ? 'Selection' : String(option);
	}

	function toggle(option: PhotoCollectionKey) {
		const active = value.includes(option);
		// A photo must always belong to at least one collection, otherwise it
		// becomes invisible everywhere on the home page.
		if (active && value.length === 1) return;
		onChange(active ? value.filter((v) => v !== option) : [...value, option]);
	}
</script>

<div class="collection-multiselect" role="group" {id}>
	{#each options as option (option)}
		<button
			type="button"
			class="collection-chip"
			class:active={value.includes(option)}
			aria-pressed={value.includes(option)}
			onclick={() => toggle(option)}
		>
			{label(option)}
		</button>
	{/each}
</div>

<style>
	.collection-multiselect {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.collection-chip {
		padding: 4px 11px;
		border-radius: 999px;
		border: 1px solid #d8d8e2;
		background: #fff;
		color: #45455a;
		font-size: 12px;
		line-height: 1.4;
		cursor: pointer;
		transition:
			background 120ms ease,
			color 120ms ease,
			border-color 120ms ease;
	}

	.collection-chip:hover:not(.active) {
		border-color: #241e4e;
		color: #241e4e;
	}

	.collection-chip.active {
		background: #241e4e;
		border-color: #241e4e;
		color: #fff;
	}
</style>
