<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { auth } from '$lib/firebase/firebase';
	import {
		PHOTO_COLLECTION_YEARS,
		PHOTO_REVEAL_DIRECTIONS,
		DEFAULT_PHOTO_POSITION,
		DEFAULT_PHOTO_SCALE,
		defaultCollectionNumber,
		type PhotoManifestEntry
	} from '../../shared/types';

	const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	const MAX_FILE_BYTES = 4 * 1024 * 1024;

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

	let manifest = $state<PhotoManifestEntry[]>([]);
	let isLoadingManifest = $state(true);
	let staged = $state<StagedFile[]>([]);
	let stripAllExif = $state(true);
	let defaultUploadYear = $state(defaultCollectionNumber());
	let bulkCollectionYear = $state(defaultCollectionNumber());
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
	let dragOver = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();

	function toSlug(filename: string): string {
		return filename
			.replace(/\.[^.]+$/, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
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
			orderDirty = false;
			selectedExistingSlugs = new Set();
		} catch (e) {
			console.error(e);
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
			alert(
				`${oversized.length} file(s) exceed 4MB and cannot be uploaded:\n${oversized.map((f) => f.name).join('\n')}`
			);
		}
		const valid = list.filter((f) => f.size <= MAX_FILE_BYTES);
		const newStaged: StagedFile[] = valid.map((file) => ({
			id: crypto.randomUUID(),
			file,
			preview: URL.createObjectURL(file),
			slug: toSlug(file.name),
			title: file.name.replace(/\.[^.]+$/, ''),
			collectionNumber: defaultUploadYear,
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
			return displayOrder.filter((photo) => selectedExistingSlugs.has(photo.slug));
		}
		if (section === 'all') return displayOrder;
		return displayOrder.filter((photo) => photo.collectionNumber === section);
	}

	const sectionPhotos = $derived.by(() => getPhotosForSection(activeSection));
	const allSectionSelected = $derived(
		sectionPhotos.length > 0 &&
			sectionPhotos.every((photo) => selectedExistingSlugs.has(photo.slug))
	);
	const activeSectionTitle = $derived(
		activeSection === 'all'
			? 'All'
			: activeSection === 'selection'
				? 'Selection'
				: String(activeSection)
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

	function applyBulkYearToStaged() {
		staged = staged.map((s) =>
			s.selected ? { ...s, collectionNumber: bulkCollectionYear } : s
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
				staged[i] = {
					...staged[i],
					status: 'error',
					error: e instanceof Error ? e.message : 'Upload failed'
				};
				staged = [...staged];
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
				const published = new Set(pendingPhotos.map((photo) => photo.entry.slug));
				staged = staged.map((item) =>
					published.has(item.slug) ? { ...item, status: 'done' } : item
				);
			} catch (e) {
				const message = e instanceof Error ? e.message : 'Publish failed';
				const published = new Set(pendingPhotos.map((photo) => photo.entry.slug));
				staged = staged.map((item) =>
					published.has(item.slug) ? { ...item, status: 'error', error: message } : item
				);
			}
		}

		isUploading = false;
		staged = staged.filter((s) => s.status !== 'done');
		displayOrder = [...manifest].sort((a, b) => a.order - b.order);
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
			orderDirty = false;
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Reorder failed');
		}
	}

	async function updatePhoto(
		slug: string,
		updates: {
			title?: string;
			collectionNumber?: number;
			positionX?: number;
			positionY?: number;
			scalePercent?: number;
			revealFrom?: string;
		}
	) {
		const headers = {
			...(await getAuthHeaders()),
			'Content-Type': 'application/json'
		};
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
	}

	async function bulkUpdateExistingCollection() {
		if (selectedExistingSlugs.size === 0) return;
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
					collectionNumber: bulkCollectionYear
				})
			});
			if (!res.ok) throw new Error('Bulk update failed');
			manifest = await res.json();
			displayOrder = [...manifest].sort((a, b) => a.order - b.order);
			selectedExistingSlugs = new Set();
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Bulk update failed');
		}
	}

	async function bulkUpdateExistingVisual(
		updates: { positionX?: number; positionY?: number; scalePercent?: number; revealFrom?: string },
		message = 'Bulk update failed'
	) {
		if (selectedExistingSlugs.size === 0) return;
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
			selectedExistingSlugs = new Set();
		} catch (e) {
			alert(e instanceof Error ? e.message : message);
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
		await bulkUpdateExistingVisual({
			positionX: bulkPositionX,
			positionY: bulkPositionY,
			scalePercent: bulkScalePercent
		});
	}

	async function deletePhoto(slug: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
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
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Delete failed');
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
			<button type="button" class="browse-btn" onclick={() => fileInput?.click()}>
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
						class="secondary-btn"
						onclick={() => (showStagingBatch = !showStagingBatch)}
					>
						{showStagingBatch ? 'Hide batch edit' : 'Batch edit selected'}
					</button>
				</div>

				{#if showStagingBatch}
					<div class="batch-panel">
						<div class="batch-control">
							<label>
								Collection year
								<select bind:value={bulkCollectionYear}>
									{#each PHOTO_COLLECTION_YEARS as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</label>
							<button
								type="button"
								class="secondary-btn"
								disabled={selectedStaged.length === 0}
								onclick={applyBulkYearToStaged}
							>
								Apply to selected
							</button>
						</div>
						<div class="batch-control">
							<span class="control-title">Photo crop</span>
							<label>
								Horizontal / left %
								<input type="number" min="0" max="100" bind:value={bulkPositionX} />
							</label>
							<label>
								Vertical / top %
								<input type="number" min="0" max="100" bind:value={bulkPositionY} />
							</label>
							<label>
								Scale %
								<input type="number" min="1" max="100" bind:value={bulkScalePercent} />
							</label>
							<button
								type="button"
								class="secondary-btn"
								disabled={selectedStaged.length === 0}
								onclick={applyBulkViewToStaged}
							>
								Apply to selected
							</button>
						</div>
						<div class="batch-control">
							<label>
								Reveal side
								<select bind:value={bulkRevealFrom}>
									{#each PHOTO_REVEAL_DIRECTIONS as direction}
										<option value={direction}>{direction}</option>
									{/each}
								</select>
							</label>
							<button
								type="button"
								class="secondary-btn"
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
								class="secondary-btn"
								disabled={selectedStaged.length === 0}
								onclick={() => setStripSelected(stripAllExif)}
							>
								Apply to selected
							</button>
							<button
								type="button"
								class="secondary-btn"
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
								Slug
								<input type="text" bind:value={staged[i].slug} />
							</label>
							<label>
								Title
								<input type="text" bind:value={staged[i].title} />
							</label>
							<label>
								Collection year
								<select bind:value={staged[i].collectionNumber}>
									{#each PHOTO_COLLECTION_YEARS as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</label>
							<label>
								Horizontal / left %
								<input type="number" min="0" max="100" bind:value={staged[i].positionX} />
							</label>
							<label>
								Vertical / top %
								<input type="number" min="0" max="100" bind:value={staged[i].positionY} />
							</label>
							<label>
								Scale %
								<input type="number" min="1" max="100" bind:value={staged[i].scalePercent} />
							</label>
							<label>
								Reveal side
								<select bind:value={staged[i].revealFrom}>
									{#each PHOTO_REVEAL_DIRECTIONS as direction}
										<option value={direction}>{direction}</option>
									{/each}
								</select>
							</label>
							<label class="strip-row">
								<input type="checkbox" bind:checked={staged[i].stripExif} />
								Strip EXIF
							</label>
						</div>
						<div class="stage-actions">
							<span class="status status-{item.status}">{item.status}</span>
							{#if item.error}
								<span class="error-text">{item.error}</span>
							{/if}
							<button type="button" class="remove-btn" onclick={() => removeStaged(item.id)}>
								Remove
							</button>
						</div>
					</div>
				{/each}

				<button
					type="button"
					class="upload-btn"
					disabled={!slugValid || isUploading}
					onclick={uploadAll}
				>
					{isUploading ? 'Uploading…' : 'Upload all'}
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
				<button type="button" class="save-order-btn" onclick={saveOrder}>Save order</button>
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
					Selection ({selectedExistingSlugs.size})
				</button>
				{#each PHOTO_COLLECTION_YEARS as year}
					<button
						type="button"
						class:active={activeSection === year}
						onclick={() => (activeSection = year)}
					>
						{year} ({displayOrder.filter((photo) => photo.collectionNumber === year).length})
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
					class="secondary-btn"
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
							Collection year
							<select bind:value={bulkCollectionYear}>
								{#each PHOTO_COLLECTION_YEARS as year}
									<option value={year}>{year}</option>
								{/each}
							</select>
						</label>
						<button
							type="button"
							class="secondary-btn"
							disabled={selectedExistingSlugs.size === 0}
							onclick={bulkUpdateExistingCollection}
						>
							Apply to selected
						</button>
					</div>
					<div class="batch-control">
						<span class="control-title">Photo crop</span>
						<label>
							Horizontal / left %
							<input type="number" min="0" max="100" bind:value={bulkPositionX} />
						</label>
						<label>
							Vertical / top %
							<input type="number" min="0" max="100" bind:value={bulkPositionY} />
						</label>
						<label>
							Scale %
							<input type="number" min="1" max="100" bind:value={bulkScalePercent} />
						</label>
						<button
							type="button"
							class="secondary-btn"
							disabled={selectedExistingSlugs.size === 0}
							onclick={bulkUpdateExistingView}
						>
							Apply to selected
						</button>
					</div>
					<div class="batch-control">
						<label>
							Reveal side
							<select bind:value={bulkRevealFrom}>
								{#each PHOTO_REVEAL_DIRECTIONS as direction}
									<option value={direction}>{direction}</option>
								{/each}
							</select>
						</label>
						<button
							type="button"
							class="secondary-btn"
							disabled={selectedExistingSlugs.size === 0}
							onclick={() => bulkUpdateExistingVisual({ revealFrom: bulkRevealFrom })}
						>
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
							style={`--preview-position: ${photo.positionX}% ${photo.positionY}%; --preview-scale: ${scaleFactor(photo.scalePercent)};`}
						>
							<img src={imgUrl(photo.thumb)} alt={photo.title} class="card-thumb" />
						</div>
						<div class="card-body">
							<span class="order-num">{activeSectionTitle} #{index + 1} / global #{photo.order}</span>
							<label>
								Title
								<input
									type="text"
									value={photo.title}
									onchange={(e) =>
										updatePhoto(photo.slug, { title: e.currentTarget.value })}
								/>
							</label>
							<span class="slug">{photo.slug}</span>
							<label>
								Collection year
								<select
									value={photo.collectionNumber}
									onchange={(e) =>
										updatePhoto(photo.slug, {
											collectionNumber: Number(e.currentTarget.value)
										})}
								>
									{#each PHOTO_COLLECTION_YEARS as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</label>
							<label>
								Horizontal / left %
								<input
									type="number"
									min="0"
									max="100"
									value={photo.positionX}
									onchange={(e) =>
										updatePhoto(photo.slug, {
											positionX: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								Vertical / top %
								<input
									type="number"
									min="0"
									max="100"
									value={photo.positionY}
									onchange={(e) =>
										updatePhoto(photo.slug, {
											positionY: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								Scale %
								<input
									type="number"
									min="1"
									max="100"
									value={photo.scalePercent}
									onchange={(e) =>
										updatePhoto(photo.slug, {
											scalePercent: Number(e.currentTarget.value)
										})}
								/>
							</label>
							<label>
								Reveal side
								<select
									value={photo.revealFrom}
									onchange={(e) =>
										updatePhoto(photo.slug, {
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
									disabled={index === 0}
									onclick={() => moveWithinSection(index, -1)}
									aria-label="Move up"
								>
									↑
								</button>
								<button
									type="button"
									disabled={index === sectionPhotos.length - 1}
									onclick={() => moveWithinSection(index, 1)}
									aria-label="Move down"
								>
									↓
								</button>
								<button
									type="button"
									class="delete-btn"
									onclick={() => deletePhoto(photo.slug, photo.title)}
								>
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

	.browse-btn {
		margin-top: 1rem;
		padding: 0.6rem 1.2rem;
		background: #241e4e;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
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

	.secondary-btn {
		padding: 0.4rem 0.75rem;
		background: #e8e8e8;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.secondary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	.remove-btn {
		padding: 0.35rem 0.75rem;
		background: #e0e0e0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.upload-btn {
		padding: 0.75rem 1.5rem;
		background: #f6ae2d;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		align-self: flex-start;
	}

	.upload-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	.save-order-btn {
		padding: 0.5rem 1rem;
		background: #241e4e;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
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
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.card-actions button {
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 4px;
		background: #e0e0e0;
		cursor: pointer;
	}

	.card-actions button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.delete-btn {
		background: #c53030 !important;
		color: #fff;
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
