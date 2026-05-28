import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { requireAdmin } from '$lib/auth-admin';
import { ghCommitFiles } from '$lib/github';
import { loadManifest, MANIFEST_PATH, sortByOrder } from '$lib/photos-server';
import {
	defaultCollectionNumber,
	DEFAULT_PHOTO_COLLECTION,
	isPhotoCollectionYear,
	isPhotoCollectionKey,
	isPhotoObjectPosition,
	isPhotoPositionPercent,
	isPhotoRevealDirection,
	isPhotoScalePercent,
	normalizePhotoCollectionKey,
	type PhotoManifestEntry
} from '../../../../shared/types';
import type { RequestHandler } from './$types';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	maxDuration: 10
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
		const collectionKeyRaw = formData.get('collectionKey') ?? DEFAULT_PHOTO_COLLECTION;
		const objectPositionRaw = formData.get('objectPosition');
		const positionXRaw = formData.get('positionX');
		const positionYRaw = formData.get('positionY');
		const scalePercentRaw = formData.get('scalePercent');
		const revealFromRaw = formData.get('revealFrom');
		let collectionNumber = defaultCollectionNumber();
		if (collectionRaw !== null && collectionRaw !== '') {
			const parsed = Number(collectionRaw);
			if (!isPhotoCollectionYear(parsed)) {
				return json({ error: 'Invalid collection year' }, { status: 400 });
			}
			collectionNumber = parsed;
		}
		if (!isPhotoCollectionKey(collectionKeyRaw)) {
			return json({ error: 'Invalid collection group' }, { status: 400 });
		}
		const collectionKey = normalizePhotoCollectionKey(collectionKeyRaw, collectionNumber);
		if (typeof collectionKey === 'number') collectionNumber = collectionKey;
		const objectPosition = isPhotoObjectPosition(objectPositionRaw)
			? objectPositionRaw
			: 'center center';
		const positionX = Number(positionXRaw ?? 50);
		const positionY = Number(positionYRaw ?? 50);
		const scalePercent = Number(scalePercentRaw ?? 1);
		const revealFrom = isPhotoRevealDirection(revealFromRaw) ? revealFromRaw : 'bottom';

		if (!isPhotoPositionPercent(positionX)) {
			return json({ error: 'Invalid horizontal position' }, { status: 400 });
		}
		if (!isPhotoPositionPercent(positionY)) {
			return json({ error: 'Invalid vertical position' }, { status: 400 });
		}
		if (!isPhotoScalePercent(scalePercent)) {
			return json({ error: 'Invalid scale percent' }, { status: 400 });
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

		const buffer = Buffer.from(await file.arrayBuffer());

		let pipeline = sharp(buffer);
		if (stripExif) {
			pipeline = pipeline.rotate(); // auto-orient without keeping metadata
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
		const width = meta.width ?? 0;
		const height = meta.height ?? 0;

		const { entries } = await loadManifest();
		if (entries.some((e) => e.slug === slug)) {
			return json({ error: 'Slug already exists' }, { status: 409 });
		}

		const maxOrder = entries.reduce((max, e) => Math.max(max, e.order), 0);
		const entry: PhotoManifestEntry = {
			id: randomBytes(4).toString('hex'),
			slug,
			title,
			order: maxOrder + 1,
			collectionNumber,
			original: `/photos/originals/${slug}.webp`,
			thumb: `/photos/thumbs/${slug}.webp`,
			width,
			height,
			objectPosition,
			collectionKey,
			positionX: Math.round(positionX),
			positionY: Math.round(positionY),
			scalePercent: Math.round(scalePercent),
			revealFrom,
			uploadedAt: new Date().toISOString()
		};

		const originalPath = `static/photos/originals/${slug}.webp`;
		const thumbPath = `static/photos/thumbs/${slug}.webp`;

		const updated = [...entries, entry];
		const manifestBase64 = Buffer.from(JSON.stringify(updated, null, 2), 'utf-8').toString(
			'base64'
		);

		await ghCommitFiles(
			[
				{
					path: originalPath,
					contentBase64: originalBuffer.toString('base64')
				},
				{
					path: thumbPath,
					contentBase64: thumbBuffer.toString('base64')
				},
				{
					path: MANIFEST_PATH,
					contentBase64: manifestBase64
				}
			],
			`[photos skip deploy] Add photo: ${slug}`
		);

		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Upload failed:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
