import { ghGetOptional, ghPut, type GhTreeFile } from '$lib/github';
import { isValidLatLng, type PhotoGeoEntry } from '../shared/types';

/**
 * Per-photo geolocation store. Kept OUTSIDE `static/` on purpose so it is never
 * shipped as a public asset and is only ever read through the admin-guarded
 * GET /api/photos/geo endpoint. Shape: a map keyed by photo slug.
 */
export const GEO_PATH = 'static/photos/data/photos-geo.json';

export type PhotoGeoMap = Record<string, PhotoGeoEntry>;

function str(value: unknown): string | null {
	return typeof value === 'string' && value.trim() !== '' ? value : null;
}

/** Coerce an arbitrary parsed object into a clean PhotoGeoEntry (or null if invalid). */
export function normalizeGeoEntry(slug: string, raw: unknown): PhotoGeoEntry | null {
	if (!raw || typeof raw !== 'object') return null;
	const r = raw as Partial<PhotoGeoEntry>;
	if (!isValidLatLng(r.lat, r.lng)) return null;
	return {
		slug,
		lat: r.lat as number,
		lng: r.lng as number,
		dateTaken: str(r.dateTaken),
		countryCode: str(r.countryCode)?.toUpperCase() ?? null,
		countryName: str(r.countryName),
		city: str(r.city),
		label: str(r.label),
		geocodedAt: str(r.geocodedAt)
	};
}

function normalizeMap(raw: unknown): PhotoGeoMap {
	if (!raw || typeof raw !== 'object') return {};
	const out: PhotoGeoMap = {};
	for (const [slug, value] of Object.entries(raw as Record<string, unknown>)) {
		const entry = normalizeGeoEntry(slug, value);
		if (entry) out[slug] = entry;
	}
	return out;
}

/**
 * Loads the geo map. Returns an empty map (and `sha: null`) when the file does not
 * yet exist, so the first write creates it.
 */
export async function loadGeo(): Promise<{ geo: PhotoGeoMap; sha: string | null }> {
	const file = await ghGetOptional(GEO_PATH);
	if (!file) return { geo: {}, sha: null };
	try {
		return { geo: normalizeMap(JSON.parse(file.content)), sha: file.sha };
	} catch {
		return { geo: {}, sha: file.sha };
	}
}

export async function saveGeo(geo: PhotoGeoMap, sha: string | null): Promise<void> {
	const content = Buffer.from(JSON.stringify(geo, null, 2), 'utf-8').toString('base64');
	await ghPut(GEO_PATH, content, '[photos skip deploy] Update photo geo data', sha ?? undefined);
}

/**
 * Builds a tree-file entry for the geo map so callers can fold it into an existing
 * `ghCommitFiles([...])` transaction (single atomic commit alongside image blobs).
 */
export function geoToTreeFile(geo: PhotoGeoMap): GhTreeFile {
	return {
		path: GEO_PATH,
		contentBase64: Buffer.from(JSON.stringify(geo, null, 2), 'utf-8').toString('base64')
	};
}
