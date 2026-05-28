<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { auth } from '$lib/firebase/firebase';
	import CommonPopUp from '../../components/Shared/CommonPopUp.svelte';
	import {
		DEFAULT_PHOTO_COLLECTION,
		PHOTO_COLLECTION_YEARS,
		PHOTO_REVEAL_DIRECTIONS,
		PHOTO_SELECTION_COLLECTION,
		DEFAULT_PHOTO_POSITION,
		DEFAULT_PHOTO_SCALE,
		type PhotoCollectionKey,
		type PhotoManifestEntry
	} from '../../shared/types';

	const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	const MAX_FILE_BYTES = 4 * 1024 * 1024;
	const PHOTO_COLLECTION_OPTIONS = [PHOTO_SELECTION_COLLECTION, ...PHOTO_COLLECTION_YEARS] as const;

	type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

	interface PendingPhotoUpload {
		entry: PhotoManifestEntry;
		originalBlobSha: string;
		thumbBlobSha: string;
	}

	interface StagedFile {
		id: string;
		file: File;
		preview: string;
		slug: string;
		title: string;
		collectionNumber: number;
		collectionKey: PhotoCollectionKey;
		positionX: number;
		positionY: number;
		scalePercent: number;
		revealFrom: string;
		stripExif: boolean;
		selected: boolean;
		status: UploadStatus;
		error?: string;
	}

	type ManagementSection = 'all' | 'selection' | number;
	type PopupKind = 'success' | 'error' | 'warning';

	interface PhotoEditDraft {
		title: string;
		collectionKey: PhotoCollectionKey;
		positionX: number;
		positionY: number;
		scalePercent: number;
		revealFrom: string;
	}

	let manifest = $state<PhotoManifestEntry[]>([]);
	let isLoadingManifest = $state(true);
	let staged = $state<StagedFile[]>([]);
	let stripAllExif = $state(true);
	let defaultUploadCollection = $state<PhotoCollectionKey>(DEFAULT_PHOTO_COLLECTION);
	let bulkCollectionKey = $state<PhotoCollectionKey>(DEFAULT_PHOTO_COLLECTION);
	let bulkPositionX = $state(DEFAULT_PHOTO_POSITION);
	let bulkPositionY = $state(DEFAULT_PHOTO_POSITION);
	let bulkScalePercent = $state(DEFAULT_PHOTO_SCALE);
	let bulkRevealFrom = $state('bottom');
	let showStagingBatch = $state(false);
	let showExistingBatch = $state(false);
	let isUploading = $state(false);
	let orderDirty = $state(false);
	let displayOrder = $state<PhotoManifestEntry[]>([]);
	let selectedExistingSlugs = $state<Set<string>>(new Set());
	let activeSection = $state<ManagementSection>('all');
	let photoDrafts = $state<Record<string, PhotoEditDraft>>({});
	let savingAction = $state<string | null>(null);
	let popupChanged = $state(false);
	let popupSmallMessage = $state('');
	let popupMessage = $state('');
	let popupKind = $state<PopupKind>('success');
	let dragOver = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();

	function toSlug(filename: string): string {
		return filename
			.replace(/\.[^.]+$/, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function collectionLabel(collection: PhotoCollectionKey | ManagementSection): string {
		if (collection === 'all') return 'All';
		if (collection === PHOTO_SELECTION_COLLECTION) return 'Selection';
		return String(collection);
	}

	function collectionYear(collection: PhotoCollectionKey): number {
		return typeof collection === 'number' ? collection : PHOTO_COLLECTION_YEARS[0];
	}

	function photoToDraft(photo: PhotoManifestEntry): PhotoEditDraft {
		return {
			title: photo.title,
			collectionKey: photo.collectionKey,
			positionX: photo.positionX,
			positionY: photo.positionY,
			scalePercent: photo.scalePercent,
			revealFrom: photo.revealFrom
		};
	}

	function syncDrafts(entries: PhotoManifestEntry[]) {
		const next: Record<string, PhotoEditDraft> = {};
		for (const photo of entries) {
			next[photo.slug] = photoToDraft(photo);
		}
		photoDrafts = next;
	}

	function setPopup(kind: PopupKind, smallMessage: string, message: string) {
		popupKind = kind;
		popupSmallMessage = smallMessage;
		popupMessage = message;
		popupChanged = true;
	}

	async function getAuthHeaders(): Promise<HeadersInit> {
		const token = await auth.currentUser?.getIdToken();
		if (!token) throw new Error('Not authenticated');
		return { Authorization: `Bearer ${token}` };
	}

	async function loadManifest() {
		isLoadingManifest = true;
		try {
			const res = await fetch(`${base}/api/photos/manifest`);
			if (!res.ok) throw new Error('Failed to load manifest');
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			orderDirty = false;
			selectedExistingSlugs = new Set();
		} catch (e) {
			console.error(e);
			setPopup('error', 'Error', e instanceof Error ? e.message : 'Failed to load manifest');
		} finally {
			isLoadingManifest = false;
		}
	}

	onMount(() => {
		loadManifest();
	});

	function addFiles(files: FileList | File[]) {
		const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
		const oversized = list.filter((f) => f.size > MAX_FILE_BYTES);
		if (oversized.length > 0) {
			setPopup(
				'warning',
				'Warning',
				`${oversized.length} file(s) exceed 4MB and cannot be uploaded: ${oversized.map((f) => f.name).join(', ')}`
			);
		}
		const valid = list.filter((f) => f.size <= MAX_FILE_BYTES);
		const newStaged: StagedFile[] = valid.map((file) => ({
			id: crypto.randomUUID(),
			file,
			preview: URL.createObjectURL(file),
			slug: toSlug(file.name),
			title: file.name.replace(/\.[^.]+$/, ''),
			collectionNumber: collectionYear(defaultUploadCollection),
			collectionKey: defaultUploadCollection,
			positionX: DEFAULT_PHOTO_POSITION,
			positionY: DEFAULT_PHOTO_POSITION,
			scalePercent: DEFAULT_PHOTO_SCALE,
			revealFrom: 'bottom',
			stripExif: true,
			selected: true,
			status: 'pending' as UploadStatus
		}));
		staged = [...staged, ...newStaged];
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) addFiles(input.files);
		input.value = '';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
	}

	function removeStaged(id: string) {
		const item = staged.find((s) => s.id === id);
		if (item) URL.revokeObjectURL(item.preview);
		staged = staged.filter((s) => s.id !== id);
	}

	function setStripAll(value: boolean) {
		stripAllExif = value;
		staged = staged.map((s) => ({ ...s, stripExif: value }));
	}

	function setStripSelected(value: boolean) {
		stripAllExif = value;
		staged = staged.map((s) => (s.selected ? { ...s, stripExif: value } : s));
	}

	const selectedStaged = $derived(staged.filter((s) => s.selected));

	const allStagedSelected = $derived(staged.length > 0 && staged.every((s) => s.selected));

	function getPhotosForSection(section: ManagementSection): PhotoManifestEntry[] {
		if (section === 'selection') {
			return displayOrder.filter((photo) => photo.collectionKey === PHOTO_SELECTION_COLLECTION);
		}
		if (section === 'all') return displayOrder;
		return displayOrder.filter((photo) => photo.collectionKey === section);
	}

	const sectionPhotos = $derived.by(() => getPhotosForSection(activeSection));
	const allSectionSelected = $derived(
		sectionPhotos.length > 0 &&
			sectionPhotos.every((photo) => selectedExistingSlugs.has(photo.slug))
	);
	const activeSectionTitle = $derived(
		collectionLabel(activeSection)
	);

	function toggleSelectAllStaged() {
		const next = !allStagedSelected;
		staged = staged.map((s) => ({ ...s, selected: next }));
	}

	function toggleSelectSection() {
		const next = new Set(selectedExistingSlugs);
		if (allSectionSelected) {
			for (const photo of sectionPhotos) next.delete(photo.slug);
		} else {
			for (const photo of sectionPhotos) next.add(photo.slug);
		}
		selectedExistingSlugs = next;
	}

	function applyBulkCollectionToStaged() {
		staged = staged.map((s) =>
			s.selected
				? {
						...s,
						collectionKey: bulkCollectionKey,
						collectionNumber: collectionYear(bulkCollectionKey)
					}
				: s
		);
	}

	function applyBulkViewToStaged() {
		staged = staged.map((s) =>
			s.selected
				? {
						...s,
						positionX: bulkPositionX,
						positionY: bulkPositionY,
						scalePercent: bulkScalePercent
					}
				: s
		);
	}

	function applyBulkRevealToStaged() {
		staged = staged.map((s) => (s.selected ? { ...s, revealFrom: bulkRevealFrom } : s));
	}

	const slugValid = $derived.by(() => {
		if (staged.length === 0) return false;
		const slugs = staged.map((s) => s.slug);
		const existing = new Set(manifest.map((m) => m.slug));
		for (const slug of slugs) {
			if (!slug || !SLUG_RE.test(slug)) return false;
			if (existing.has(slug)) return false;
		}
		if (new Set(slugs).size !== slugs.length) return false;
		return true;
	});

	async function uploadAll() {
		if (!slugValid || staged.length === 0) return;
		isUploading = true;
		const headers = await getAuthHeaders();
		const pendingPhotos: PendingPhotoUpload[] = [];

		for (let i = 0; i < staged.length; i++) {
			const item = staged[i];
			staged[i] = { ...item, status: 'uploading' };
			staged = [...staged];

			try {
				const formData = new FormData();
				formData.append('file', item.file);
				formData.append('slug', item.slug);
				formData.append('title', item.title);
				formData.append('stripExif', String(item.stripExif));
				formData.append('collectionNumber', String(item.collectionNumber));
				formData.append('collectionKey', String(item.collectionKey));
				formData.append('positionX', String(item.positionX));
				formData.append('positionY', String(item.positionY));
				formData.append('scalePercent', String(item.scalePercent));
				formData.append('revealFrom', item.revealFrom);

				const res = await fetch(`${base}/api/photos/upload-draft`, {
					method: 'POST',
					headers,
					body: formData
				});

				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error ?? 'Upload failed');
				}

				pendingPhotos.push(await res.json());
				staged[i] = { ...staged[i], status: 'uploading' };
				staged = [...staged];
			} catch (e) {
				const message = e instanceof Error ? e.message : 'Upload failed';
				staged[i] = {
					...staged[i],
					status: 'error',
					error: message
				};
				staged = [...staged];
				setPopup('error', 'Error', `${item.slug}: ${message}`);
			}
		}

		if (pendingPhotos.length > 0) {
			try {
				const publishHeaders = {
					...(await getAuthHeaders()),
					'Content-Type': 'application/json'
				};
				const res = await fetch(`${base}/api/photos/publish`, {
					method: 'POST',
					headers: publishHeaders,
					body: JSON.stringify({ photos: pendingPhotos })
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error ?? 'Publish failed');
				}
				manifest = await res.json();
				displayOrder = [...manifest].sort((a, b) => a.order - b.order);
				syncDrafts(displayOrder);
				const published = new Set(pendingPhotos.map((photo) => photo.entry.slug));
				staged = staged.map((item) =>
					published.has(item.slug) ? { ...item, status: 'done' } : item
				);
				setPopup('success', 'Success', `Published ${pendingPhotos.length} photo(s).`);
			} catch (e) {
				const message = e instanceof Error ? e.message : 'Publish failed';
				const published = new Set(pendingPhotos.map((photo) => photo.entry.slug));
				staged = staged.map((item) =>
					published.has(item.slug) ? { ...item, status: 'error', error: message } : item
				);
				setPopup('error', 'Error', message);
			}
		}

		isUploading = false;
		staged = staged.filter((s) => s.status !== 'done');
		displayOrder = [...manifest].sort((a, b) => a.order - b.order);
		syncDrafts(displayOrder);
	}

	function moveWithinSection(sectionIndex: number, direction: -1 | 1) {
		const scoped = sectionPhotos;
		const target = sectionIndex + direction;
		if (target < 0 || target >= scoped.length) return;

		const currentSlug = scoped[sectionIndex].slug;
		const targetSlug = scoped[target].slug;
		const currentGlobal = displayOrder.findIndex((photo) => photo.slug === currentSlug);
		const targetGlobal = displayOrder.findIndex((photo) => photo.slug === targetSlug);
		if (currentGlobal === -1 || targetGlobal === -1) return;

		const arr = [...displayOrder];
		[arr[currentGlobal], arr[targetGlobal]] = [arr[targetGlobal], arr[currentGlobal]];
		displayOrder = arr.map((photo, index) => ({ ...photo, order: index + 1 }));
		orderDirty = true;
	}

	async function saveOrder() {
		savingAction = 'save-order';
		try {
			const headers = {
				...(await getAuthHeaders()),
				'Content-Type': 'application/json'
			};
			const res = await fetch(`${base}/api/photos/reorder`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ slugs: displayOrder.map((p) => p.slug) })
			});
			if (!res.ok) throw new Error('Reorder failed');
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			orderDirty = false;
			setPopup('success', 'Success', `${activeSectionTitle} order saved.`);
		} catch (e) {
			setPopup('error', 'Error', e instanceof Error ? e.message : 'Reorder failed');
		} finally {
			savingAction = null;
		}
	}

	async function updatePhoto(
		slug: string,
		updates: {
			title?: string;
			collectionKey?: PhotoCollectionKey;
			positionX?: number;
			positionY?: number;
			scalePercent?: number;
			revealFrom?: string;
		},
		actionKey = `save-${slug}`
	) {
		savingAction = actionKey;
		const headers = {
			...(await getAuthHeaders()),
			'Content-Type': 'application/json'
		};
		try {
			const res = await fetch(`${base}/api/photos/update`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ slug, ...updates })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error ?? 'Update failed');
			}
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			setPopup('success', 'Success', 'Photo changes saved.');
		} catch (e) {
			setPopup('error', 'Error', e instanceof Error ? e.message : 'Update failed');
		} finally {
			savingAction = null;
		}
	}

	function updateDraft(slug: string, patch: Partial<PhotoEditDraft>) {
		const current = photoDrafts[slug];
		if (!current) return;
		photoDrafts = {
			...photoDrafts,
			[slug]: {
				...current,
				...patch
			}
		};
	}

	function isPhotoDirty(photo: PhotoManifestEntry): boolean {
		const draft = photoDrafts[photo.slug];
		if (!draft) return false;
		return (
			draft.title !== photo.title ||
			draft.collectionKey !== photo.collectionKey ||
			draft.positionX !== photo.positionX ||
			draft.positionY !== photo.positionY ||
			draft.scalePercent !== photo.scalePercent ||
			draft.revealFrom !== photo.revealFrom
		);
	}

	async function savePhotoDraft(photo: PhotoManifestEntry) {
		const draft = photoDrafts[photo.slug];
		if (!draft) return;
		await updatePhoto(
			photo.slug,
			{
				title: draft.title,
				collectionKey: draft.collectionKey,
				positionX: clampNumber(draft.positionX, 0, 100),
				positionY: clampNumber(draft.positionY, 0, 100),
				scalePercent: clampNumber(draft.scalePercent, 1, 100),
				revealFrom: draft.revealFrom
			},
			`save-${photo.slug}`
		);
	}

	async function bulkUpdateExistingCollection() {
		if (selectedExistingSlugs.size === 0) return;
		savingAction = 'bulk-collection';
		try {
			const headers = {
				...(await getAuthHeaders()),
				'Content-Type': 'application/json'
			};
			const res = await fetch(`${base}/api/photos/update`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({
					slugs: [...selectedExistingSlugs],
					collectionKey: bulkCollectionKey
				})
			});
			if (!res.ok) throw new Error('Bulk update failed');
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			selectedExistingSlugs = new Set();
			setPopup('success', 'Success', 'Selected photos updated.');
		} catch (e) {
			setPopup('error', 'Error', e instanceof Error ? e.message : 'Bulk update failed');
		} finally {
			savingAction = null;
		}
	}

	async function bulkUpdateExistingVisual(
		updates: { positionX?: number; positionY?: number; scalePercent?: number; revealFrom?: string },
		message = 'Bulk update failed',
		actionKey = 'bulk-visual'
	) {
		if (selectedExistingSlugs.size === 0) return;
		savingAction = actionKey;
		try {
			const headers = {
				...(await getAuthHeaders()),
				'Content-Type': 'application/json'
			};
			const res = await fetch(`${base}/api/photos/update`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({
					slugs: [...selectedExistingSlugs],
					...updates
				})
			});
			if (!res.ok) throw new Error(message);
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			selectedExistingSlugs = new Set();
			setPopup('success', 'Success', 'Selected photos updated.');
		} catch (e) {
			setPopup('error', 'Error', e instanceof Error ? e.message : message);
		} finally {
			savingAction = null;
		}
	}

	function toggleExistingSlug(slug: string) {
		const next = new Set(selectedExistingSlugs);
		if (next.has(slug)) next.delete(slug);
		else next.add(slug);
		selectedExistingSlugs = next;
	}

	function clampNumber(value: number, min: number, max: number): number {
		if (!Number.isFinite(value)) return min;
		return Math.max(min, Math.min(max, Math.round(value)));
	}

	function scaleFactor(value: number): string {
		return (1 + (clampNumber(value, 1, 100) - 1) / 100).toFixed(3);
	}

	async function bulkUpdateExistingView() {
		await bulkUpdateExistingVisual(
			{
				positionX: bulkPositionX,
				positionY: bulkPositionY,
				scalePercent: bulkScalePercent
			},
			'Bulk update failed',
			'bulk-view'
		);
	}

	async function deletePhoto(slug: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
		savingAction = `delete-${slug}`;
		try {
			const headers = {
				...(await getAuthHeaders()),
				'Content-Type': 'application/json'
			};
			const res = await fetch(`${base}/api/photos/delete`, {
				method: 'DELETE',
				headers,
				body: JSON.stringify({ slug })
			});
			if (!res.ok) throw new Error('Delete failed');
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			syncDrafts(displayOrder);
			setPopup('success', 'Success', `Deleted "${title}".`);
		} catch (e) {
			setPopup('error', 'Error', e instanceof Error ? e.message : 'Delete failed');
		} finally {
			savingAction = null;
		}
	}

	function imgUrl(path: string): string {
		const photoPath = path.replace(/^\/?photos\//, '');
		return `${base}/api/photos/image/${photoPath}`;
	}
</script>

<svelte:head>
	<title>Photos Dashboard</title>
	<meta name="description" content="Admin dashboard for portfolio photos" />
</svelte:head>

<div class="dashboard">
	{#if popupChanged}
		<CommonPopUp
			bind:isChanged={popupChanged}
			isPreviev={false}
			isError={popupKind === 'error'}
			message={popupMessage}
			smallMessage={popupSmallMessage}
			href=""
		/>
	{/if}

	<h1>Photos Dashboard</h1>

	<section class="upload-section">
		<h2>Add New Photos</h2>
		<div
			class="drop-zone"
			class:drag-over={dragOver}
			ondragover={(e) => {
				e.preventDefault();
				dragOver = true;
			}}
			ondragleave={() => (dragOver = false)}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
		>
			<p>Drag and drop images here, or click to browse</p>
			<button type="button" class="fancy-btn" onclick={() => fileInput?.click()}>
				Choose files
			</button>
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				multiple
				hidden
				onchange={handleFileSelect}
			/>
		</div>

		{#if staged.length > 0}
			<div class="staging">
				<div class="staging-toolbar">
					<label class="select-all">
						<input
							type="checkbox"
							checked={allStagedSelected}
							onchange={toggleSelectAllStaged}
						/>
						Select all ({selectedStaged.length}/{staged.length})
					</label>
					<button
						type="button"
						class="fancy-btn small neutral"
						onclick={() => (showStagingBatch = !showStagingBatch)}
					>
						{showStagingBatch ? 'Hide batch edit' : 'Batch edit selected'}
					</button>
				</div>

				{#if showStagingBatch}
					<div class="batch-panel">
						<div class="batch-control">
							<label>
								<span class="label-row">
									Collection group
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Selection is a separate editorial group. Years are separate groups shown in the home filter." />
								</span>
								<select bind:value={bulkCollectionKey}>
									{#each PHOTO_COLLECTION_OPTIONS as collection}
										<option value={collection}>{collectionLabel(collection)}</option>
									{/each}
								</select>
							</label>
							<button
								type="button"
								class="fancy-btn small"
								disabled={selectedStaged.length === 0}
								onclick={applyBulkCollectionToStaged}
							>
								Apply to selected
							</button>
						</div>
						<div class="batch-control">
							<span class="control-title">Photo crop</span>
							<label>
								<span class="label-row">
									Horizontal / left %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 keeps the focal point at the left edge, 50 is center, 100 is right." />
								</span>
								<input type="number" min="0" max="100" bind:value={bulkPositionX} />
							</label>
							<label>
								<span class="label-row">
									Vertical / top %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 keeps the focal point at the top, 50 is center, 100 is bottom." />
								</span>
								<input type="number" min="0" max="100" bind:value={bulkPositionY} />
							</label>
							<label>
								<span class="label-row">
									Scale %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="1 is natural cover. Higher values zoom in more while keeping the selected focal point." />
								</span>
								<input type="number" min="1" max="100" bind:value={bulkScalePercent} />
							</label>
							<button
								type="button"
								class="fancy-btn small"
								disabled={selectedStaged.length === 0}
								onclick={applyBulkViewToStaged}
							>
								Apply to selected
							</button>
						</div>
						<div class="batch-control">
							<label>
								<span class="label-row">
									Reveal side
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Desktop/tablet reveal direction during scroll. On phone photos always reveal from below." />
								</span>
								<select bind:value={bulkRevealFrom}>
									{#each PHOTO_REVEAL_DIRECTIONS as direction}
										<option value={direction}>{direction}</option>
									{/each}
								</select>
							</label>
							<button
								type="button"
								class="fancy-btn small"
								disabled={selectedStaged.length === 0}
								onclick={applyBulkRevealToStaged}
							>
								Apply to selected
							</button>
						</div>
						<div class="batch-control">
							<label class="strip-row">
								<input type="checkbox" bind:checked={stripAllExif} />
								Strip EXIF value
							</label>
							<button
								type="button"
								class="fancy-btn small"
								disabled={selectedStaged.length === 0}
								onclick={() => setStripSelected(stripAllExif)}
							>
								Apply to selected
							</button>
							<button
								type="button"
								class="fancy-btn small neutral"
								onclick={() => setStripAll(stripAllExif)}
							>
								Apply to all
							</button>
						</div>
					</div>
				{/if}

				{#each staged as item, i (item.id)}
					<div class="stage-row" class:row-selected={item.selected}>
						<input
							type="checkbox"
							class="row-check"
							checked={item.selected}
							onchange={(e) => {
								staged[i] = { ...staged[i], selected: e.currentTarget.checked };
								staged = [...staged];
							}}
						/>
						<div
							class="stage-preview"
							style={`--preview-position: ${item.positionX}% ${item.positionY}%; --preview-scale: ${scaleFactor(item.scalePercent)};`}
						>
							<img src={item.preview} alt="" class="stage-thumb" />
						</div>
						<div class="stage-fields">
							<label>
								<span class="label-row">
									Slug
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Used as the WebP filename. Lowercase letters, numbers and hyphens only." />
								</span>
								<input type="text" bind:value={staged[i].slug} />
							</label>
							<label>
								<span class="label-row">
									Title
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Internal/display title for this photo." />
								</span>
								<input type="text" bind:value={staged[i].title} />
							</label>
							<label>
								<span class="label-row">
									Collection group
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Selection is a separate home-page group. Years are separate groups." />
								</span>
								<select
									bind:value={staged[i].collectionKey}
									onchange={() => {
										staged[i] = {
											...staged[i],
											collectionNumber: collectionYear(staged[i].collectionKey)
										};
										staged = [...staged];
									}}
								>
									{#each PHOTO_COLLECTION_OPTIONS as collection}
										<option value={collection}>{collectionLabel(collection)}</option>
									{/each}
								</select>
							</label>
							<label>
								<span class="label-row">
									Horizontal / left %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 left, 50 center, 100 right." />
								</span>
								<input type="number" min="0" max="100" bind:value={staged[i].positionX} />
							</label>
							<label>
								<span class="label-row">
									Vertical / top %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 top, 50 center, 100 bottom." />
								</span>
								<input type="number" min="0" max="100" bind:value={staged[i].positionY} />
							</label>
							<label>
								<span class="label-row">
									Scale %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="1 natural cover, 100 strongest zoom." />
								</span>
								<input type="number" min="1" max="100" bind:value={staged[i].scalePercent} />
							</label>
							<label>
								<span class="label-row">
									Reveal side
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Desktop/tablet reveal direction. Mobile always reveals from below." />
								</span>
								<select bind:value={staged[i].revealFrom}>
									{#each PHOTO_REVEAL_DIRECTIONS as direction}
										<option value={direction}>{direction}</option>
									{/each}
								</select>
							</label>
							<label class="strip-row">
								<input type="checkbox" bind:checked={staged[i].stripExif} />
								Strip EXIF
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="Removes camera/device metadata during WebP generation." />
							</label>
						</div>
						<div class="stage-actions">
							<span class="status status-{item.status}">{item.status}</span>
							{#if item.error}
								<span class="error-text">{item.error}</span>
							{/if}
							<button type="button" class="fancy-btn small neutral" onclick={() => removeStaged(item.id)}>
								Remove
							</button>
						</div>
					</div>
				{/each}

				<button
					type="button"
					class="fancy-btn"
					disabled={!slugValid || isUploading}
					onclick={uploadAll}
				>
					{#if isUploading}
						<span class="button-spinner"></span>
					{/if}
					{isUploading ? 'Uploading...' : 'Upload all'}
				</button>
				{#if !slugValid && staged.length > 0}
					<p class="hint">Fix slugs: lowercase a-z, 0-9, hyphens only; no duplicates.</p>
				{/if}
			</div>
		{/if}
	</section>

	<section class="grid-section">
		<div class="grid-header">
			<h2>Manage Photos ({displayOrder.length})</h2>
			{#if orderDirty}
				<button
					type="button"
					class="fancy-btn"
					disabled={savingAction !== null}
					onclick={saveOrder}
				>
					{#if savingAction === 'save-order'}
						<span class="button-spinner"></span>
					{/if}
					Save order
				</button>
			{/if}
		</div>

		{#if displayOrder.length > 0}
			<div class="section-tabs" aria-label="Photo management sections">
				<button
					type="button"
					class:active={activeSection === 'all'}
					onclick={() => (activeSection = 'all')}
				>
					All ({displayOrder.length})
				</button>
				<button
					type="button"
					class:active={activeSection === 'selection'}
					onclick={() => (activeSection = 'selection')}
				>
					Selection ({displayOrder.filter((photo) => photo.collectionKey === PHOTO_SELECTION_COLLECTION).length})
				</button>
				{#each PHOTO_COLLECTION_YEARS as year}
					<button
						type="button"
						class:active={activeSection === year}
						onclick={() => (activeSection = year)}
					>
						{year} ({displayOrder.filter((photo) => photo.collectionKey === year).length})
					</button>
				{/each}
			</div>

			<div class="existing-bulk">
				<label class="select-all">
					<input
						type="checkbox"
						checked={allSectionSelected}
						disabled={sectionPhotos.length === 0}
						onchange={toggleSelectSection}
					/>
					Select all in {activeSectionTitle} ({sectionPhotos.length})
				</label>
				<button
					type="button"
					class="fancy-btn small neutral"
					onclick={() => (showExistingBatch = !showExistingBatch)}
				>
					{showExistingBatch
						? 'Hide batch edit'
						: `Batch edit selected (${selectedExistingSlugs.size})`}
				</button>
			</div>
			{#if showExistingBatch}
				<div class="batch-panel existing-panel">
					<div class="batch-control">
						<label>
							<span class="label-row">
								Collection group
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="Apply Selection or a year to all checked photos." />
							</span>
							<select bind:value={bulkCollectionKey}>
								{#each PHOTO_COLLECTION_OPTIONS as collection}
									<option value={collection}>{collectionLabel(collection)}</option>
								{/each}
							</select>
						</label>
						<button
							type="button"
							class="fancy-btn small"
							disabled={selectedExistingSlugs.size === 0}
							onclick={bulkUpdateExistingCollection}
						>
							{#if savingAction === 'bulk-collection'}
								<span class="button-spinner"></span>
							{/if}
							Apply to selected
						</button>
					</div>
					<div class="batch-control">
						<span class="control-title">Photo crop</span>
						<label>
							<span class="label-row">
								Horizontal / left %
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 left, 50 center, 100 right." />
							</span>
							<input type="number" min="0" max="100" bind:value={bulkPositionX} />
						</label>
						<label>
							<span class="label-row">
								Vertical / top %
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 top, 50 center, 100 bottom." />
							</span>
							<input type="number" min="0" max="100" bind:value={bulkPositionY} />
						</label>
						<label>
							<span class="label-row">
								Scale %
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="1 natural cover, 100 strongest zoom." />
							</span>
							<input type="number" min="1" max="100" bind:value={bulkScalePercent} />
						</label>
						<button
							type="button"
							class="fancy-btn small"
							disabled={selectedExistingSlugs.size === 0}
							onclick={bulkUpdateExistingView}
						>
							{#if savingAction === 'bulk-view'}
								<span class="button-spinner"></span>
							{/if}
							Apply to selected
						</button>
					</div>
					<div class="batch-control">
						<label>
							<span class="label-row">
								Reveal side
								<img class="info-icon" src="{base}/media/info.svg" alt="" title="Desktop/tablet reveal direction. Mobile always reveals from below." />
							</span>
							<select bind:value={bulkRevealFrom}>
								{#each PHOTO_REVEAL_DIRECTIONS as direction}
									<option value={direction}>{direction}</option>
								{/each}
							</select>
						</label>
						<button
							type="button"
							class="fancy-btn small"
							disabled={selectedExistingSlugs.size === 0}
							onclick={() => bulkUpdateExistingVisual({ revealFrom: bulkRevealFrom }, 'Bulk update failed', 'bulk-reveal')}
						>
							{#if savingAction === 'bulk-reveal'}
								<span class="button-spinner"></span>
							{/if}
							Apply to selected
						</button>
					</div>
				</div>
			{/if}
		{/if}

		{#if isLoadingManifest}
			<p>Loading…</p>
		{:else if displayOrder.length === 0}
			<p>No photos yet. Upload your first photos above.</p>
		{:else if sectionPhotos.length === 0}
			<p>No photos in {activeSectionTitle}.</p>
		{:else}
			<div class="photo-grid">
				{#each sectionPhotos as photo, index (photo.id)}
					<div class="photo-card" class:row-selected={selectedExistingSlugs.has(photo.slug)}>
						<input
							type="checkbox"
							class="row-check"
							checked={selectedExistingSlugs.has(photo.slug)}
							onchange={() => toggleExistingSlug(photo.slug)}
						/>
						<div
							class="card-preview"
							style={`--preview-position: ${photoDrafts[photo.slug]?.positionX ?? photo.positionX}% ${photoDrafts[photo.slug]?.positionY ?? photo.positionY}%; --preview-scale: ${scaleFactor(photoDrafts[photo.slug]?.scalePercent ?? photo.scalePercent)};`}
						>
							<img src={imgUrl(photo.thumb)} alt={photo.title} class="card-thumb" />
						</div>
						<div class="card-body">
							<span class="order-num">{activeSectionTitle} #{index + 1} / global #{photo.order}</span>
							<label>
								<span class="label-row">
									Title
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Internal/display title for this photo. Click Save changes after editing." />
								</span>
								<input
									type="text"
									value={photoDrafts[photo.slug]?.title ?? photo.title}
									onchange={(e) =>
										updateDraft(photo.slug, { title: e.currentTarget.value })}
								/>
							</label>
							<span class="slug">{photo.slug}</span>
							<label>
								<span class="label-row">
									Collection group
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Selection is a separate editorial group. Years are separate home filter groups." />
								</span>
								<select
									value={photoDrafts[photo.slug]?.collectionKey ?? photo.collectionKey}
									onchange={(e) =>
										updateDraft(photo.slug, {
											collectionKey:
												e.currentTarget.value === PHOTO_SELECTION_COLLECTION
													? PHOTO_SELECTION_COLLECTION
													: Number(e.currentTarget.value)
										})}
								>
									{#each PHOTO_COLLECTION_OPTIONS as collection}
										<option value={collection}>{collectionLabel(collection)}</option>
									{/each}
								</select>
							</label>
							<label>
								<span class="label-row">
									Horizontal / left %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 left, 50 center, 100 right." />
								</span>
								<input
									type="number"
									min="0"
									max="100"
									value={photoDrafts[photo.slug]?.positionX ?? photo.positionX}
									onchange={(e) =>
										updateDraft(photo.slug, {
											positionX: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								<span class="label-row">
									Vertical / top %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="0 top, 50 center, 100 bottom." />
								</span>
								<input
									type="number"
									min="0"
									max="100"
									value={photoDrafts[photo.slug]?.positionY ?? photo.positionY}
									onchange={(e) =>
										updateDraft(photo.slug, {
											positionY: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								<span class="label-row">
									Scale %
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="1 natural cover, 100 strongest zoom." />
								</span>
								<input
									type="number"
									min="1"
									max="100"
									value={photoDrafts[photo.slug]?.scalePercent ?? photo.scalePercent}
									onchange={(e) =>
										updateDraft(photo.slug, {
											scalePercent: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								<span class="label-row">
									Reveal side
									<img class="info-icon" src="{base}/media/info.svg" alt="" title="Desktop/tablet reveal direction. Mobile always reveals from below." />
								</span>
								<select
									value={photoDrafts[photo.slug]?.revealFrom ?? photo.revealFrom}
									onchange={(e) =>
										updateDraft(photo.slug, {
											revealFrom: e.currentTarget.value
										})}
								>
									{#each PHOTO_REVEAL_DIRECTIONS as direction}
										<option value={direction}>{direction}</option>
									{/each}
								</select>
							</label>
							<div class="card-actions">
								<button
									type="button"
									class="fancy-btn small"
									disabled={!isPhotoDirty(photo) || savingAction !== null}
									onclick={() => savePhotoDraft(photo)}
								>
									{#if savingAction === `save-${photo.slug}`}
										<span class="button-spinner"></span>
									{/if}
									{isPhotoDirty(photo) ? 'Save changes' : 'Saved'}
								</button>
								{#if isPhotoDirty(photo)}
									<button
										type="button"
										class="fancy-btn small neutral"
										disabled={savingAction !== null}
										onclick={() => updateDraft(photo.slug, photoToDraft(photo))}
									>
										Reset
									</button>
								{/if}
								<button
									type="button"
									class="fancy-btn small neutral"
									disabled={index === 0}
									onclick={() => moveWithinSection(index, -1)}
									aria-label="Move up"
								>
									↑
								</button>
								<button
									type="button"
									class="fancy-btn small neutral"
									disabled={index === sectionPhotos.length - 1}
									onclick={() => moveWithinSection(index, 1)}
									aria-label="Move down"
								>
									↓
								</button>
								<button
									type="button"
									class="fancy-btn small danger"
									disabled={savingAction !== null}
									onclick={() => deletePhoto(photo.slug, photo.title)}
								>
									{#if savingAction === `delete-${photo.slug}`}
										<span class="button-spinner"></span>
									{/if}
									Delete
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.dashboard {
		max-width: 900px;
		margin: 0 auto;
		padding: 6rem 1.5rem 3rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.upload-section {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.drop-zone {
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}

	.drop-zone.drag-over {
		border-color: #f6ae2d;
		background: rgba(246, 174, 45, 0.08);
	}

	.staging {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.staging-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #ddd;
	}

	.select-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.fancy-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.45rem;
		padding: 0.55rem 1rem;
		overflow: hidden;
		border: 1px solid #f6ae2d;
		border-radius: 6px;
		background: #ffffff;
		color: #f6ae2d;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			color 180ms ease,
			background 180ms ease,
			opacity 180ms ease,
			transform 180ms ease;
	}

	.fancy-btn::before {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 2px;
		background: #f6ae2d;
		transition: height 180ms ease;
	}

	.fancy-btn:hover::before {
		height: 100%;
	}

	.fancy-btn:hover {
		color: #ffffff;
	}

	.fancy-btn > * {
		position: relative;
	}

	.fancy-btn.small {
		min-height: 2rem;
		padding: 0.4rem 0.7rem;
		font-size: 0.8rem;
	}

	.fancy-btn.neutral {
		border-color: #241e4e;
		color: #241e4e;
	}

	.fancy-btn.neutral::before {
		background: #241e4e;
	}

	.fancy-btn.danger {
		border-color: #c53030;
		color: #c53030;
	}

	.fancy-btn.danger::before {
		background: #c53030;
	}

	.fancy-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.fancy-btn:disabled::before {
		height: 2px;
	}

	.button-spinner {
		width: 0.9rem;
		height: 0.9rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 999px;
		animation: spin 700ms linear infinite;
	}

	.label-row {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.info-icon {
		width: 0.95rem;
		height: 0.95rem;
		color: #241e4e;
		opacity: 0.72;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.batch-panel {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 0.75rem;
		padding: 0.85rem;
		background: #ededed;
		border-radius: 6px;
	}

	.batch-control {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.batch-control label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.82rem;
		font-weight: 600;
	}

	.control-title {
		font-size: 0.82rem;
		font-weight: 700;
		color: #333;
	}

	.batch-control .strip-row {
		flex-direction: row;
		align-items: center;
	}

	.stage-row,
	.photo-card {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		background: #fff;
		padding: 1rem;
		border-radius: 8px;
		flex-wrap: wrap;
	}

	.stage-row {
		border: 2px solid transparent;
	}

	.row-selected {
		border-color: #f6ae2d;
	}

	.row-check {
		margin-top: 1.5rem;
		width: 1.1rem;
		height: 1.1rem;
		flex-shrink: 0;
	}

	.stage-preview,
	.card-preview {
		overflow: hidden;
		border-radius: 4px;
		background: #ddd;
		flex-shrink: 0;
	}

	.stage-preview {
		width: 80px;
		height: 60px;
	}

	.stage-thumb {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--preview-position);
		transform: scale(var(--preview-scale));
		transform-origin: var(--preview-position);
	}

	.stage-fields {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 200px;
	}

	.stage-fields label,
	.card-body label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
	}

	.stage-fields input[type='text'],
	.stage-fields input[type='number'],
	.card-body input[type='text'],
	.card-body input[type='number'],
	.batch-control input[type='number'] {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		max-width: 10rem;
	}

	.stage-fields select,
	.card-body select,
	.batch-control select {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		max-width: 10rem;
	}

	.strip-row {
		flex-direction: row !important;
		align-items: center;
	}

	.stage-actions {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		align-items: flex-end;
	}

	.status {
		font-size: 0.75rem;
		text-transform: uppercase;
		font-weight: 600;
	}

	.status-done {
		color: #44af69;
	}
	.status-error {
		color: #c53030;
	}
	.status-uploading {
		color: #f6ae2d;
	}

	.error-text {
		font-size: 0.75rem;
		color: #c53030;
		max-width: 120px;
	}

	.hint {
		font-size: 0.85rem;
		color: #c53030;
	}

	.grid-section {
		background: #fafafa;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.grid-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-bottom: 1rem;
	}

	.section-tabs button {
		padding: 0.45rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 999px;
		background: #fff;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.section-tabs button.active {
		border-color: #f6ae2d;
		background: #f6ae2d;
		color: #111;
	}

	.existing-bulk {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 1rem;
	}

	.existing-panel {
		margin-bottom: 1rem;
	}

	.photo-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.photo-card {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		border: 2px solid transparent;
	}

	.card-preview {
		width: 100px;
		height: 75px;
	}

	.card-thumb {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--preview-position);
		transform: scale(var(--preview-scale));
		transform-origin: var(--preview-position);
	}

	.card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.order-num {
		font-size: 0.85rem;
		color: #888;
	}

	.slug {
		font-size: 0.8rem;
		color: #666;
		font-family: monospace;
	}

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 600px) {
		.dashboard {
			padding-top: 5rem;
		}

		.batch-panel {
			grid-template-columns: 1fr;
		}
	}
</style>
