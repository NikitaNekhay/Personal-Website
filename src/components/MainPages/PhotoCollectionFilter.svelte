<script lang="ts">
	/**
	 * Home-page collection filter. Thin wrapper that feeds the shared <Bookmark>
	 * menu with the available collections (editorial "Selection" + years). All the
	 * tab/sway/expand behaviour lives in Bookmark; this just maps collections to
	 * bookmark items and reports the selection back up.
	 */
	import Bookmark, { type BookmarkItem } from '../Shared/Bookmark.svelte';
	import {
		PHOTO_COLLECTION_YEARS,
		PHOTO_SELECTION_COLLECTION,
		type PhotoCollectionKey
	} from '../../shared/types';

	interface Props {
		selectedCollection: PhotoCollectionKey;
		onSelect: (collection: PhotoCollectionKey) => void;
	}

	let { selectedCollection, onSelect }: Props = $props();

	const items = $derived<BookmarkItem[]>([
		{
			label: 'Selection',
			active: selectedCollection === PHOTO_SELECTION_COLLECTION,
			onSelect: () => onSelect(PHOTO_SELECTION_COLLECTION)
		},
		...PHOTO_COLLECTION_YEARS.map((year) => ({
			label: String(year),
			active: selectedCollection === year,
			onSelect: () => onSelect(year)
		}))
	]);
</script>

<Bookmark {items} ariaLabel="Open collection year filter" peekLabel="Selection" />
