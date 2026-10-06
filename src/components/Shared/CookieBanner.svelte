<script lang="ts">
    import GdprBanner from '@beyonk/gdpr-cookie-consent-banner';
    import { base } from '$app/paths';
    import { t } from 'svelte-i18n';

    import "../../assets/styles/CookieBanner.css";
</script>

<GdprBanner
    cookieName="nekhay_gdpr"

    heading={$t('Cookie heading')}

    description={
        $t('Cookie description 1') +
        ` <a class="p-link" href="${base}/policy">` +
        $t('Cookie description 2') +
        '</a>.'
    }

    acceptAllLabel={$t('Cookie accept')}
    acceptSelectedLabel={$t('Cookie accept')}

    choices={{
        necessary: {
            label: $t('Cookie necessary title'),
            description: $t('Cookie necessary description'),
            value: true
        },

        tracking: false,
        analytics: false,
        marketing: false
    }}

    canRejectCookies={false}
    showEditIcon={false}
/>