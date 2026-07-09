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

		let settled = false;
		let metadataSeen = false;

		const fail = (message: string) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(new Error(message));
		};

		function cleanup() {
			clearTimeout(timeout);
			video.removeAttribute('src');
			video.load();
			URL.revokeObjectURL(url);
		}

		function grabFrame(): boolean {
			const width = video.videoWidth;
			const height = video.videoHeight;
			if (!width || !height) return false;
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) return false;
			ctx.drawImage(video, 0, 0, width, height);
			const duration = Number.isFinite(video.duration) ? Math.round(video.duration) : 0;
			canvas.toBlob(
				(blob) => {
					if (settled) return;
					settled = true;
					cleanup();
					if (!blob) return reject(new Error('Poster encoding failed'));
					resolve({ poster: blob, duration, width, height });
				},
				'image/jpeg',
				0.85
			);
			return true;
		}

		// Hard stop so a corrupt/unsupported file can never hang the upload UI.
		// Before giving up, try grabbing whatever frame is currently decoded —
		// and when metadata loaded but no frame ever decoded, the codec is the
		// culprit (typically HEVC/H.265 iPhone exports, which Chrome/Edge on
		// Windows can't decode — and neither could visitors' browsers).
		const timeout = setTimeout(() => {
			if (settled) return;
			if (metadataSeen && grabFrame()) return;
			fail(
				metadataSeen
					? 'Browser cannot decode this codec (HEVC/H.265?) — visitors could not play it either. Re-export as H.264 MP4.'
					: 'Poster capture timed out — the file may be unsupported or corrupt'
			);
		}, 20000);

		video.onerror = () =>
			fail('Browser could not decode this video — re-export as H.264 MP4 and try again');

		video.onloadedmetadata = () => {
			metadataSeen = true;
			// A frame at t=0 is often black; grab one slightly in, but stay within
			// very short clips.
			const t = Math.min(0.5, (video.duration || 1) / 10);
			video.currentTime = t;
		};

		video.onseeked = () => {
			if (!grabFrame()) fail('Video has no visual track');
		};
	});
}

export interface VideoMeta {
	gps: { lat: number; lng: number } | null;
	/** Capture date from the container's movie header (null when absent/bogus). */
	createdAt: Date | null;
}

/**
 * Best-effort metadata extraction from an MP4/MOV file — one pass over the bytes,
 * no dependencies (exifr, used server-side for photos, can't parse video containers).
 *
 * - GPS: phones write the capture location as an ISO 6709 string
 *   ("+53.9046+027.5615/") into the QuickTime `©xyz` user-data box.
 * - Capture date: the `mvhd` movie header stores creation time as seconds since
 *   1904-01-01 UTC (32- or 64-bit depending on box version).
 */
export async function extractVideoMeta(file: File): Promise<VideoMeta> {
	const meta: VideoMeta = { gps: null, createdAt: null };
	try {
		// NEVER read the whole file: a synchronous scan of a 100MB+ buffer blocks
		// the main thread for seconds (which starved the <video> events of the
		// poster capture and made it "time out"). The moov/udta metadata boxes sit
		// at the head (faststart exports) or the tail (straight camera files), so
		// scanning 8MB from each end covers both layouts in milliseconds.
		const SLICE = 8 * 1024 * 1024;
		let bytes: Uint8Array;
		if (file.size <= SLICE * 2) {
			bytes = new Uint8Array(await file.arrayBuffer());
		} else {
			const [head, tail] = await Promise.all([
				file.slice(0, SLICE).arrayBuffer(),
				file.slice(file.size - SLICE).arrayBuffer()
			]);
			bytes = new Uint8Array(head.byteLength + tail.byteLength);
			bytes.set(new Uint8Array(head), 0);
			bytes.set(new Uint8Array(tail), head.byteLength);
		}

		for (let i = 0; i < bytes.length - 4; i++) {
			// `©xyz` box: 0xA9 'x' 'y' 'z'
			if (
				meta.gps === null &&
				bytes[i] === 0xa9 &&
				bytes[i + 1] === 0x78 &&
				bytes[i + 2] === 0x79 &&
				bytes[i + 3] === 0x7a
			) {
				// After the name: 2-byte big-endian string length + 2-byte language code.
				const start = i + 4;
				if (start + 4 <= bytes.length) {
					const len = (bytes[start] << 8) | bytes[start + 1];
					const strStart = start + 4;
					if (len > 0 && len <= 64 && strStart + len <= bytes.length) {
						const text = new TextDecoder('ascii').decode(bytes.subarray(strStart, strStart + len));
						const match = text.match(/^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/);
						if (match) {
							const lat = Number(match[1]);
							const lng = Number(match[2]);
							if (
								Number.isFinite(lat) &&
								Number.isFinite(lng) &&
								Math.abs(lat) <= 90 &&
								Math.abs(lng) <= 180
							) {
								meta.gps = { lat, lng };
							}
						}
					}
				}
			}

			// `mvhd` movie header: 'm' 'v' 'h' 'd'
			if (
				meta.createdAt === null &&
				bytes[i] === 0x6d &&
				bytes[i + 1] === 0x76 &&
				bytes[i + 2] === 0x68 &&
				bytes[i + 3] === 0x64
			) {
				const version = bytes[i + 4];
				// version 0 → 32-bit creation_time right after version+flags;
				// version 1 → 64-bit (high word is 0 for any sane date).
				const t = i + 8;
				let seconds = 0;
				if (version === 0 && t + 4 <= bytes.length) {
					seconds = (bytes[t] * 0x1000000 + (bytes[t + 1] << 16) + (bytes[t + 2] << 8) + bytes[t + 3]) >>> 0;
				} else if (version === 1 && t + 8 <= bytes.length) {
					seconds =
						bytes[t + 4] * 0x1000000 + (bytes[t + 5] << 16) + (bytes[t + 6] << 8) + bytes[t + 7];
				}
				// QuickTime epoch → Unix epoch (2082844800s between 1904 and 1970).
				const ms = (seconds - 2082844800) * 1000;
				const d = new Date(ms);
				const year = d.getUTCFullYear();
				// Cameras with an unset clock write 0 (= 1904) — treat as absent.
				if (year >= 1990 && year <= 2100) meta.createdAt = d;
			}

			if (meta.gps !== null && meta.createdAt !== null) break;
		}
	} catch {
		/* unreadable file — return whatever was found */
	}
	return meta;
}
