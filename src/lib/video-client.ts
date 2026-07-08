/**
 * Browser-side helpers for the dashboard video upload flow.
 *
 * Videos bypass the GitHub upload pipeline (Vercel caps request bodies at ~4.5MB
 * and the GitHub image proxy can't serve byte-range requests, which <video>
 * playback needs on iOS). Instead the file goes straight to Firebase Storage and
 * only its POSTER frame + metadata travel through the existing photo pipeline.
 * Everything the server can't do without ffmpeg happens here, in the browser,
 * where the decoder is free: poster capture, duration and GPS extraction.
 */

export interface VideoPosterCapture {
	/** JPEG frame grabbed shortly after the start of the video. */
	poster: Blob;
	/** Duration in whole seconds (0 when unknown). */
	duration: number;
	width: number;
	height: number;
}

/**
 * Decodes the first moments of a local video file and captures a poster frame.
 * Uses the browser's own decoder via an off-DOM <video> + <canvas>.
 */
export function captureVideoPoster(file: File): Promise<VideoPosterCapture> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const video = document.createElement('video');
		video.muted = true;
		video.playsInline = true;
		video.preload = 'auto';
		video.src = url;

		const fail = (message: string) => {
			cleanup();
			reject(new Error(message));
		};
		// Hard stop so a corrupt/unsupported file can never hang the upload UI.
		const timeout = setTimeout(() => fail('Poster capture timed out'), 15000);

		function cleanup() {
			clearTimeout(timeout);
			video.removeAttribute('src');
			video.load();
			URL.revokeObjectURL(url);
		}

		video.onerror = () => fail('Browser could not decode this video');

		video.onloadedmetadata = () => {
			// A frame at t=0 is often black; grab one slightly in, but stay within
			// very short clips.
			const t = Math.min(0.5, (video.duration || 1) / 10);
			video.currentTime = t;
		};

		video.onseeked = () => {
			const width = video.videoWidth;
			const height = video.videoHeight;
			if (!width || !height) return fail('Video has no visual track');
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) return fail('Canvas unavailable');
			ctx.drawImage(video, 0, 0, width, height);
			const duration = Number.isFinite(video.duration) ? Math.round(video.duration) : 0;
			canvas.toBlob(
				(blob) => {
					cleanup();
					if (!blob) return reject(new Error('Poster encoding failed'));
					resolve({ poster: blob, duration, width, height });
				},
				'image/jpeg',
				0.85
			);
		};
	});
}

/**
 * Best-effort GPS extraction from an MP4/MOV file.
 *
 * Phones write the capture location as an ISO 6709 string ("+53.9046+027.5615/")
 * into the QuickTime `©xyz` user-data box. exifr (used server-side for photos)
 * doesn't parse video containers, so we scan the raw bytes for the box here —
 * ~1 scan pass, no dependencies. Returns null when the file carries no location.
 */
export async function extractVideoGps(file: File): Promise<{ lat: number; lng: number } | null> {
	try {
		const bytes = new Uint8Array(await file.arrayBuffer());
		// Box name bytes: 0xA9 'x' 'y' 'z'
		for (let i = 0; i < bytes.length - 4; i++) {
			if (bytes[i] !== 0xa9 || bytes[i + 1] !== 0x78 || bytes[i + 2] !== 0x79 || bytes[i + 3] !== 0x7a) {
				continue;
			}
			// After the name: 2-byte big-endian string length + 2-byte language code.
			const start = i + 4;
			if (start + 4 > bytes.length) break;
			const len = (bytes[start] << 8) | bytes[start + 1];
			const strStart = start + 4;
			if (len <= 0 || len > 64 || strStart + len > bytes.length) continue;
			const text = new TextDecoder('ascii').decode(bytes.subarray(strStart, strStart + len));
			const match = text.match(/^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/);
			if (!match) continue;
			const lat = Number(match[1]);
			const lng = Number(match[2]);
			if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
				return { lat, lng };
			}
		}
		return null;
	} catch {
		return null;
	}
}
