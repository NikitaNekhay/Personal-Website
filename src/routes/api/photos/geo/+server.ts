import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadGeo } from '$lib/photos-geo-server';
import type { RequestHandler } from './$types';

/**
 * Admin-only read of the per-photo geolocation map (keyed by slug). This is the ONLY
 * way the client obtains geo data — it is deliberately kept out of the public photo
 * manifest so coordinates are never exposed on the site/homepage.
 */
export const GET: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const { geo } = await loadGeo();
		return json(geo);
	} catch (error) {
		console.error('Load photo geo failed:', error);
		return json({ error: 'Failed to load geo data' }, { status: 500 });
	}
};
