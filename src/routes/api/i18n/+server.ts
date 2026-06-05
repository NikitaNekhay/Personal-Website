import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth-admin';
import { ghGet, ghCommitFiles, type GhTreeFile } from '$lib/github';
import type { RequestHandler } from './$types';

const EN_PATH = 'src/services/en.json';
const RU_PATH = 'src/services/ru.json';

/**
 * GET — admin only. Returns the raw EN/RU dictionary text read fresh from the
 * repo (the latest source of truth, independent of the possibly-stale bundle).
 */
export const GET: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const [en, ru] = await Promise.all([ghGet(EN_PATH), ghGet(RU_PATH)]);
		return json({ en: en.content, ru: ru.content });
	} catch (error) {
		console.error('Load i18n failed:', error);
		return json({ error: 'Failed to load translations' }, { status: 500 });
	}
};

/**
 * PUT — admin only. Validates both payloads parse as JSON (never commit broken
 * dictionaries), then commits en.json + ru.json atomically. The commit message
 * deliberately omits the "[photos skip deploy]" token so the push triggers a
 * normal Vercel rebuild and the new copy ships to everyone.
 */
export const PUT: RequestHandler = async ({ request }) => {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();
		const enText = body?.en;
		const ruText = body?.ru;

		if (typeof enText !== 'string' || typeof ruText !== 'string') {
			return json({ error: 'Both "en" and "ru" must be strings' }, { status: 400 });
		}

		// Fallback/safety: never commit invalid JSON.
		try {
			JSON.parse(enText);
		} catch (e) {
			return json(
				{ error: `Invalid EN JSON: ${e instanceof Error ? e.message : String(e)}` },
				{ status: 400 }
			);
		}
		try {
			JSON.parse(ruText);
		} catch (e) {
			return json(
				{ error: `Invalid RU JSON: ${e instanceof Error ? e.message : String(e)}` },
				{ status: 400 }
			);
		}

		const requested = typeof body?.message === 'string' ? body.message.trim() : '';
		// Strip any skip-deploy token so a translation save always redeploys.
		const message =
			(requested || 'i18n: update translations via in-app editor').replace(
				/\[photos skip deploy\]/g,
				''
			) || 'i18n: update translations via in-app editor';

		const files: GhTreeFile[] = [
			{ path: EN_PATH, contentBase64: Buffer.from(enText, 'utf-8').toString('base64') },
			{ path: RU_PATH, contentBase64: Buffer.from(ruText, 'utf-8').toString('base64') }
		];

		await ghCommitFiles(files, message);
		return json({ ok: true });
	} catch (error) {
		console.error('Save i18n failed:', error);
		return json({ error: 'Save failed' }, { status: 500 });
	}
};
