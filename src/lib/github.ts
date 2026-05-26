import { env } from '$env/dynamic/private';

const BASE = 'https://api.github.com';

const headers = () => ({
	Authorization: `Bearer ${env.SECRET_GITHUB_TOKEN}`,
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
	'Content-Type': 'application/json'
});

function repoUrl(path: string): string {
	const owner = env.SECRET_GITHUB_OWNER;
	const repo = env.SECRET_GITHUB_REPO;
	return `${BASE}/repos/${owner}/${repo}/contents/${path}`;
}

export async function ghGet(path: string): Promise<{ content: string; sha: string }> {
	const res = await fetch(repoUrl(path), { headers: headers() });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub GET ${path} failed (${res.status}): ${text}`);
	}
	const data = await res.json();
	const content = Buffer.from(data.content, 'base64').toString('utf-8');
	return { content, sha: data.sha };
}

export async function ghPut(
	path: string,
	content: string,
	message: string,
	sha?: string
): Promise<void> {
	const body: Record<string, string> = {
		message,
		content
	};
	if (sha) body.sha = sha;

	const res = await fetch(repoUrl(path), {
		method: 'PUT',
		headers: headers(),
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub PUT ${path} failed (${res.status}): ${text}`);
	}
}

export async function ghDelete(path: string, message: string, sha: string): Promise<void> {
	const res = await fetch(repoUrl(path), {
		method: 'DELETE',
		headers: headers(),
		body: JSON.stringify({ message, sha })
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub DELETE ${path} failed (${res.status}): ${text}`);
	}
}

export async function ghGetOptional(path: string): Promise<{ content: string; sha: string } | null> {
	const res = await fetch(repoUrl(path), { headers: headers() });
	if (res.status === 404) return null;
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub GET ${path} failed (${res.status}): ${text}`);
	}
	const data = await res.json();
	const content = Buffer.from(data.content, 'base64').toString('utf-8');
	return { content, sha: data.sha };
}
