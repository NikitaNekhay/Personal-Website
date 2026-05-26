<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { t } from 'svelte-i18n';
	import PhotoSlider from '../components/MainPages/PhotoSlider.svelte';
	import PhotoCollectionFilter from '../components/MainPages/PhotoCollectionFilter.svelte';
	import type { PhotoManifestEntry } from '../shared/types';

	let photos = $state<PhotoManifestEntry[]>([]);
	let selectedYear = $state<number | null>(null);
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	const filteredPhotos = $derived(
		selectedYear === null
			? photos
			: photos.filter((p) => p.collectionNumber === selectedYear)
	);

	const sliderKey = $derived(
		`${selectedYear ?? 'all'}-${filteredPhotos.map((p) => p.slug).join(',')}`
	);

	onMount(async () => {
		try {
			const res = await fetch(`${base}/api/photos/manifest`);
			if (!res.ok) throw new Error('Failed to load photos');
			photos = await res.json();
		} catch (e) {
			loadError = e instanceof Error ? e.message : 'Failed to load photos';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{$t('NEKHAY NIKITA - DESIGNER - SHOP - PHOTOGRAPHY PORTFOLIO')}</title>
	<meta
		name="description"
		content={$t(
			"Internet shop of clothes designer NEKHAY NIKITA. Home page represents NIKITA'S photo portfolio. Take a look at last collection, shop. Get to know NIKITA entering about and contact pages."
		)}
	/>

	<meta property="og:title" content={$t('NEKHAY NIKITA - DESIGNER - SHOP - PHOTOGRAPHY PORTFOLIO')} />
	<meta
		property="og:description"
		content={$t(
			"Internet shop of clothes designer NEKHAY NIKITA. Home page represents NIKITA'S photo portfolio. Take a look at last collection, shop. Get to know NIKITA entering about and contact pages."
		)}
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://lh3.googleusercontent.com/pw/ABLVV87hcgwohm0hcmGuxnQ2D0Rl9QrjtsnOIpW23t8DjF9HFiqSpgCAqnpipDYFcAhp0Rl0JO0h3YGW4UjD3LTrVVN7FmwiARg1zsUUgPHc6MSEjyfBZu8y6AewW3ToKeRsy1BAhAaT1oVEVASgHlxua9YDxXC97jwsQa38fXa-ZTCXSmWhkult6k5sGRlzMmoc7R-HIjq8BG5y50Dn5i46wHQyR_XETsIVjXLRYVAa8z4OM3z22I8FjnyrK09Sw_WJhP7iVTuzUv9GYVBF_YMekyRDsQeDKBotvb-eyojRmbdVIsp9kFXnW6VQmiSzKhWpWz9RA-r5hkTFtc2a7EnfJqGAVZyfa-UTayAZoSUpVqSnoCgd9vxVp8T7tPmP8wMMqiNGuSr7AL6E3TiRWenoNsfXjS8CEkftiSQQPfqj9b_IXvRm4z4z6nIHaiWPLu2ac5mVJiykV9OmQNsSFmpS8HJwj-VADr7C3fq2LNmoIAJG-ndX2wgXbLVGBGxIhs_lmDroxvzUhMtW38PTHW5v5aqFuly38dxPpsdRac07w4Rzj5J6qpj9h17JQLEdGZ5UedqZH2I2ZYg5G5EnsuygDfvL5Nlvu1vVbyS0b0gBtpJRt8x6_HjJAeLJcW0qhSxfeTCQ4hCHc85ovPhsQWLYQjhXaO8VgiWDayOiEfjz2DlqkxSz9ZHJG-Bzie1hMNziO1pM4_dO_WlDnpVP9L88Zh6iXCt8lc6oDMRuLO8-SGC9usJcEEUc4sgDeCr3MqrUajTNM92MvYe-2xZr3nTqbEA5Dpw-R2kWxj5GUATsa1AegRSyjQcDyy7wVbzdZ0JPAU9AmcMivbeIKzRwklOzChdOM1lqVU5Dc1hcRTP2kAOLU2k-Fi86pzIIIW6E7RsSqTitR91ZZ0_6YQSv8njGaGWKlbfTg32lIgcIPdPAm89S-ih01nvu1fCz8n04fwf1bVKiErMYLFnJaFEBplsieE1KcRUHZyzxDaAzXOH9wBQ1RtQMKn8po9vEoajr3KcJWXo-D08=w600-h600-s-no-gm?authuser=0"
	/>
	<meta property="og:url" content="https://nekhaynikita.ru/" />

	<meta
		name="twitter:image"
		content="https://lh3.googleusercontent.com/pw/ABLVV87hcgwohm0hcmGuxnQ2D0Rl9QrjtsnOIpW23t8DjF9HFiqSpgCAqnpipDYFcAhp0Rl0JO0h3YGW4UjD3LTrVVN7FmwiARg1zsUUgPHc6MSEjyfBZu8y6AewW3ToKeRsy1BAhAaT1oVEVASgHlxua9YDxXC97jwsQa38fXa-ZTCXSmWhkult6k5sGRlzMmoc7R-HIjq8BG5y50Dn5i46wHQyR_XETsIVjXLRYVAa8z4OM3z22I8FjnyrK09Sw_WJhP7iVTuzUv9GYVBF_YMekyRDsQeDKBotvb-eyojRmbdVIsp9kFXnW6VQmiSzKhWpWz9RA-r5hkTFtc2a7EnfJqGAVZyfa-UTayAZoSUpVqSnoCgd9vxVp8T7tPmP8wMMqiNGuSr7AL6E3TiRWenoNsfXjS8CEkftiSQQPfqj9b_IXvRm4z4z6nIHaiWPLu2ac5mVJiykV9OmQNsSFmpS8HJwj-VADr7C3fq2LNmoIAJG-ndX2wgXbLVGBGxIhs_lmDroxvzUhMtW38PTHW5v5aqFuly38dxPpsdRac07w4Rzj5J6qpj9h17JQLEdGZ5UedqZH2I2ZYg5G5EnsuygDfvL5Nlvu1vVbyS0b0gBtpJRt8x6_HjJAeLJcW0qhSxfeTCQ4hCHc85ovPhsQWLYQjhXaO8VgiWDayOiEfjz2DlqkxSz9ZHJG-Bzie1hMNziO1pM4_dO_WlDnpVP9L88Zh6iXCt8lc6oDMRuLO8-SGC9usJcEEUc4sgDeCr3MqrUajTNM92MvYe-2xZr3nTqbEA5Dpw-R2kWxj5GUATsa1AegRSyjQcDyy7wVbzdZ0JPAU9AmcMivbeIKzRwklOzChdOM1lqVU5Dc1hcRTP2kAOLU2k-Fi86pzIIIW6E7RsSqTitR91ZZ0_6YQSv8njGaGWKlbfTg32lIgcIPdPAm89S-ih01nvu1fCz8n04fwf1bVKiErMYLFnJaFEBplsieE1KcRUHZyzxDaAzXOH9wBQ1RtQMKn8po9vEoajr3KcJWXo-D08=w600-h600-s-no-gm?authuser=0"
	/>
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="photo-home">
	{#if isLoading}
		<div class="skeleton-wrap">
			{#each [0, 1, 2] as _}
				<div class="skeleton-block"></div>
			{/each}
		</div>
	{:else if loadError}
		<div class="error-msg">{loadError}</div>
	{:else}
		<PhotoCollectionFilter
			{selectedYear}
			onSelect={(year) => {
				selectedYear = year;
			}}
		/>
		{#key sliderKey}
			<PhotoSlider photos={filteredPhotos} />
		{/key}
	{/if}
</div>

<style>
	.photo-home {
		width: 100%;
		padding-top: var(--site-header-height);
		position: relative;
		z-index: 0;
	}

	.skeleton-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.skeleton-block {
		width: 100%;
		height: calc(100dvh - var(--site-header-height));
		background: #1a1a1a;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.skeleton-block:nth-child(2) {
		animation-delay: 0.2s;
	}

	.skeleton-block:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}

	.error-msg {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		color: #666;
		font-size: 1.125rem;
	}
</style>
