/**
 * Browser-side image compression for the dashboard upload flow.
 *
 * The photo pipeline is capped at ~4MB per request (Vercel serverless body
 * limit), but the admin shouldn't have to resize exports by hand: anything
 * over the limit is transparently downscaled/re-encoded here before staging.
 *
 * Quality is a non-issue in practice — the server re-encodes every upload to a
 * 1920px-wide WebP anyway, so pre-shrinking to ≤2560px JPEG loses nothing that
 * would ever reach the public page. EXIF (GPS/date) does NOT survive a canvas
 * re-encode, so callers must extract it from the ORIGINAL file first (see
 * extractImageMeta) and pass it through the upload form instead.
 */

export interface CompressedImage {
	file: File;
	/** True when the file was actually re-encoded (false = returned as-is). */
	compressed: boolean;
}

const MAX_DIMENSION = 2560;
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55];

/**
 * Returns the file untouched when it's already within `maxBytes`; otherwise
 * re-encodes it as a progressively smaller JPEG until it fits. Throws only
 * when the browser can't decode the format at all (e.g. HEIC in Chrome).
 */
export async function compressImageToLimit(file: File, maxBytes: number): Promise<CompressedImage> {
	if (file.size <= maxBytes) return { file, compressed: false };

	let bitmap: ImageBitmap;
	try {
		// 'from-image' bakes the EXIF orientation into the pixels, so the output
		// is upright even though the re-encode drops the orientation tag.
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	} catch {
		throw new Error(
			`${file.name}: browser cannot decode this image format — convert it to JPEG/PNG/WebP first`
		);
	}

	try {
		let scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

		// Outer loop shrinks dimensions, inner loop lowers JPEG quality — between
		// the two, any decodable photo lands under the limit within a few passes.
		for (let attempt = 0; attempt < 5; attempt++) {
			const width = Math.max(1, Math.round(bitmap.width * scale));
			const height = Math.max(1, Math.round(bitmap.height * scale));
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Canvas unavailable');
			ctx.drawImage(bitmap, 0, 0, width, height);

			for (const quality of QUALITY_STEPS) {
				const blob = await new Promise<Blob | null>((resolve) =>
					canvas.toBlob(resolve, 'image/jpeg', quality)
				);
				if (blob && blob.size <= maxBytes) {
					const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
					return {
						file: new File([blob], name, { type: 'image/jpeg' }),
						compressed: true
					};
				}
			}
			scale *= 0.75;
		}
		throw new Error(`${file.name}: could not compress under the upload limit`);
	} finally {
		bitmap.close();
	}
}

export interface ImageMeta {
	gps: { lat: number; lng: number } | null;
	/** EXIF capture date (null when absent). */
	createdAt: Date | null;
}

/**
 * Reads GPS + capture date from the ORIGINAL file's EXIF, for use when the
 * upload itself is a re-encoded copy that no longer carries metadata. exifr is
 * already a project dependency (server pipeline) and works in the browser.
 */
export async function extractImageMeta(file: File): Promise<ImageMeta> {
	const meta: ImageMeta = { gps: null, createdAt: null };
	try {
		const { default: exifr } = await import('exifr');
		try {
			const gps = await exifr.gps(file);
			if (
				gps &&
				Number.isFinite(gps.latitude) &&
				Number.isFinite(gps.longitude) &&
				Math.abs(gps.latitude) <= 90 &&
				Math.abs(gps.longitude) <= 180
			) {
				meta.gps = { lat: gps.latitude, lng: gps.longitude };
			}
		} catch {
			/* no GPS block */
		}
		try {
			const parsed = await exifr.parse(file, ['DateTimeOriginal', 'CreateDate']);
			const raw = parsed?.DateTimeOriginal ?? parsed?.CreateDate;
			if (raw instanceof Date && !Number.isNaN(raw.getTime())) meta.createdAt = raw;
		} catch {
			/* no date tags */
		}
	} catch {
		/* exifr failed to load — return empty meta */
	}
	return meta;
}
