import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import {
	isPhotoCollectionYear,
	isPhotoCollectionKey,
	isPhotoObjectPosition,
	isPhotoPositionPercent,
	isPhotoRevealDirection,
	isPhotoScalePercent,
	normalizePhotoCollectionKey,
	type PhotoCollectionKey,
	type PhotoRevealDirection
} from '../../../../shared/types';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();

		// Bulk: apply selected visual/data fields to many photos
		if (Array.isArray(body.slugs)) {
			const slugs = body.slugs as string[];
			const slugSet = new Set(slugs);
			const updates: {
				collectionNumber?: number;
				collectionKey?: PhotoCollectionKey;
				positionX?: number;
				positionY?: number;
				scalePercent?: number;
				revealFrom?: PhotoRevealDirection;
			} = {};

			if (body.collectionNumber !== undefined) {
				if (!isPhotoCollectionYear(body.collectionNumber)) {
					return json({ error: 'Invalid collection year' }, { status: 400 });
				}
				updates.collectionNumber = body.collectionNumber;
				updates.collectionKey = body.collectionNumber;
			}
			if (body.collectionKey !== undefined) {
				if (!isPhotoCollectionKey(body.collectionKey)) {
					return json({ error: 'Invalid collection group' }, { status: 400 });
				}
				const collectionKey = normalizePhotoCollectionKey(body.collectionKey);
				updates.collectionKey = collectionKey;
				if (typeof collectionKey === 'number') updates.collectionNumber = collectionKey;
			}
			if (body.objectPosition !== undefined) {
				if (!isPhotoObjectPosition(body.objectPosition)) {
					return json({ error: 'Invalid image position' }, { status: 400 });
				}
				updates.positionX = body.objectPosition.includes('left')
					? 0
					: body.objectPosition.includes('right')
						? 100
						: 50;
				updates.positionY = body.objectPosition.includes('top')
					? 0
					: body.objectPosition.includes('bottom')
						? 100
						: 50;
			}
			if (body.positionX !== undefined) {
				if (!isPhotoPositionPercent(body.positionX)) {
					return json({ error: 'Invalid horizontal position' }, { status: 400 });
				}
				updates.positionX = Math.round(body.positionX);
			}
			if (body.positionY !== undefined) {
				if (!isPhotoPositionPercent(body.positionY)) {
					return json({ error: 'Invalid vertical position' }, { status: 400 });
				}
				updates.positionY = Math.round(body.positionY);
			}
			if (body.scalePercent !== undefined) {
				if (!isPhotoScalePercent(body.scalePercent)) {
					return json({ error: 'Invalid scale percent' }, { status: 400 });
				}
				updates.scalePercent = Math.round(body.scalePercent);
			}
			if (body.revealFrom !== undefined) {
				if (!isPhotoRevealDirection(body.revealFrom)) {
					return json({ error: 'Invalid reveal direction' }, { status: 400 });
				}
				updates.revealFrom = body.revealFrom;
			}
			if (Object.keys(updates).length === 0) {
				return json({ error: 'No updates provided' }, { status: 400 });
			}

			const { entries, sha } = await loadManifest();
			if (!slugs.every((s: string) => entries.some((e) => e.slug === s))) {
				return json({ error: 'One or more slugs not found' }, { status: 404 });
			}
			const updated = entries.map((e) => (slugSet.has(e.slug) ? { ...e, ...updates } : e));
			await saveManifest(updated, sha);
			return json(sortByOrder(updated));
		}

		// Single photo update
		const {
			slug,
			title,
			collectionNumber,
			collectionKey,
			objectPosition,
			positionX,
			positionY,
			scalePercent,
			revealFrom
		} = body;
		if (!slug || typeof slug !== 'string') {
			return json({ error: 'Missing slug' }, { status: 400 });
		}

		const { entries, sha } = await loadManifest();
		const index = entries.findIndex((e) => e.slug === slug);
		if (index === -1) {
			return json({ error: 'Photo not found' }, { status: 404 });
		}

		const entry = { ...entries[index] };
		if (typeof title === 'string' && title.trim()) {
			entry.title = title.trim();
		}
		if (collectionNumber !== undefined) {
			if (!isPhotoCollectionYear(collectionNumber)) {
				return json({ error: 'Invalid collection year' }, { status: 400 });
			}
			entry.collectionNumber = collectionNumber;
			entry.collectionKey = collectionNumber;
		}
		if (collectionKey !== undefined) {
			if (!isPhotoCollectionKey(collectionKey)) {
				return json({ error: 'Invalid collection group' }, { status: 400 });
			}
			entry.collectionKey = normalizePhotoCollectionKey(collectionKey, entry.collectionNumber);
			if (typeof entry.collectionKey === 'number') entry.collectionNumber = entry.collectionKey;
		}
		if (objectPosition !== undefined) {
			if (!isPhotoObjectPosition(objectPosition)) {
				return json({ error: 'Invalid image position' }, { status: 400 });
			}
			entry.objectPosition = objectPosition;
			entry.positionX = objectPosition.includes('left')
				? 0
				: objectPosition.includes('right')
					? 100
					: 50;
			entry.positionY = objectPosition.includes('top')
				? 0
				: objectPosition.includes('bottom')
					? 100
					: 50;
		}
		if (positionX !== undefined) {
			if (!isPhotoPositionPercent(positionX)) {
				return json({ error: 'Invalid horizontal position' }, { status: 400 });
			}
			entry.positionX = Math.round(positionX);
		}
		if (positionY !== undefined) {
			if (!isPhotoPositionPercent(positionY)) {
				return json({ error: 'Invalid vertical position' }, { status: 400 });
			}
			entry.positionY = Math.round(positionY);
		}
		if (scalePercent !== undefined) {
			if (!isPhotoScalePercent(scalePercent)) {
				return json({ error: 'Invalid scale percent' }, { status: 400 });
			}
			entry.scalePercent = Math.round(scalePercent);
		}
		if (revealFrom !== undefined) {
			if (!isPhotoRevealDirection(revealFrom)) {
				return json({ error: 'Invalid reveal direction' }, { status: 400 });
			}
			entry.revealFrom = revealFrom;
		}

		const updated = [...entries];
		updated[index] = entry;
		await saveManifest(updated, sha);
		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Update failed:', error);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};
