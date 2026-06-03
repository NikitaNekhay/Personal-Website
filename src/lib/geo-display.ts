import type { PhotoGeoEntry } from '../shared/types';

/** Small flag PNG from flagcdn (same source used across the profile/cart UI). */
export function getFlagUrl(countryCode: string): string {
	return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
}

/** Human-readable capture date, or null when unknown. */
export function formatTakenDate(iso: string | null): string | null {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** "City, Country" → "Country" → null, from a geo entry. */
export function placeLabel(geo: Pick<PhotoGeoEntry, 'city' | 'countryName'>): string | null {
	if (geo.city && geo.countryName) return `${geo.city}, ${geo.countryName}`;
	return geo.city ?? geo.countryName ?? null;
}

/** Compact coordinate string, e.g. "48.8566, 2.3522". */
export function formatCoords(lat: number, lng: number): string {
	return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
