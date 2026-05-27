import { env } from '$env/dynamic/private';

const BASE = 'https://api.github.com';
const DEFAULT_BRANCH = 'main';

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

function repoApiUrl(path: string): string {
	const owner = env.SECRET_GITHUB_OWNER;
	const repo = env.SECRET_GITHUB_REPO;
	return `${BASE}/repos/${owner}/${repo}/${path}`;
}

function branchName(): string {
	return env.SECRET_GITHUB_BRANCH || DEFAULT_BRANCH;
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

export async function ghGetBase64(path: string): Promise<{ content: string; sha: string }> {
	const res = await fetch(repoUrl(path), { headers: headers() });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub GET ${path} failed (${res.status}): ${text}`);
	}
	const data = await res.json();
	return { content: String(data.content ?? '').replace(/\s/g, ''), sha: data.sha };
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

export async function ghCreateBlob(content: string, encoding: 'base64' | 'utf-8' = 'base64') {
	const res = await fetch(repoApiUrl('git/blobs'), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ content, encoding })
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub create blob failed (${res.status}): ${text}`);
	}
	const data = await res.json();
	return data.sha as string;
}

async function ghGetBranchHead() {
	const branch = branchName();
	const res = await fetch(repoApiUrl(`git/ref/heads/${branch}`), { headers: headers() });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub get branch ${branch} failed (${res.status}): ${text}`);
	}
	const ref = await res.json();
	const commitSha = ref.object.sha as string;

	const commitRes = await fetch(repoApiUrl(`git/commits/${commitSha}`), { headers: headers() });
	if (!commitRes.ok) {
		const text = await commitRes.text();
		throw new Error(`GitHub get commit ${commitSha} failed (${commitRes.status}): ${text}`);
	}
	const commit = await commitRes.json();
	return {
		branch,
		commitSha,
		treeSha: commit.tree.sha as string
	};
}

export interface GhTreeFile {
	path: string;
	sha?: string;
	contentBase64?: string;
}

export async function ghCommitFiles(files: GhTreeFile[], message: string): Promise<void> {
	const head = await ghGetBranchHead();
	const tree = [];

	for (const file of files) {
		const sha = file.sha ?? (await ghCreateBlob(file.contentBase64 ?? '', 'base64'));
		tree.push({
			path: file.path,
			mode: '100644',
			type: 'blob',
			sha
		});
	}

	const treeRes = await fetch(repoApiUrl('git/trees'), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({
			base_tree: head.treeSha,
			tree
		})
	});
	if (!treeRes.ok) {
		const text = await treeRes.text();
		throw new Error(`GitHub create tree failed (${treeRes.status}): ${text}`);
	}
	const createdTree = await treeRes.json();

	const commitRes = await fetch(repoApiUrl('git/commits'), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({
			message,
			tree: createdTree.sha,
			parents: [head.commitSha]
		})
	});
	if (!commitRes.ok) {
		const text = await commitRes.text();
		throw new Error(`GitHub create commit failed (${commitRes.status}): ${text}`);
	}
	const createdCommit = await commitRes.json();

	const refRes = await fetch(repoApiUrl(`git/refs/heads/${head.branch}`), {
		method: 'PATCH',
		headers: headers(),
		body: JSON.stringify({
			sha: createdCommit.sha,
			force: false
		})
	});
	if (!refRes.ok) {
		const text = await refRes.text();
		throw new Error(`GitHub update ref failed (${refRes.status}): ${text}`);
	}
}
