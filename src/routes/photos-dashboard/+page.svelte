<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { auth } from '$lib/firebase/firebase';
	import {
		PHOTO_COLLECTION_YEARS,
		defaultCollectionNumber,
		type PhotoManifestEntry
	} from '../../shared/types';

	const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	const MAX_FILE_BYTES = 4 * 1024 * 1024;

	type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

	interface StagedFile {
		id: string;
		file: File;
		preview: string;
		slug: string;
		title: string;
		collectionNumber: number;
		stripExif: boolean;
		selected: boolean;
		status: UploadStatus;
		error?: string;
	}

	let manifest = $state<PhotoManifestEntry[]>([]);
	let isLoadingManifest = $state(true);
	let staged = $state<StagedFile[]>([]);
	let stripAllExif = $state(true);
	let defaultUploadYear = $state(defaultCollectionNumber());
	let bulkCollectionYear = $state(defaultCollectionNumber());
	let isUploading = $state(false);
	let orderDirty = $state(false);
	let displayOrder = $state<PhotoManifestEntry[]>([]);
	let selectedExistingSlugs = $state<Set<string>>(new Set());
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
			stripExif: stripAllExif,
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

	const selectedStaged = $derived(staged.filter((s) => s.selected));

	const allStagedSelected = $derived(staged.length > 0 && staged.every((s) => s.selected));

	function toggleSelectAllStaged() {
		const next = !allStagedSelected;
		staged = staged.map((s) => ({ ...s, selected: next }));
	}

	function applyBulkYearToStaged() {
		staged = staged.map((s) =>
			s.selected ? { ...s, collectionNumber: bulkCollectionYear } : s
		);
	}

	function applyDefaultYearToStaged() {
		staged = staged.map((s) => ({ ...s, collectionNumber: defaultUploadYear }));
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

				const res = await fetch(`${base}/api/photos/upload`, {
					method: 'POST',
					headers,
					body: formData
				});

				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error ?? 'Upload failed');
				}

				manifest = await res.json();
				staged[i] = { ...staged[i], status: 'done' };
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

		isUploading = false;
		staged = staged.filter((s) => s.status !== 'done');
		displayOrder = [...manifest].sort((a, b) => a.order - b.order);
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const arr = [...displayOrder];
		[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
		displayOrder = arr;
		orderDirty = true;
	}

	function moveDown(index: number) {
		if (index >= displayOrder.length - 1) return;
		const arr = [...displayOrder];
		[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
		displayOrder = arr;
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
		updates: { title?: string; collectionNumber?: number }
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

	function toggleExistingSlug(slug: string) {
		const next = new Set(selectedExistingSlugs);
		if (next.has(slug)) next.delete(slug);
		else next.add(slug);
		selectedExistingSlugs = next;
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
		return `${base}${path}`;
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

		<div class="defaults-row">
			<label>
				Default collection year for new files
				<select bind:value={defaultUploadYear}>
					{#each PHOTO_COLLECTION_YEARS as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</label>
		</div>

		{#if staged.length > 0}
			<div class="staging">
				<div class="staging-toolbar">
					<label class="strip-all">
						<input
							type="checkbox"
							checked={stripAllExif}
							onchange={(e) => setStripAll(e.currentTarget.checked)}
						/>
						Strip all EXIF
					</label>
					<label class="select-all">
						<input
							type="checkbox"
							checked={allStagedSelected}
							onchange={toggleSelectAllStaged}
						/>
						Select all ({selectedStaged.length}/{staged.length})
					</label>
					<div class="bulk-year">
						<select bind:value={bulkCollectionYear}>
							{#each PHOTO_COLLECTION_YEARS as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
						<button
							type="button"
							class="secondary-btn"
							disabled={selectedStaged.length === 0}
							onclick={applyBulkYearToStaged}
						>
							Apply year to selected
						</button>
						<button type="button" class="secondary-btn" onclick={applyDefaultYearToStaged}>
							Apply default to all
						</button>
					</div>
				</div>

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
						<img src={item.preview} alt="" class="stage-thumb" />
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
			<div class="existing-bulk">
				<select bind:value={bulkCollectionYear}>
					{#each PHOTO_COLLECTION_YEARS as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
				<button
					type="button"
					class="secondary-btn"
					disabled={selectedExistingSlugs.size === 0}
					onclick={bulkUpdateExistingCollection}
				>
					Apply year to {selectedExistingSlugs.size} selected
				</button>
			</div>
		{/if}

		{#if isLoadingManifest}
			<p>Loading…</p>
		{:else if displayOrder.length === 0}
			<p>No photos yet. Upload your first photos above.</p>
		{:else}
			<div class="photo-grid">
				{#each displayOrder as photo, index (photo.id)}
					<div class="photo-card" class:row-selected={selectedExistingSlugs.has(photo.slug)}>
						<input
							type="checkbox"
							class="row-check"
							checked={selectedExistingSlugs.has(photo.slug)}
							onchange={() => toggleExistingSlug(photo.slug)}
						/>
						<img src={imgUrl(photo.thumb)} alt={photo.title} class="card-thumb" />
						<div class="card-body">
							<span class="order-num">#{index + 1}</span>
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
							<div class="card-actions">
								<button
									type="button"
									disabled={index === 0}
									onclick={() => moveUp(index)}
									aria-label="Move up"
								>
									↑
								</button>
								<button
									type="button"
									disabled={index === displayOrder.length - 1}
									onclick={() => moveDown(index)}
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

	.defaults-row {
		margin-top: 1rem;
	}

	.defaults-row label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.defaults-row select {
		max-width: 12rem;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
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

	.strip-all,
	.select-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.bulk-year {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin-left: auto;
	}

	.bulk-year select {
		padding: 0.4rem 0.6rem;
		border: 1px solid #ddd;
		border-radius: 4px;
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

	.stage-thumb {
		width: 80px;
		height: 60px;
		object-fit: cover;
		border-radius: 4px;
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
	.card-body input[type='text'] {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.stage-fields select,
	.card-body select {
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

	.existing-bulk {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 1rem;
	}

	.existing-bulk select {
		padding: 0.4rem 0.6rem;
		border: 1px solid #ddd;
		border-radius: 4px;
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

	.card-thumb {
		width: 100px;
		height: 75px;
		object-fit: cover;
		border-radius: 4px;
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

		.bulk-year {
			margin-left: 0;
			width: 100%;
		}
	}
</style>
