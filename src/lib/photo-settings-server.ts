import { ghGetOptional, ghPut } from '$lib/github';

export const SETTINGS_PATH = 'static/photos/settings.json';

export interface PhotoSettings {
	/** Global editorial-canvas parallax intensity. 0 = none, 50 = default, 100 = strong. */
	parallaxIntensity: number;
}

export const DEFAULT_PHOTO_SETTINGS: PhotoSettings = {
	parallaxIntensity: 50
};

function normalizeSettings(raw: Partial<PhotoSettings> | null | undefined): PhotoSettings {
	const value = raw?.parallaxIntensity;
	const parallaxIntensity =
		typeof value === 'number' && Number.isFinite(value)
			? Math.round(Math.max(0, Math.min(100, value)))
			: DEFAULT_PHOTO_SETTINGS.parallaxIntensity;
	return { parallaxIntensity };
}

/**
 * Loads the global photo settings. Returns defaults (and `sha: null`) when the
 * settings file does not yet exist, so the first save creates it.
 */
export async function loadSettings(): Promise<{ settings: PhotoSettings; sha: string | null }> {
	const file = await ghGetOptional(SETTINGS_PATH);
	if (!file) return { settings: { ...DEFAULT_PHOTO_SETTINGS }, sha: null };
	try {
		const parsed = JSON.parse(file.content) as Partial<PhotoSettings>;
		return { settings: normalizeSettings(parsed), sha: file.sha };
	} catch {
		return { settings: { ...DEFAULT_PHOTO_SETTINGS }, sha: file.sha };
	}
}

export async function saveSettings(settings: PhotoSettings, sha: string | null): Promise<void> {
	const content = Buffer.from(JSON.stringify(normalizeSettings(settings), null, 2), 'utf-8').toString(
		'base64'
	);
	await ghPut(SETTINGS_PATH, content, '[photos skip deploy] Update photo settings', sha ?? undefined);
}
