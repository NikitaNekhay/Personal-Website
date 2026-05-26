import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { requireAdmin } from '$lib/auth-admin';
import { ghPut } from '$lib/github';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import {
	defaultCollectionNumber,
	isPhotoCollectionYear,
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
		let collectionNumber = defaultCollectionNumber();
		if (collectionRaw !== null && collectionRaw !== '') {
			const parsed = Number(collectionRaw);
			if (!isPhotoCollectionYear(parsed)) {
				return json({ error: 'Invalid collection year' }, { status: 400 });
			}
			collectionNumber = parsed;
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

		const { entries, sha } = await loadManifest();
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
			uploadedAt: new Date().toISOString()
		};

		const originalPath = `static/photos/originals/${slug}.webp`;
		const thumbPath = `static/photos/thumbs/${slug}.webp`;

		await ghPut(
			originalPath,
			originalBuffer.toString('base64'),
			`Add photo original: ${slug}`
		);
		await ghPut(thumbPath, thumbBuffer.toString('base64'), `Add photo thumb: ${slug}`);

		const updated = [...entries, entry];
		await saveManifest(updated, sha);

		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Upload failed:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
