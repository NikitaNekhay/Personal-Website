import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { loadSettings, saveSettings } from '$lib/photo-settings-server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const { settings } = await loadSettings();
		return json(settings);
	} catch (error) {
		console.error('Load photo settings failed:', error);
		return json({ error: 'Failed to load settings' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();
		const value = body.parallaxIntensity;
		if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
			return json({ error: 'Invalid parallax intensity' }, { status: 400 });
		}

		const { settings, sha } = await loadSettings();
		const next = { ...settings, parallaxIntensity: Math.round(value) };
		await saveSettings(next, sha);
		return json(next);
	} catch (error) {
		console.error('Update photo settings failed:', error);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};
