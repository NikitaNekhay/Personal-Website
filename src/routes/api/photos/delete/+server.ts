import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { ghDelete, ghGetOptional } from '$lib/github';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import { loadGeo, saveGeo } from '$lib/photos-geo-server';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const { slug } = await request.json();
		if (!slug || typeof slug !== 'string') {
			return json({ error: 'Missing slug' }, { status: 400 });
		}

		const { entries, sha } = await loadManifest();
		const entry = entries.find((e) => e.slug === slug);
		if (!entry) {
			return json({ error: 'Photo not found' }, { status: 404 });
		}

		const originalPath = `static/photos/originals/${slug}.webp`;
		const thumbPath = `static/photos/thumbs/${slug}.webp`;

		for (const path of [originalPath, thumbPath]) {
			try {
				const file = await ghGetOptional(path);
				if (file) {
					await ghDelete(path, `[photos skip deploy] Delete photo file: ${slug}`, file.sha);
				}
			} catch (e) {
				console.warn(`Could not delete ${path}:`, e);
			}
		}

		const updated = entries.filter((e) => e.slug !== slug);
		await saveManifest(updated, sha);

		// Drop any stored location for this slug (best-effort; never blocks the delete).
		try {
			const { geo, sha: geoSha } = await loadGeo();
			if (geo[slug]) {
				delete geo[slug];
				await saveGeo(geo, geoSha);
			}
		} catch (e) {
			console.warn(`Could not update geo store on delete of ${slug}:`, e);
		}

		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Delete failed:', error);
		return json({ error: 'Delete failed' }, { status: 500 });
	}
};
