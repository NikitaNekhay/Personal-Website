import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadManifest, saveManifest, sortByOrder } from '$lib/photos-server';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const { slugs } = await request.json();
		if (!Array.isArray(slugs) || slugs.some((s) => typeof s !== 'string')) {
			return json({ error: 'Invalid slugs array' }, { status: 400 });
		}

		const { entries, sha } = await loadManifest();
		const bySlug = new Map(entries.map((e) => [e.slug, e]));

		if (slugs.length !== entries.length || slugs.some((s) => !bySlug.has(s))) {
			return json({ error: 'Slugs must match all manifest entries' }, { status: 400 });
		}

		const updated = slugs.map((slug, index) => {
			const entry = bySlug.get(slug)!;
			return { ...entry, order: index + 1 };
		});

		await saveManifest(updated, sha);
		return json(sortByOrder(updated));
	} catch (error) {
		console.error('Reorder failed:', error);
		return json({ error: 'Reorder failed' }, { status: 500 });
	}
};
