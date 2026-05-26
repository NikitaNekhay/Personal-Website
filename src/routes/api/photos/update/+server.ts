import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import { isPhotoCollectionYear } from '../../../../shared/types';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();

		// Bulk: apply collection year to many photos
		if (Array.isArray(body.slugs) && typeof body.collectionNumber === 'number') {
			if (!isPhotoCollectionYear(body.collectionNumber)) {
				return json({ error: 'Invalid collection year' }, { status: 400 });
			}
			const slugs = body.slugs as string[];
			const slugSet = new Set(slugs);
			const { entries, sha } = await loadManifest();
			if (!slugs.every((s: string) => entries.some((e) => e.slug === s))) {
				return json({ error: 'One or more slugs not found' }, { status: 404 });
			}
			const updated = entries.map((e) =>
				slugSet.has(e.slug) ? { ...e, collectionNumber: body.collectionNumber } : e
			);
			await saveManifest(updated, sha);
			return json(sortByOrder(updated));
		}

		// Single photo update
		const { slug, title, collectionNumber } = body;
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

		const updated = [...entries];
		updated[index] = entry;
		await saveManifest(updated, sha);
		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Update failed:', error);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};
