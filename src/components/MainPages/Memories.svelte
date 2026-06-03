<script lang="ts">
	/**
	 * Admin-only "Memories" map: every geotagged photo as a clustered thumbnail pin
	 * on an OpenStreetMap (Leaflet) map, à la the iOS Photos map view. Geo data comes
	 * from the admin-guarded /api/photos/geo endpoint and is never part of the public
	 * manifest. Leaflet touches `window`, so it is imported dynamically in onMount.
	 */
	import { onMount, tick } from 'svelte';
	import { base } from '$app/paths';
	import { t } from 'svelte-i18n';
	import { auth } from '$lib/firebase/firebase';
	import { getFlagUrl, formatTakenDate, placeLabel, formatCoords } from '$lib/geo-display';
	import type { PhotoGeoEntry, PhotoManifestEntry } from '../../shared/types';

	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

	interface MemoryItem {
		slug: string;
		title: string;
		thumbUrl: string;
		lat: number;
		lng: number;
		dateLabel: string | null;
		place: string | null;
		coords: string;
		countryCode: string | null;
	}

	let loading = $state(true);
	let errorMsg = $state<string | null>(null);
	let items = $state<MemoryItem[]>([]);
	let mapEl: HTMLDivElement | undefined = $state();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let map: any = null;

	function imgUrl(path: string): string {
		return `${base}/api/photos/image/${path.replace(/^\/?photos\//, '')}`;
	}

	function esc(value: string): string {
		return value.replace(/[&<>"']/g, (c) =>
			c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;'
		);
	}

	function popupHtml(it: MemoryItem): string {
		const flag = it.countryCode
			? `<img class="mem-popup-flag" src="${getFlagUrl(it.countryCode)}" alt="" />`
			: '';
		const lines: string[] = [];
		if (it.dateLabel) lines.push(`<div class="mem-popup-date">${esc(it.dateLabel)}</div>`);
		if (it.place) lines.push(`<div class="mem-popup-place">${flag}${esc(it.place)}</div>`);
		lines.push(`<div class="mem-popup-coords">${esc(it.coords)}</div>`);
		return `
			<div class="mem-popup">
				<img class="mem-popup-thumb" src="${it.thumbUrl}" alt="${esc(it.title)}" />
				<div class="mem-popup-title">${esc(it.title)}</div>
				${lines.join('')}
			</div>`;
	}

	async function loadData(token: string) {
		try {
			const [geoRes, manRes] = await Promise.all([
				fetch(`${base}/api/photos/geo`, { headers: { Authorization: `Bearer ${token}` } }),
				fetch(`${base}/api/photos/manifest`)
			]);
			if (!geoRes.ok) throw new Error('Failed to load geo data');
			if (!manRes.ok) throw new Error('Failed to load manifest');

			const geo = (await geoRes.json()) as Record<string, PhotoGeoEntry>;
			const manifest = (await manRes.json()) as PhotoManifestEntry[];
			const bySlug = new Map(manifest.map((p) => [p.slug, p]));

			items = Object.values(geo)
				.map((g): MemoryItem | null => {
					const photo = bySlug.get(g.slug);
					if (!photo) return null;
					return {
						slug: g.slug,
						title: photo.title,
						thumbUrl: imgUrl(photo.thumb),
						lat: g.lat,
						lng: g.lng,
						dateLabel: formatTakenDate(g.dateTaken),
						place: placeLabel(g),
						coords: formatCoords(g.lat, g.lng),
						countryCode: g.countryCode
					};
				})
				.filter((x): x is MemoryItem => x !== null);

			loading = false;
			await tick();
			if (items.length > 0) await initMap();
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Failed to load memories';
			loading = false;
		}
	}

	async function initMap() {
		if (!mapEl || map) return;
		const leaflet = await import('leaflet');
		// `await import('leaflet')` yields an ES module namespace, which is SEALED —
		// leaflet.markercluster can't attach `MarkerClusterGroup` to it ("Object is not
		// extensible"). Use the real Leaflet object (`.default`, exposed by Vite); fall
		// back to a shallow extensible copy if only the namespace is available.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const base: any = (leaflet as any).default ?? leaflet;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const L: any = Object.isExtensible(base) ? base : { ...base };
		// The plugin augments the global `L` when present — point it at our extensible one.
		(window as any).L = L;
		await import('leaflet.markercluster');

		map = L.map(mapEl, { worldCopyJump: true }).setView([20, 0], 2);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		const cluster = L.markerClusterGroup({ showCoverageOnHover: false });
		for (const it of items) {
			const icon = L.divIcon({
				className: 'memory-pin',
				html: `<span class="memory-pin-inner"><img src="${it.thumbUrl}" alt="" /></span>`,
				iconSize: [48, 48],
				iconAnchor: [24, 24],
				popupAnchor: [0, -22]
			});
			const marker = L.marker([it.lat, it.lng], { icon, title: it.title });
			marker.bindPopup(popupHtml(it), { minWidth: 180 });
			cluster.addLayer(marker);
		}
		map.addLayer(cluster);

		const bounds = cluster.getBounds();
		if (bounds.isValid()) map.fitBounds(bounds.pad(0.25), { maxZoom: 12 });
	}

	onMount(() => {
		const unsub = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				// Not signed in: the layout guard (AdminRoutes) redirects away.
				loading = false;
				return;
			}
			try {
				const token = await user.getIdToken();
				await loadData(token);
			} catch {
				errorMsg = 'Not authorized';
				loading = false;
			}
		});
		return () => {
			unsub();
			if (map) {
				map.remove();
				map = null;
			}
		};
	});
</script>

<svelte:head>
	<title>{$t('Memories')}</title>
</svelte:head>

<section class="memories">
	<h1 class="memories-title">{$t('Memories')}</h1>

	{#if loading}
		<p class="memories-note">Loading map…</p>
	{:else if errorMsg}
		<p class="memories-note error">{errorMsg}</p>
	{:else if items.length === 0}
		<p class="memories-note">
			No geotagged photos yet. Upload photos that still carry their GPS EXIF and they will
			appear here on the map.
		</p>
	{:else}
		<p class="memories-note">{items.length} place{items.length === 1 ? '' : 's'} on the map.</p>
		<div class="memories-map" bind:this={mapEl}></div>
	{/if}
</section>

<style>
	.memories {
		max-width: 1100px;
		margin: 0 auto;
		padding: 6rem 1rem 3rem;
	}

	.memories-title {
		font-size: 1.6rem;
		font-weight: 700;
		color: #241e4e;
		margin-bottom: 0.5rem;
	}

	.memories-note {
		font-size: 0.95rem;
		color: #555;
		margin-bottom: 1rem;
	}

	.memories-note.error {
		color: #c53030;
	}

	.memories-map {
		width: 100%;
		height: 70vh;
		min-height: 420px;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(36, 30, 78, 0.12);
		z-index: 0; /* keep tiles/controls below the site header */
	}

	/* Thumbnail pin */
	:global(.memory-pin .memory-pin-inner) {
		display: block;
		width: 48px;
		height: 48px;
		border-radius: 10px;
		overflow: hidden;
		border: 2px solid #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
		background: #ddd;
	}

	:global(.memory-pin .memory-pin-inner img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	:global(.mem-popup) {
		width: 180px;
		font-family: inherit;
	}

	:global(.mem-popup-thumb) {
		width: 100%;
		height: 120px;
		object-fit: cover;
		border-radius: 6px;
		display: block;
		margin-bottom: 0.4rem;
	}

	:global(.mem-popup-title) {
		font-weight: 700;
		color: #241e4e;
		margin-bottom: 0.2rem;
	}

	:global(.mem-popup-date),
	:global(.mem-popup-place),
	:global(.mem-popup-coords) {
		font-size: 0.8rem;
		color: #555;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	:global(.mem-popup-coords) {
		font-family: monospace;
		color: #888;
	}

	:global(.mem-popup-flag) {
		width: 18px;
		height: auto;
		border-radius: 2px;
	}
</style>
