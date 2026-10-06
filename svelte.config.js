import adapterVercel from '@sveltejs/adapter-vercel';
import adapterAuto from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

const dev = process.argv.includes('dev');
// Vercel sets VERCEL=1 only on its own build servers
const onVercel = !!process.env.VERCEL;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess(),

	kit: {
		// Vercel adapter only on Vercel, auto adapter locally (no symlinks, no EPERM on Windows)
		adapter: onVercel
			? adapterVercel({ runtime: 'nodejs24.x' })
			: adapterAuto(),
		env: {
			dir: '.',
		},
		paths: {
			base: dev ? '/Personal-Website' : '',
		},
		prerender: {
			entries: ['/','/login','/about','/contact','/works','/posts/[id]','/posts','/posts/[id]/edit','/profile','/profile/edit','/profile/edit/credentials','/profile/shoppingcart','/create','/shop','/photos-dashboard'],
		},
	}
};

export default config;

// import adapter from '@sveltejs/adapter-vercel';
// import sveltePreprocess from 'svelte-preprocess';

// const dev = process.argv.includes('dev');

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
// 	// for more information about preprocessors
// 	preprocess: sveltePreprocess(),

// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		//dsadsa
// 		adapter: adapter({
// 		runtime: "nodejs22.x"
// 		}),
// 		env:{
// 			dir:'.',
// 		},
// 		paths: {
// 			base: dev ? '/Personal-Website' : '',
// 		  },
// 		prerender: {
// 			entries: ['/','/login','/about','/contact','/works','/posts/[id]','/posts','/posts/[id]/edit','/profile','/profile/edit','/profile/edit/credentials','/profile/shoppingcart','/create','/shop','/photos-dashboard'],
// 		},
// 	}
// };

