import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { t } from 'svelte-i18n';

/**
 * i18n message ids that have been resolved via `$t(...)` since the last reset —
 * i.e. the keys actually rendered on the current page. The admin in-app content
 * editor reads this to populate its "This page" tab.
 *
 * Best-effort by design: the editor's "Global JSON" + search tab is the reliable
 * fallback for any key this tracker happens to miss.
 */
export const pageKeys = writable<Set<string>>(new Set());

let collected = new Set<string>();
let flushScheduled = false;

/** Record a single resolved key, batching store writes to one per microtask. */
export function recordKey(id: unknown): void {
	if (!browser) return;
	if (typeof id !== 'string' || id.length === 0) return;
	if (collected.has(id)) return;
	collected.add(id);
	if (!flushScheduled) {
		flushScheduled = true;
		queueMicrotask(() => {
			flushScheduled = false;
			pageKeys.set(new Set(collected));
		});
	}
}

/** Clear collected keys — call on route change so each page starts fresh. */
export function resetPageKeys(): void {
	collected = new Set();
	pageKeys.set(new Set());
}

// ── Hook svelte-i18n's `t` store ──────────────────────────────────────────────
// `t` (alias `_`/`format`) is a derived store whose value is the formatter
// function `(id, options) => string`. We wrap the emitted formatter so every
// lookup records its id, then delegates unchanged. Patched at module evaluation
// (browser only) — before any component subscribes to `$t`, and without touching
// the project's ~400 `$t(...)` call sites or aliasing the package.
if (browser) {
	const store = t as unknown as {
		subscribe: (run: (value: unknown) => void, invalidate?: unknown) => () => void;
	};
	const originalSubscribe = store.subscribe.bind(store);

	store.subscribe = ((run: (value: unknown) => void, invalidate?: unknown) =>
		originalSubscribe((formatter: unknown) => {
			if (typeof formatter === 'function') {
				const fn = formatter as (...args: unknown[]) => unknown;
				const wrapped = (idOrOptions: unknown, options?: unknown) => {
					const id =
						typeof idOrOptions === 'string'
							? idOrOptions
							: (idOrOptions as { id?: string } | null)?.id;
					recordKey(id);
					return fn(idOrOptions, options);
				};
				// Preserve helper props svelte-i18n attaches to the formatter.
				Object.assign(wrapped, fn);
				run(wrapped);
			} else {
				run(formatter);
			}
		}, invalidate)) as typeof store.subscribe;
}
