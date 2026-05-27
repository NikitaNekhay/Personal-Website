import { ghGet, ghPut } from '$lib/github';
import { normalizePhotoEntry, type PhotoManifestEntry } from '../shared/types';

export const MANIFEST_PATH = 'static/photos/manifest.json';

export async function loadManifest(): Promise<{ entries: PhotoManifestEntry[]; sha: string }> {
	const { content, sha } = await ghGet(MANIFEST_PATH);
	const raw = JSON.parse(content) as Partial<PhotoManifestEntry>[];
	const entries = raw.map((e) =>
		normalizePhotoEntry({
			...e,
			id: e.id ?? '',
			slug: e.slug ?? ''
		})
	);
	return { entries, sha };
}

export async function saveManifest(entries: PhotoManifestEntry[], sha: string): Promise<void> {
	const content = Buffer.from(JSON.stringify(entries, null, 2), 'utf-8').toString('base64');
	await ghPut(MANIFEST_PATH, content, '[photos skip deploy] Update photo manifest', sha);
}

export function sortByOrder(entries: PhotoManifestEntry[]): PhotoManifestEntry[] {
	return [...entries].sort((a, b) => a.order - b.order);
}
