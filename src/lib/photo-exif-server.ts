import exifr from 'exifr';
import { isValidLatLng, type PhotoGeoEntry } from '../shared/types';

/**
 * Server-side EXIF + reverse-geocoding helpers for the upload pipeline.
 *
 * GPS/date are read from the RAW uploaded buffer before sharp re-encodes (and strips)
 * the image, so the served WebP never carries location data — only the admin-only
 * geo store does. Every function here is defensive: bad/absent metadata or a failed
 * geocode must never throw, so an upload can never fail because of this.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
// Nominatim usage policy requires an identifying User-Agent.
const USER_AGENT = 'NekhayNikitaPhotoSite/1.0 (+https://nekhaynikita.ru)';

export interface RawPhotoMeta {
	lat: number;
	lng: number;
	dateTaken: string | null;
}

/** Reads GPS coordinates + capture date from an image buffer. Returns null when no GPS. */
export async function extractPhotoMeta(buffer: Buffer): Promise<RawPhotoMeta | null> {
	let lat: number | undefined;
	let lng: number | undefined;
	try {
		const gps = await exifr.gps(buffer);
		lat = gps?.latitude;
		lng = gps?.longitude;
	} catch {
		/* no/invalid GPS block */
	}
	if (!isValidLatLng(lat, lng)) return null;

	let dateTaken: string | null = null;
	try {
		const parsed = await exifr.parse(buffer, ['DateTimeOriginal', 'CreateDate']);
		const raw = parsed?.DateTimeOriginal ?? parsed?.CreateDate;
		if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
			dateTaken = raw.toISOString();
		} else if (typeof raw === 'string' && raw.trim() !== '') {
			const d = new Date(raw);
			if (!Number.isNaN(d.getTime())) dateTaken = d.toISOString();
		}
	} catch {
		/* no date tags */
	}

	return { lat: lat as number, lng: lng as number, dateTaken };
}

interface GeocodeResult {
	countryCode: string | null;
	countryName: string | null;
	city: string | null;
	label: string | null;
}

/** Reverse-geocodes coordinates to country/city via OpenStreetMap Nominatim. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
	const empty: GeocodeResult = { countryCode: null, countryName: null, city: null, label: null };
	try {
		const url = `${NOMINATIM_URL}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`;
		const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
		if (!res.ok) return empty;
		const data = await res.json();
		const addr = (data?.address ?? {}) as Record<string, string>;
		const city =
			addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? null;
		return {
			countryCode: addr.country_code ? addr.country_code.toUpperCase() : null,
			countryName: addr.country ?? null,
			city: city ?? null,
			label: typeof data?.display_name === 'string' ? data.display_name : null
		};
	} catch {
		return empty;
	}
}

/**
 * Same as resolvePhotoGeo but for coordinates already extracted elsewhere —
 * used by video uploads, where GPS is read from the MP4 container in the
 * browser (exifr can't parse video) and sent along with the poster.
 */
export async function resolveGeoFromCoords(
	slug: string,
	lat: number,
	lng: number,
	dateTaken: string | null
): Promise<PhotoGeoEntry | null> {
	if (!isValidLatLng(lat, lng)) return null;
	const place = await reverseGeocode(lat, lng);
	const geocoded =
		place.countryCode || place.countryName || place.city || place.label
			? new Date().toISOString()
			: null;
	return {
		slug,
		lat,
		lng,
		dateTaken,
		countryCode: place.countryCode,
		countryName: place.countryName,
		city: place.city,
		label: place.label,
		geocodedAt: geocoded
	};
}

/**
 * Full pipeline: extract GPS/date from a buffer and (if present) reverse-geocode it
 * into a cached PhotoGeoEntry. Returns null when the image has no usable GPS.
 */
export async function resolvePhotoGeo(slug: string, buffer: Buffer): Promise<PhotoGeoEntry | null> {
	const meta = await extractPhotoMeta(buffer);
	if (!meta) return null;
	const place = await reverseGeocode(meta.lat, meta.lng);
	const geocoded =
		place.countryCode || place.countryName || place.city || place.label
			? new Date().toISOString()
			: null;
	return {
		slug,
		lat: meta.lat,
		lng: meta.lng,
		dateTaken: meta.dateTaken,
		countryCode: place.countryCode,
		countryName: place.countryName,
		city: place.city,
		label: place.label,
		geocodedAt: geocoded
	};
}
