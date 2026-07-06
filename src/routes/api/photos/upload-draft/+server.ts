import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { requireAdmin } from '$lib/auth-admin';
import { ghCreateBlob } from '$lib/github';
import { loadManifest } from '$lib/photos-server';
import { resolvePhotoGeo } from '$lib/photo-exif-server';
import type { PhotoGeoEntry } from '../../../../shared/types';
import {
	defaultCollectionNumber,
	DEFAULT_PHOTO_COLLECTION,
	isPhotoCollectionYear,
	isPhotoCollectionKey,
	isPhotoObjectPosition,
	isPhotoPositionPercent,
	isPhotoRevealDirection,
	isPhotoScalePercent,
	isPhotoSpacing,
	isPhotoLayer,
	normalizePhotoCollectionKeys,
	DEFAULT_PHOTO_SCALE,
	DEFAULT_PHOTO_SPACING,
	DEFAULT_PHOTO_LAYER,
	type PhotoManifestEntry
} from '../../../../shared/types';
import type { RequestHandler } from './$types';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	maxDuration: 10
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface PendingPhotoUpload {
	entry: PhotoManifestEntry;
	originalBlobSha: string;
	thumbBlobSha: string;
	/** Geo read from EXIF + reverse-geocoded; null when the image had no GPS. */
	geo: PhotoGeoEntry | null;
}

export const POST: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const formData = await request.formData();
		const file = formData.get('file');
		const slug = String(formData.get('slug') ?? '').trim();
		const title = String(formData.get('title') ?? '').trim();
		const stripExif = formData.get('stripExif') !== 'false';
		const collectionRaw = formData.get('collectionNumber');
		const collectionKeysRaw = formData.get('collectionKeys');
		const objectPositionRaw = formData.get('objectPosition');
		const positionXRaw = formData.get('positionX');
		const positionYRaw = formData.get('positionY');
		const scalePercentRaw = formData.get('scalePercent');
		const revealFromRaw = formData.get('revealFrom');
		const spacingRaw = formData.get('spacing');
		const layerRaw = formData.get('layer');

		// Explicit collectionNumber wins; otherwise it's derived below from the photo's
		// own EXIF capture date (once read), falling back to the current year.
		let collectionNumber: number | null = null;
		if (collectionRaw !== null && collectionRaw !== '') {
			const parsed = Number(collectionRaw);
			if (!isPhotoCollectionYear(parsed)) {
				return json({ error: 'Invalid collection year' }, { status: 400 });
			}
			collectionNumber = parsed;
		}

		let collectionKeysParsed: unknown = [DEFAULT_PHOTO_COLLECTION];
		if (collectionKeysRaw !== null && collectionKeysRaw !== '') {
			try {
				collectionKeysParsed = JSON.parse(String(collectionKeysRaw));
			} catch {
				return json({ error: 'Invalid collection groups' }, { status: 400 });
			}
		}
		if (
			!Array.isArray(collectionKeysParsed) ||
			collectionKeysParsed.length === 0 ||
			!collectionKeysParsed.every(isPhotoCollectionKey)
		) {
			return json({ error: 'Invalid collection groups' }, { status: 400 });
		}

		const objectPosition = isPhotoObjectPosition(objectPositionRaw)
			? objectPositionRaw
			: 'center center';
		const positionX = Number(positionXRaw ?? 50);
		const positionY = Number(positionYRaw ?? 50);
		const scalePercent = Number(scalePercentRaw ?? DEFAULT_PHOTO_SCALE);
		const revealFrom = isPhotoRevealDirection(revealFromRaw) ? revealFromRaw : 'bottom';
		const spacing = Number(spacingRaw ?? DEFAULT_PHOTO_SPACING);
		const layer = Number(layerRaw ?? DEFAULT_PHOTO_LAYER);

		if (!isPhotoPositionPercent(positionX)) {
			return json({ error: 'Invalid horizontal position' }, { status: 400 });
		}
		if (!isPhotoPositionPercent(positionY)) {
			return json({ error: 'Invalid vertical position' }, { status: 400 });
		}
		if (!isPhotoScalePercent(scalePercent)) {
			return json({ error: 'Invalid scale percent' }, { status: 400 });
		}
		if (!isPhotoSpacing(spacing)) {
			return json({ error: 'Invalid spacing' }, { status: 400 });
		}
		if (!isPhotoLayer(layer)) {
			return json({ error: 'Invalid layer' }, { status: 400 });
		}

		if (!(file instanceof File)) {
			return json({ error: 'Missing file' }, { status: 400 });
		}
		if (!slug || !SLUG_RE.test(slug)) {
			return json({ error: 'Invalid slug' }, { status: 400 });
		}
		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		const { entries } = await loadManifest();
		if (entries.some((e) => e.slug === slug)) {
			return json({ error: 'Slug already exists' }, { status: 409 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		// Read GPS/date from the RAW buffer before sharp strips metadata below.
		const geoEntry = await resolvePhotoGeo(slug, buffer);

		// Smart default: if the admin didn't pick a year explicitly, use the photo's own
		// EXIF capture date instead of silently defaulting to "today" — this is the exact
		// gap that previously left every uploaded photo tagged with the current year
		// regardless of when it was actually taken.
		if (collectionNumber === null) {
			const exifYear = geoEntry?.dateTaken ? new Date(geoEntry.dateTaken).getUTCFullYear() : null;
			collectionNumber = exifYear !== null && isPhotoCollectionYear(exifYear) ? exifYear : defaultCollectionNumber();
		}
		const collectionKeys = normalizePhotoCollectionKeys(collectionKeysParsed, collectionNumber);

		let pipeline = sharp(buffer);
		if (stripExif) {
			pipeline = pipeline.rotate();
		}

		const originalBuffer = await pipeline
			.clone()
			.resize({ width: 1920, withoutEnlargement: true, fit: 'inside' })
			.webp({ quality: 82 })
			.toBuffer();

		const thumbBuffer = await sharp(buffer)
			.rotate()
			.resize({ width: 600, withoutEnlargement: true, fit: 'inside' })
			.webp({ quality: 80 })
			.toBuffer();

		const meta = await sharp(originalBuffer).metadata();
		const entry: PhotoManifestEntry = {
			id: randomBytes(4).toString('hex'),
			slug,
			title,
			order: 0,
			collectionNumber,
			original: `/photos/originals/${slug}.webp`,
			thumb: `/photos/thumbs/${slug}.webp`,
			width: meta.width ?? 0,
			height: meta.height ?? 0,
			objectPosition,
			collectionKeys,
			positionX: Math.round(positionX),
			positionY: Math.round(positionY),
			scalePercent: Math.round(scalePercent),
			revealFrom,
			spacing: Math.round(spacing),
			layer: Math.round(layer),
			uploadedAt: new Date().toISOString()
		};

		const pending: PendingPhotoUpload = {
			entry,
			originalBlobSha: await ghCreateBlob(originalBuffer.toString('base64'), 'base64'),
			thumbBlobSha: await ghCreateBlob(thumbBuffer.toString('base64'), 'base64'),
			geo: geoEntry
		};

		return json(pending);
	} catch (error) {
		console.error('Draft upload failed:', error);
		return json({ error: 'Draft upload failed' }, { status: 500 });
	}
};
