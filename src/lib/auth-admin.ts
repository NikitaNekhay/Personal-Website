import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const ADMIN_EMAILS = ['ktofreesapiens@gmail.com', 'vaper20041337@gmail.com'];

export function forbidden(message = 'Forbidden'): Response {
	return new Response(JSON.stringify({ error: message }), {
		status: 403,
		headers: { 'Content-Type': 'application/json' }
	});
}

export function unauthorized(message = 'Unauthorized'): Response {
	return new Response(JSON.stringify({ error: message }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function requireAdmin(request: Request): Promise<Response | null> {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return unauthorized('Missing or invalid Authorization header');
	}

	const idToken = authHeader.slice(7);
	const apiKey = publicEnv.PUBLIC_FIREBASE_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'Server configuration error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const res = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken })
			}
		);

		if (!res.ok) {
			return unauthorized('Invalid token');
		}

		const data = await res.json();
		const email = data.users?.[0]?.email as string | undefined;
		if (!email || !ADMIN_EMAILS.includes(email)) {
			return forbidden('Admin access required');
		}

		return null;
	} catch {
		return unauthorized('Token verification failed');
	}
}
