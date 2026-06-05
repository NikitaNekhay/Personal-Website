<script lang="ts">
	// Admin-only translation editor — a GitHub-style code drawer that slides in from
	// the LEFT and shows the bare EN/RU JSON dictionaries in CodeMirror (one-dark).
	// Two views, both raw JSON (no input fields):
	//   • "This page" — the file filtered to just the keys rendered on the current
	//     route (auto-detected via i18n-tracker). Editing it patches those keys back.
	//   • "Global JSON" — the whole file.
	// Saving validates JSON, commits en.json + ru.json through the git pipeline (a
	// normal push → Vercel rebuild), and previews instantly in-session via addMessages.
	// CodeMirror is imported lazily so it never enters the public bundle.
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { addMessages, locale, t } from 'svelte-i18n';
	import { auth } from '$lib/firebase/firebase';
	import { contentEditorOpen } from '../../store/contentEditor';
	import { pageKeys } from '$lib/i18n-tracker';
	import type { EditorView } from '@codemirror/view';

	type Lang = 'en' | 'ru';
	type Dict = Record<string, string>;

	let loading = $state(true);
	let loadError = $state<string | null>(null);
	let saving = $state(false);
	let statusMsg = $state<string | null>(null);
	let jsonError = $state<string | null>(null);

	let enObj = $state<Dict>({});
	let ruObj = $state<Dict>({});

	let view = $state<'page' | 'global'>('page');
	let lang = $state<Lang>('ru');

	let cmHost = $state<HTMLDivElement>();
	let editor: EditorView | null = null;
	let programmatic = false;
	let openSearch: ((v: EditorView) => void) | null = null;

	const curObj = () => (lang === 'en' ? enObj : ruObj);
	const pageKeyCount = $derived(
		Array.from($pageKeys).filter((k) => k in enObj || k in ruObj).length
	);

	// ── Auth + data ───────────────────────────────────────────────────────────
	async function getAuthHeaders(): Promise<HeadersInit> {
		const token = await auth.currentUser?.getIdToken();
		if (!token) throw new Error('Not authenticated');
		return { Authorization: `Bearer ${token}` };
	}

	async function loadData() {
		loading = true;
		loadError = null;
		try {
			const headers = await getAuthHeaders();
			const res = await fetch('/api/i18n', { headers });
			if (!res.ok) throw new Error(`Failed to load (${res.status})`);
			const data = await res.json();
			enObj = JSON.parse(data.en);
			ruObj = JSON.parse(data.ru);
		} catch (e) {
			loadError = e instanceof Error ? e.message : 'Failed to load translations';
		} finally {
			loading = false;
		}
	}

	// ── Document <-> canonical model ────────────────────────────────────────────
	function pick(obj: Dict, keys: string[]): Dict {
		const out: Dict = {};
		for (const k of keys) if (k in obj) out[k] = obj[k];
		return out;
	}

	function docFor(): string {
		const obj = curObj();
		if (view === 'global') return JSON.stringify(obj, null, 2);
		const keys = Array.from(get(pageKeys))
			.filter((k) => k in obj)
			.sort((a, b) => a.localeCompare(b));
		return JSON.stringify(pick(obj, keys), null, 2);
	}

	function onCmChange(text: string) {
		try {
			const parsed = JSON.parse(text) as Dict;
			if (view === 'global') {
				if (lang === 'en') enObj = parsed;
				else ruObj = parsed;
			} else {
				// "This page" is a filtered patch: merge edited keys back, never drop others.
				if (lang === 'en') enObj = { ...enObj, ...parsed };
				else ruObj = { ...ruObj, ...parsed };
			}
			jsonError = null;
		} catch (e) {
			jsonError = e instanceof Error ? e.message : 'Invalid JSON';
		}
	}

	async function ensureEditor() {
		if (editor || !cmHost) return;
		const [{ EditorView: EV, basicSetup }, langJson, lint, search, themeMod] = await Promise.all([
			import('codemirror'),
			import('@codemirror/lang-json'),
			import('@codemirror/lint'),
			import('@codemirror/search'),
			import('@codemirror/theme-one-dark')
		]);
		openSearch = search.openSearchPanel;
		await tick();
		if (!cmHost) return;
		editor = new EV({
			parent: cmHost,
			doc: docFor(),
			extensions: [
				basicSetup,
				langJson.json(),
				lint.linter(langJson.jsonParseLinter()),
				lint.lintGutter(),
				themeMod.oneDark,
				EV.lineWrapping,
				EV.updateListener.of((u) => {
					if (u.docChanged && !programmatic) onCmChange(u.state.doc.toString());
				}),
				EV.theme({ '&': { height: '100%' }, '.cm-scroller': { fontSize: '13px' } })
			]
		});
	}

	function refreshDoc() {
		if (!editor) return;
		jsonError = null;
		programmatic = true;
		editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: docFor() } });
		programmatic = false;
	}

	function switchView(v: 'page' | 'global') {
		if (v === view) return;
		view = v;
		refreshDoc();
	}
	function switchLang(l: Lang) {
		if (l === lang) return;
		lang = l;
		refreshDoc();
	}
	function triggerSearch() {
		if (editor && openSearch) {
			editor.focus();
			openSearch(editor);
		}
	}

	// ── Save ───────────────────────────────────────────────────────────────────
	async function save() {
		if (saving || jsonError) return;
		saving = true;
		statusMsg = null;
		try {
			const enStr = JSON.stringify(enObj, null, 2);
			const ruStr = JSON.stringify(ruObj, null, 2);
			JSON.parse(enStr);
			JSON.parse(ruStr);

			const res = await fetch('/api/i18n', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
				body: JSON.stringify({ en: enStr, ru: ruStr })
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || `Save failed (${res.status})`);
			}

			// Instant in-session preview (edits/additions; deletions apply after rebuild).
			addMessages('en', enObj);
			addMessages('ru', ruObj);
			locale.set(get(locale) as string);
			statusMsg = `${get(t)('Saved')} — redeploying`;
		} catch (e) {
			statusMsg = e instanceof Error ? e.message : 'Save failed';
		} finally {
			saving = false;
		}
	}

	function close() {
		contentEditorOpen.set(false);
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	onMount(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		(async () => {
			await loadData();
			if (!loadError) await ensureEditor();
		})();
		return () => {
			document.body.style.overflow = prev;
			editor?.destroy();
			editor = null;
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="ce-backdrop" transition:fade={{ duration: 180 }} onclick={close} role="presentation"></div>

<div
	class="ce-drawer"
	transition:fly={{ x: -540, duration: 280, easing: cubicOut }}
	role="dialog"
	aria-modal="true"
	aria-label={$t('Edit content')}
>
	<header class="ce-head">
		<span class="ce-title">{$t('Edit content')}</span>

		<div class="ce-seg" role="tablist">
			<button class="ce-seg-btn" class:active={view === 'page'} role="tab" aria-selected={view === 'page'} onclick={() => switchView('page')}>
				{$t('This page')}{#if view === 'page'} · {pageKeyCount}{/if}
			</button>
			<button class="ce-seg-btn" class:active={view === 'global'} role="tab" aria-selected={view === 'global'} onclick={() => switchView('global')}>
				{$t('Global JSON')}
			</button>
		</div>

		<div class="ce-seg" role="group" aria-label="Language">
			<button class="ce-seg-btn" class:active={lang === 'en'} onclick={() => switchLang('en')}>EN</button>
			<button class="ce-seg-btn" class:active={lang === 'ru'} onclick={() => switchLang('ru')}>RU</button>
		</div>

		<div class="ce-actions">
			<button class="ce-btn" onclick={triggerSearch} title="Ctrl+F" aria-label={$t('Search')}>⌕</button>
			<button class="ce-btn ce-save" onclick={save} disabled={saving || !!jsonError || loading}>
				{saving ? $t('Saving…') : $t('Save')}
			</button>
			<button class="ce-btn ce-close" onclick={close} aria-label={$t('Cancel')}>✕</button>
		</div>
	</header>

	{#if jsonError}
		<div class="ce-status ce-status-err">{$t('Invalid JSON')}: {jsonError}</div>
	{:else if statusMsg}
		<div class="ce-status">{statusMsg}</div>
	{:else if view === 'page' && pageKeyCount === 0 && !loading && !loadError}
		<div class="ce-status">{$t('No translatable text on this page')}</div>
	{/if}

	<div class="ce-body">
		<div class="ce-cm" bind:this={cmHost}></div>
		{#if loading}
			<div class="ce-overlay-msg">…</div>
		{:else if loadError}
			<div class="ce-overlay-msg ce-overlay-err">{loadError}</div>
		{/if}
	</div>
</div>

<style>
	.ce-backdrop {
		position: fixed;
		inset: 0;
		z-index: 9998;
		background: rgba(1, 4, 9, 0.55);
	}

	.ce-drawer {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 9999;
		width: min(760px, 100vw);
		display: flex;
		flex-direction: column;
		background: #0d1117; /* GitHub dark canvas */
		color: #c9d1d9;
		border-right: 1px solid #30363d;
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
		font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}

	/* ── Header bar (GitHub-style, no gradient) ── */
	.ce-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.75rem;
		background: #161b22;
		border-bottom: 1px solid #30363d;
	}
	.ce-title {
		font-weight: 600;
		font-size: 0.9rem;
		color: #e6edf3;
		margin-right: 0.25rem;
	}

	.ce-seg {
		display: inline-flex;
		border: 1px solid #30363d;
		border-radius: 6px;
		overflow: hidden;
		background: #0d1117;
	}
	.ce-seg-btn {
		font: inherit;
		font-size: 0.8rem;
		color: #c9d1d9;
		background: transparent;
		border: none;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.ce-seg-btn + .ce-seg-btn {
		border-left: 1px solid #30363d;
	}
	.ce-seg-btn:hover {
		background: #21262d;
	}
	.ce-seg-btn.active {
		background: #1f6feb;
		color: #fff;
	}

	.ce-actions {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
		margin-left: auto;
	}
	.ce-btn {
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
		border-radius: 6px;
		border: 1px solid #30363d;
		background: #21262d;
		color: #c9d1d9;
		padding: 0.3rem 0.7rem;
		line-height: 1.2;
	}
	.ce-btn:hover {
		background: #30363d;
	}
	.ce-save {
		font-weight: 600;
		background: #238636; /* GitHub green */
		border-color: rgba(240, 246, 252, 0.1);
		color: #fff;
	}
	.ce-save:hover {
		background: #2ea043;
	}
	.ce-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ce-status {
		padding: 0.4rem 0.85rem;
		font-size: 0.8rem;
		background: #161b22;
		border-bottom: 1px solid #30363d;
		color: #8b949e;
	}
	.ce-status-err {
		color: #ffa198;
		background: #2d1416;
		border-bottom-color: #5c2b29;
	}

	.ce-body {
		position: relative;
		flex: 1 1 auto;
		min-height: 0;
	}
	.ce-cm {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.ce-cm :global(.cm-editor) {
		height: 100%;
	}

	.ce-overlay-msg {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0d1117;
		color: #8b949e;
		font-size: 1.5rem;
	}
	.ce-overlay-err {
		font-size: 0.95rem;
		color: #ffa198;
		padding: 1rem;
		text-align: center;
	}
</style>
