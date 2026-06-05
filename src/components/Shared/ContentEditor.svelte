<script lang="ts">
	// Admin-only in-app translation editor. Edits the bilingual EN/RU dictionaries
	// (src/services/*.json) and commits them through the same git pipeline as photo
	// management (a normal push → Vercel rebuild). Two views: "This page" lists the
	// keys actually rendered on the current route (auto-detected via i18n-tracker);
	// "Global JSON" is a full CodeMirror code editor with search. Saving validates
	// JSON, commits both files, and previews the change instantly in-session via
	// addMessages. CodeMirror is imported lazily so it never enters the public bundle.
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
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

	let mode = $state<'page' | 'global'>('page');
	let lang = $state<Lang>('en');
	let filter = $state('');

	let cmHost = $state<HTMLDivElement>();
	let view: EditorView | null = null;
	let programmatic = false;
	let openSearch: ((v: EditorView) => void) | null = null;

	const dispatch = (val: boolean) => contentEditorOpen.set(val);

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

	// ── Page-key list ───────────────────────────────────────────────────────────
	const pageKeyList = $derived.by(() => {
		const keys = Array.from($pageKeys).filter((k) => k in enObj || k in ruObj);
		keys.sort((a, b) => a.localeCompare(b));
		const f = filter.trim().toLowerCase();
		if (!f) return keys;
		return keys.filter(
			(k) =>
				k.toLowerCase().includes(f) ||
				(enObj[k] ?? '').toLowerCase().includes(f) ||
				(ruObj[k] ?? '').toLowerCase().includes(f)
		);
	});

	// ── CodeMirror (lazy) ────────────────────────────────────────────────────────
	function currentText(): string {
		return JSON.stringify(lang === 'en' ? enObj : ruObj, null, 2);
	}

	function onCmChange(text: string) {
		try {
			const parsed = JSON.parse(text) as Dict;
			if (lang === 'en') enObj = parsed;
			else ruObj = parsed;
			jsonError = null;
		} catch (e) {
			jsonError = e instanceof Error ? e.message : 'Invalid JSON';
		}
	}

	async function ensureEditor() {
		if (view) return;
		const [{ EditorView: EV, basicSetup }, langJson, lint, search] = await Promise.all([
			import('codemirror'),
			import('@codemirror/lang-json'),
			import('@codemirror/lint'),
			import('@codemirror/search')
		]);
		openSearch = search.openSearchPanel;
		await tick();
		if (!cmHost) return;
		view = new EV({
			parent: cmHost,
			doc: currentText(),
			extensions: [
				basicSetup,
				langJson.json(),
				lint.linter(langJson.jsonParseLinter()),
				lint.lintGutter(),
				EV.lineWrapping,
				EV.updateListener.of((u) => {
					if (u.docChanged && !programmatic) onCmChange(u.state.doc.toString());
				}),
				EV.theme({
					'&': { height: '100%', fontSize: '13px' },
					'.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
				})
			]
		});
	}

	function setEditorDoc(text: string) {
		if (!view) return;
		programmatic = true;
		view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
		programmatic = false;
	}

	async function switchMode(m: 'page' | 'global') {
		if (jsonError) return;
		mode = m;
		if (m === 'global') {
			await ensureEditor();
			setEditorDoc(currentText());
		}
	}

	function switchLang(l: Lang) {
		if (jsonError || l === lang) return;
		lang = l;
		if (mode === 'global') setEditorDoc(currentText());
	}

	function triggerSearch() {
		if (view && openSearch) {
			view.focus();
			openSearch(view);
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
			// Local validation before the round-trip (server re-validates too).
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

			// Instant in-session preview (additions/edits; deletions apply on rebuild).
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
		dispatch(false);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	onMount(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		loadData();
		return () => {
			document.body.style.overflow = prev;
			view?.destroy();
			view = null;
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="ce-overlay" role="dialog" aria-modal="true" aria-label={$t('Edit content')}>
	<header class="ce-head">
		<div class="ce-title">{$t('Edit content')}</div>

		<div class="ce-tabs" role="tablist">
			<button
				class="ce-tab"
				class:active={mode === 'page'}
				role="tab"
				aria-selected={mode === 'page'}
				disabled={!!jsonError}
				onclick={() => switchMode('page')}>{$t('This page')}</button
			>
			<button
				class="ce-tab"
				class:active={mode === 'global'}
				role="tab"
				aria-selected={mode === 'global'}
				disabled={!!jsonError}
				onclick={() => switchMode('global')}>{$t('Global JSON')}</button
			>
		</div>

		<div class="ce-langs" role="group" aria-label="Language">
			<button class="ce-lang" class:active={lang === 'en'} disabled={!!jsonError} onclick={() => switchLang('en')}>{$t('English')}</button>
			<button class="ce-lang" class:active={lang === 'ru'} disabled={!!jsonError} onclick={() => switchLang('ru')}>{$t('Russian')}</button>
		</div>

		<div class="ce-actions">
			{#if mode === 'global'}
				<button class="ce-btn" onclick={triggerSearch} title="Ctrl+F">{$t('Search')}</button>
			{/if}
			<button class="ce-btn ce-save" onclick={save} disabled={saving || !!jsonError || loading}>
				{saving ? $t('Saving…') : $t('Save')}
			</button>
			<button class="ce-btn ce-close" onclick={close} aria-label={$t('Cancel')}>✕</button>
		</div>
	</header>

	{#if jsonError}
		<div class="ce-bar ce-bar-err">{$t('Invalid JSON')}: {jsonError}</div>
	{:else if statusMsg}
		<div class="ce-bar">{statusMsg}</div>
	{/if}

	<div class="ce-body">
		{#if loading}
			<div class="ce-msg">…</div>
		{:else if loadError}
			<div class="ce-msg ce-msg-err">{loadError}</div>
		{:else}
			<!-- Global view: real code editor. Kept mounted so the CM instance persists. -->
			<div class="ce-code" class:hidden={mode !== 'global'}>
				<div class="ce-cm" bind:this={cmHost}></div>
			</div>

			{#if mode === 'page'}
				<div class="ce-page">
					<input class="ce-filter" type="text" placeholder={$t('Search')} bind:value={filter} />
					{#if pageKeyList.length === 0}
						<div class="ce-msg">{$t('No translatable text on this page')}</div>
					{:else}
						<div class="ce-rows">
							{#each pageKeyList as key (key)}
								<div class="ce-row">
									<div class="ce-key" title={key}>{key}</div>
									<label class="ce-field">
										<span>EN</span>
										<textarea rows="2" bind:value={enObj[key]}></textarea>
									</label>
									<label class="ce-field">
										<span>RU</span>
										<textarea rows="2" bind:value={ruObj[key]}></textarea>
									</label>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.ce-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		background: #f7f6fb;
		color: #240b36;
		font-family:
			'anonymous', ui-sans-serif, system-ui, sans-serif;
	}

	.ce-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		background: #240b36;
		color: #fff;
		border-bottom: 3px solid transparent;
		border-image: linear-gradient(to right, #eab308, #ef4444, #ec4899) 1;
	}

	.ce-title {
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: linear-gradient(to right, #eab308, #ef4444, #ec4899);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.ce-tabs,
	.ce-langs,
	.ce-actions {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}
	.ce-actions {
		margin-left: auto;
	}

	.ce-tab,
	.ce-lang,
	.ce-btn {
		font: inherit;
		cursor: pointer;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: transparent;
		color: #fff;
		padding: 0.32rem 0.85rem;
		transition:
			background 160ms ease,
			color 160ms ease,
			opacity 160ms ease;
	}
	.ce-tab:hover,
	.ce-lang:hover,
	.ce-btn:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	.ce-tab.active,
	.ce-lang.active {
		background: #f6ae2d;
		color: #240b36;
		border-color: #f6ae2d;
	}
	.ce-tab:disabled,
	.ce-lang:disabled,
	.ce-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.ce-save {
		font-weight: 700;
		background: linear-gradient(to right, #eab308, #ef4444, #ec4899);
		border-color: transparent;
		color: #fff;
	}
	.ce-save:hover {
		filter: brightness(1.08);
		background: linear-gradient(to right, #eab308, #ef4444, #ec4899);
	}
	.ce-close {
		border-radius: 8px;
		padding: 0.32rem 0.6rem;
	}

	.ce-bar {
		padding: 0.4rem 1rem;
		font-size: 0.85rem;
		background: #e7e3f2;
		border-bottom: 1px solid #d8d2ea;
	}
	.ce-bar-err {
		background: #fdecec;
		color: #b3261e;
		border-bottom-color: #f3c2c0;
	}

	.ce-body {
		position: relative;
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
	}

	.ce-msg {
		margin: auto;
		padding: 2rem;
		opacity: 0.7;
	}
	.ce-msg-err {
		color: #b3261e;
		opacity: 1;
	}

	.ce-code {
		position: absolute;
		inset: 0;
		display: flex;
	}
	.ce-code.hidden {
		visibility: hidden;
		pointer-events: none;
	}
	.ce-cm {
		flex: 1 1 auto;
		min-height: 0;
		overflow: hidden;
		background: #fff;
	}

	.ce-page {
		position: relative;
		z-index: 1;
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: #f7f6fb;
	}

	.ce-filter {
		margin: 0.75rem 1rem;
		padding: 0.5rem 0.8rem;
		border: 1px solid #cfc8e4;
		border-radius: 8px;
		font: inherit;
		background: #fff;
	}
	.ce-filter:focus {
		outline: 2px solid #f6ae2d;
		outline-offset: 1px;
	}

	.ce-rows {
		flex: 1 1 auto;
		overflow-y: auto;
		padding: 0 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.ce-row {
		display: grid;
		grid-template-columns: minmax(160px, 1fr) 2fr 2fr;
		gap: 0.75rem;
		align-items: start;
		background: #fff;
		border: 1px solid #e4dff2;
		border-radius: 10px;
		padding: 0.7rem 0.85rem;
	}
	.ce-key {
		font-size: 0.78rem;
		font-family: ui-monospace, Menlo, monospace;
		color: #5b4b78;
		word-break: break-word;
		padding-top: 0.3rem;
	}
	.ce-field {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.72rem;
		color: #7a6f95;
	}
	.ce-field textarea {
		font: inherit;
		font-size: 0.9rem;
		color: #240b36;
		border: 1px solid #cfc8e4;
		border-radius: 6px;
		padding: 0.4rem 0.5rem;
		resize: vertical;
		min-height: 2.4rem;
	}
	.ce-field textarea:focus {
		outline: 2px solid #f6ae2d;
		outline-offset: 1px;
		border-color: transparent;
	}

	@media (max-width: 768px) {
		.ce-row {
			grid-template-columns: 1fr;
		}
		.ce-head {
			gap: 0.5rem;
		}
		.ce-title {
			width: 100%;
		}
	}
</style>
