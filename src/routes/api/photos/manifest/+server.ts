import { json } from '@sveltejs/kit';
import { loadManifest, sortByOrder } from '$lib/photos-server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const { entries } = await loadManifest();
		return json(sortByOrder(entries));
	} catch (error) {
		console.error('Failed to load manifest:', error);
		return json({ error: 'Failed to load manifest' }, { status: 500 });
	}
};
