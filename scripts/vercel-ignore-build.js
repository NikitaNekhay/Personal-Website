import { execSync } from 'node:child_process';

const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '';

function shouldIgnorePhotoCommit() {
	if (commitMessage.includes('[photos skip deploy]')) return true;

	try {
		const changed = execSync('git diff --name-only HEAD^ HEAD', {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore']
		})
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		return (
			changed.length > 0 &&
			changed.every((path) => path === 'static/photos/manifest.json' || path.startsWith('static/photos/'))
		);
	} catch {
		return false;
	}
}

if (shouldIgnorePhotoCommit()) {
	console.log('Skipping Vercel build for photo-only GitHub CMS commit.');
	process.exit(0);
}

console.log('Running Vercel build.');
process.exit(1);
