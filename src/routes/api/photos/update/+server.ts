import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import {
	isPhotoCollectionYear,
	isPhotoObjectPosition,
	isPhotoRevealDirection,
	type PhotoObjectPosition,
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
				objectPosition?: PhotoObjectPosition;
				revealFrom?: PhotoRevealDirection;
			} = {};

			if (body.collectionNumber !== undefined) {
				if (!isPhotoCollectionYear(body.collectionNumber)) {
					return json({ error: 'Invalid collection year' }, { status: 400 });
				}
				updates.collectionNumber = body.collectionNumber;
			}
			if (body.objectPosition !== undefined) {
				if (!isPhotoObjectPosition(body.objectPosition)) {
					return json({ error: 'Invalid image position' }, { status: 400 });
				}
				updates.objectPosition = body.objectPosition;
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
		const { slug, title, collectionNumber, objectPosition, revealFrom } = body;
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
		}
		if (objectPosition !== undefined) {
			if (!isPhotoObjectPosition(objectPosition)) {
				return json({ error: 'Invalid image position' }, { status: 400 });
			}
			entry.objectPosition = objectPosition;
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
