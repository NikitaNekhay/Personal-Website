import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { ghCommitFiles, type GhTreeFile } from '$lib/github';
import { loadManifest, MANIFEST_PATH, sortByOrder } from '$lib/photos-server';
import { loadGeo, geoToTreeFile, normalizeGeoEntry } from '$lib/photos-geo-server';
import {
	isPhotoCollectionYear,
	isPhotoCollectionKey,
	isPhotoObjectPosition,
	isPhotoPositionPercent,
	isPhotoRevealDirection,
	isPhotoScalePercent,
	normalizePhotoEntry,
	type PhotoGeoEntry,
	type PhotoManifestEntry
} from '../../../../shared/types';
import type { RequestHandler } from './$types';

interface PendingPhotoCommit {
	entry: PhotoManifestEntry;
	originalBlobSha: string;
	thumbBlobSha: string;
	geo?: PhotoGeoEntry | null;
}

function isValidPendingPhoto(value: unknown): value is PendingPhotoCommit {
	if (!value || typeof value !== 'object') return false;
	const item = value as PendingPhotoCommit;
	const entry = item.entry as PhotoManifestEntry | undefined;
	// Video entries must reference a file in this project's Firebase bucket; the
	// GitHub commit below only carries their poster images.
	const videoOk =
		entry?.mediaType !== 'video' ||
		(typeof entry.videoUrl === 'string' &&
			/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/.+/.test(entry.videoUrl));
	return (
		!!entry &&
		videoOk &&
		typeof entry.slug === 'string' &&
		typeof entry.title === 'string' &&
		typeof item.originalBlobSha === 'string' &&
		typeof item.thumbBlobSha === 'string' &&
		isPhotoCollectionYear(entry.collectionNumber) &&
		Array.isArray(entry.collectionKeys) &&
		entry.collectionKeys.length > 0 &&
		entry.collectionKeys.every(isPhotoCollectionKey) &&
		isPhotoObjectPosition(entry.objectPosition) &&
		isPhotoPositionPercent(entry.positionX) &&
		isPhotoPositionPercent(entry.positionY) &&
		isPhotoScalePercent(entry.scalePercent) &&
		isPhotoRevealDirection(entry.revealFrom)
	);
}

export const POST: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();
		const pending = Array.isArray(body.photos) ? body.photos : [];
		if (pending.length === 0 || !pending.every(isValidPendingPhoto)) {
			return json({ error: 'No valid pending photos provided' }, { status: 400 });
		}

		const { entries } = await loadManifest();
		const existingSlugs = new Set(entries.map((entry) => entry.slug));
		const incomingSlugs = pending.map((photo: PendingPhotoCommit) => photo.entry.slug);

		if (new Set(incomingSlugs).size !== incomingSlugs.length) {
			return json({ error: 'Duplicate uploaded slugs' }, { status: 409 });
		}
		if (incomingSlugs.some((slug: string) => existingSlugs.has(slug))) {
			return json({ error: 'One or more slugs already exist' }, { status: 409 });
		}

		const maxOrder = entries.reduce((max, entry) => Math.max(max, entry.order), 0);
		const newEntries = pending.map((photo: PendingPhotoCommit, index: number) =>
			normalizePhotoEntry({
				...photo.entry,
				order: maxOrder + index + 1
			})
		);
		const updated = sortByOrder([...entries, ...newEntries]);
		const manifestBase64 = Buffer.from(JSON.stringify(updated, null, 2), 'utf-8').toString(
			'base64'
		);

		const files: GhTreeFile[] = [
			...pending.flatMap((photo: PendingPhotoCommit) => [
				{
					path: `static/photos/originals/${photo.entry.slug}.webp`,
					sha: photo.originalBlobSha
				},
				{
					path: `static/photos/thumbs/${photo.entry.slug}.webp`,
					sha: photo.thumbBlobSha
				}
			]),
			{
				path: MANIFEST_PATH,
				contentBase64: manifestBase64
			}
		];

		// Fold any geotagged photos into the admin-only geo store in the same commit.
		const geoEntries = pending
			.map((photo: PendingPhotoCommit) => normalizeGeoEntry(photo.entry.slug, photo.geo))
			.filter((g: PhotoGeoEntry | null): g is PhotoGeoEntry => g !== null);
		if (geoEntries.length > 0) {
			const { geo } = await loadGeo();
			for (const g of geoEntries) geo[g.slug] = g;
			files.push(geoToTreeFile(geo));
		}

		await ghCommitFiles(
			files,
			`[photos skip deploy] Publish ${pending.length} photo${pending.length === 1 ? '' : 's'}`
		);

		return json(updated);
	} catch (error) {
		console.error('Publish photos failed:', error);
		return json({ error: 'Publish photos failed' }, { status: 500 });
	}
};
