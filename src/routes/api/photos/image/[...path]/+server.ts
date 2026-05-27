import { error } from '@sveltejs/kit';
import { ghGetBase64 } from '$lib/github';
import type { RequestHandler } from './$types';

const SAFE_PHOTO_PATH_RE = /^(originals|thumbs)\/[a-z0-9-]+\.webp$/;

export const GET: RequestHandler = async ({ params }) => {
	const photoPath = params.path;
	if (!SAFE_PHOTO_PATH_RE.test(photoPath)) {
		throw error(404, 'Photo not found');
	}

	try {
		const { content } = await ghGetBase64(`static/photos/${photoPath}`);
		const body = Buffer.from(content, 'base64');

		return new Response(body, {
			headers: {
				'Content-Type': 'image/webp',
				'Cache-Control': 'public, max-age=0, s-maxage=31536000, immutable'
			}
		});
	} catch (e) {
		console.error(`Failed to load photo image ${photoPath}:`, e);
		throw error(404, 'Photo not found');
	}
};
