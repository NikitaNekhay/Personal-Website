# Performance, SEO, and Memory Audit

Date: 2026-05-28

Goal: keep the current site functionality, but make public pages load fast, stay responsive, consume less client memory, and produce better SEO HTML.

## Current Baseline Observations

- `static/photos/originals` contains 73 WebP files, about 26.4 MB total. Largest photo is about 1.8 MB.
- `static/photos/thumbs` contains 73 WebP files, about 3.3 MB total.
- Largest Svelte files by size:
  - `src/routes/photos-dashboard/+page.svelte`: 1550 lines
  - `src/components/MainPages/Profile/ShoppingCart.svelte`: 1302 lines
  - `src/components/MainPages/Posts/PostDetail.svelte`: 460 lines
  - `src/components/MainPages/Profile/ProfileEdit.svelte`: 445 lines
  - `src/components/MainPages/Posts/PostEdit.svelte`: 420 lines
- Public pages currently receive global scripts from `src/app.html`, plus the root layout imports Firebase auth and Firestore logic for every route.
- Several important pages fetch real content only in `onMount`, so initial HTML is thin or empty for SEO.
- The public photo image route proxies images through a SvelteKit server endpoint and GitHub API instead of serving static CDN files directly.

## P0 Tasks

These are the highest-impact tasks. Do these first.

### 1. Remove global third-party scripts from `src/app.html`

Files:
- `src/app.html`

Problem:
- ScrollMagic and its debug indicators are loaded on every page, including the home page.
- Font Awesome is loaded twice: CSS CDN and kit script.
- The inline CORS code inside the Font Awesome script tag does not belong in client HTML and cannot set HTTP headers.
- The viewport meta is missing `initial-scale=1`.

Tasks:
- [ ] Remove ScrollMagic CDN scripts from `src/app.html`.
- [ ] Remove `debug.addIndicators.min.js` from production completely.
- [ ] Remove one Font Awesome source, preferably both, and use local SVG assets or existing inline icons.
- [ ] Remove the fake CORS script block.
- [ ] Change viewport to `<meta name="viewport" content="width=device-width, initial-scale=1" />`.

Expected impact:
- Faster first load on all pages.
- Less blocking JavaScript.
- Lower memory use before Svelte even hydrates.

### 2. Stop loading Firebase/Auth in the public root shell

Files:
- `src/routes/+layout.svelte`
- `src/components/NavbarFooter/Navbar.svelte`
- `src/components/NavbarFooter/Menu.svelte`
- `src/lib/firebase/firebase.ts`

Problem:
- The root layout imports Firebase Auth, Firestore, stores, admin route lists, Navbar, Footer, Analytics, and route guard logic globally.
- This means public pages such as `/`, `/about`, `/works`, and `/contact` pay for auth/admin code even when the visitor is anonymous.
- `onAuthStateChanged` can perform Firestore reads on every route.

Tasks:
- [ ] Split layouts so public marketing/portfolio routes do not import Firebase by default.
- [ ] Move profile/admin/shop-auth logic into a protected/authenticated layout group.
- [ ] Lazy-load auth state only when a route or menu actually needs user/cart data.
- [ ] Replace root-level `window.location.href` redirects with SvelteKit `goto` where a client redirect is still needed.
- [ ] Keep Firebase for shop/profile/admin routes, but remove it from the home page dependency chain.

Expected impact:
- Smaller public JS bundle.
- Less hydration work.
- Faster home page interactivity.

### 3. Serve portfolio photos from static/CDN paths, not GitHub API on public image requests

Files:
- `src/components/MainPages/PhotoSlider.svelte`
- `src/routes/api/photos/image/[...path]/+server.ts`
- `src/routes/api/photos/manifest/+server.ts`
- `src/lib/photos-server.ts`

Problem:
- The current slider image URL goes through `/api/photos/image/...`.
- That endpoint calls GitHub API and returns binary image data from a serverless function.
- This adds cold starts, memory pressure, GitHub API latency, and rate-limit risk for public visitors.
- The files already live under `static/photos`, which Vercel can serve through its static/CDN layer after deploy.

Tasks:
- [ ] Change public image rendering to use direct static paths like `/photos/originals/file.webp` or `/photos/thumbs/file.webp`.
- [ ] Keep the GitHub image API only for admin preview fallback if needed.
- [ ] Change public manifest loading to prefer `/photos/manifest.json` from static assets.
- [ ] If immediate dashboard preview before deploy is required, use the GitHub API only inside the admin dashboard.
- [ ] Add cache headers only to API fallbacks, not as the main delivery path.

Expected impact:
- Much faster photo delivery.
- Lower Vercel function usage.
- Lower RAM usage per request.
- Fewer GitHub rate-limit failures.

### 4. Add responsive portfolio image variants and use `srcset`

Files:
- `src/routes/api/photos/upload/+server.ts`
- `src/shared/types.ts`
- `src/components/MainPages/PhotoSlider.svelte`
- `static/photos/`

Problem:
- The home page currently displays `photo.original`.
- Originals are max 1920 px wide and can be 1 MB or more per image.
- Mobile visitors do not need desktop-size images.

Tasks:
- [ ] Add a `display` or `large` variant around 1280 px wide.
- [ ] Keep `originals` for archival/high quality, but do not use it by default on the home page.
- [ ] Keep `thumbs` for admin cards and small previews.
- [ ] Add `srcset` and `sizes` in `PhotoSlider.svelte`.
- [ ] Preload only the first visible image, never the whole gallery.
- [ ] Keep `loading="eager"` and `fetchpriority="high"` only for the first image.

Expected impact:
- Better LCP.
- Less bandwidth on phones.
- Less decoded image memory in the browser.

### 5. Fix SEO data loading for home, shop, posts, and product detail

Files:
- `src/routes/+page.svelte`
- `src/routes/shop/+page.svelte`
- `src/routes/posts/+page.svelte`
- `src/routes/posts/[id]/+page.svelte`
- `src/routes/posts/post.ts`
- `src/components/MainPages/Gallery.svelte`
- `src/components/MainPages/Posts/PostDetail.svelte`

Problem:
- Home fetches the photo manifest in `onMount`, so initial HTML does not include the real photo list.
- Shop and posts pages fetch products from Firestore in `onMount`, so crawlers receive weak initial content.
- Product detail uses client-side fetching and image preloading patterns that should be server/data-route driven.

Tasks:
- [ ] Move home manifest loading to `+page.ts` or `+page.server.ts`.
- [ ] Move shop/posts product loading out of component `onMount`.
- [ ] Add route-level data loading for product detail.
- [ ] Generate dynamic `<title>`, description, canonical, and OG image values per product.
- [ ] Remove `console.log` from `getProducts()`.
- [ ] Add query limits or pagination for product lists.

Expected impact:
- Better SEO HTML.
- Faster first render.
- Less layout shift after hydration.

### 6. Stop Vercel deploy storms from photo uploads

Files:
- `src/routes/api/photos/upload/+server.ts`
- `src/lib/github.ts`
- `vercel.json` or Vercel ignored build step settings

Problem:
- A large upload can create many GitHub file writes.
- If every write or every small commit triggers Vercel, Vercel can fail with too many deploy requests.
- The current upload flow is operationally expensive for 70 photos.

Tasks:
- [ ] Replace per-file GitHub content commits with one batch commit using Git Trees/Commits API.
- [ ] Commit all originals, thumbs, variants, and `manifest.json` in a single commit per upload batch.
- [ ] Add a Vercel ignored build step for photo-only commits when a redeploy is not needed immediately.
- [ ] Use a clear commit marker such as `[photos skip deploy]`, but verify Vercel actually honors it through ignored build configuration.
- [ ] Add an admin button like `Publish photo changes` if manual deploy control is preferred.

Expected impact:
- Fewer Vercel failures.
- Fewer GitHub API calls.
- Faster and safer batch uploads.

## P1 Tasks

### 7. Remove unused dependencies and legacy routers

Files:
- `package.json`
- `package-lock.json`

Problem:
- The app uses SvelteKit routing, but package dependencies include legacy/unused routing and UI libraries.
- Examples to verify and remove if unused: `@sveltech/routify`, `routify`, `svelte-routing`, `svelte-spa-router`, `scrollmagic`, `@types/scrollmagic`, `tw-elements`, `country-flag-icons`, `gh-pages`, `generate-robotstxt`, `xmp-js`, `piexifjs`.

Tasks:
- [ ] Run an import search for each suspect package.
- [ ] Remove unused packages from `package.json`.
- [ ] Regenerate `package-lock.json` on the target Node/npm version.
- [ ] Run `npm run build` and `npm run check`.

Expected impact:
- Smaller install.
- Less accidental client bundle growth.
- Cleaner dependency risk surface.

### 8. Make build warnings zero

Files:
- `src/components/MainPages/Posts/PostDetail.svelte`
- `src/components/MainPages/UserManager/UserTable.svelte`
- Other files reported by `npm run build` and `npm run check`

Problem:
- Invalid HTML and invalid Svelte patterns can cause browser DOM correction and hydration mismatch.
- Current examples include invalid script loading in `PostDetail.svelte` and invalid table body children in `UserTable.svelte`.

Tasks:
- [ ] Remove or replace invalid `<script lang="ts" src=... defer>` usage.
- [ ] Fix invalid children inside `<tbody>`.
- [ ] Fix self-closing non-void HTML element warnings.
- [ ] Keep `npm run check` and `npm run build` warning-free except known Vercel adapter Windows symlink issues.

Expected impact:
- More stable hydration.
- Lower client-side repair work.
- Fewer hard-to-debug UI regressions.

### 9. Replace full page reload navigation with SvelteKit navigation

Files:
- `src/routes/+layout.svelte`
- `src/components/MainPages/Gallery.svelte`
- `src/components/MainPages/Profile/Profile.svelte`
- `src/components/Shared/CartAdded.svelte`
- `src/components/Shared/CommonPopUp.svelte`
- `src/components/MainPages/UserManager/UserTable.svelte`

Problem:
- `window.location.href` and `location.reload()` force full document reloads.
- This kills SPA responsiveness and reloads scripts, Firebase, fonts, and images.

Tasks:
- [ ] Use `<a href>` for normal navigation.
- [ ] Use `goto()` for programmatic SvelteKit navigation.
- [ ] Replace `location.reload()` after deletes/updates with local state updates.
- [ ] Keep full reloads only where absolutely required.

Expected impact:
- Faster perceived navigation.
- Less memory churn.
- Less network reload.

### 10. Fix subscription, timer, and object URL cleanup

Files:
- `src/components/MainPages/Gallery.svelte`
- `src/components/MainPages/UserManager/UserTable.svelte`
- `src/components/MainPages/Profile/ShoppingCart.svelte`
- `src/components/MainPages/Posts/CommentList.svelte`
- `src/routes/photos-dashboard/+page.svelte`

Problem:
- Some components create subscriptions, timers, or object URLs that can survive route changes or repeated admin actions.
- The photo dashboard creates preview object URLs for staged images; these must be revoked after remove, successful upload, and component destroy.

Tasks:
- [ ] Return unsubscribe callbacks from every `onMount` subscription.
- [ ] Clear every `setTimeout` and `setInterval` on destroy.
- [ ] Revoke all `URL.createObjectURL` previews on remove, success, and page destroy.
- [ ] Avoid storing large file objects longer than needed after upload.

Expected impact:
- Lower RAM growth during admin sessions.
- More reliable route changes.

### 11. Optimize `Works.svelte`, `Footer.svelte`, and legacy image-heavy components

Files:
- `src/components/MainPages/Works.svelte`
- `src/components/NavbarFooter/Footer.svelte`
- `src/components/MainPages/Home.svelte`
- `src/components/MainPages/HomeDesktop.svelte`
- `src/components/MainPages/About/Authorphoto.svelte`

Problem:
- `Works.svelte` uses many remote Firebase/Google images without explicit `loading`, `decoding`, width, or height.
- `Footer.svelte` loads a 6 MB `static/media/NIKITA.JPG` asset path as a visual element.
- Old home components still exist and can be accidentally imported.

Tasks:
- [ ] Convert large static images to optimized WebP/AVIF assets.
- [ ] Add `loading="lazy"` and `decoding="async"` to below-fold images.
- [ ] Add width/height or CSS aspect-ratio to all images.
- [ ] Replace remote Google/Firebase hardcoded URLs with local optimized assets where possible.
- [ ] Remove old unused home components after confirming they are not imported.
- [ ] Reduce or lazy-load the footer image, or hide footer on immersive portfolio routes.

Expected impact:
- Faster image-heavy pages.
- Less layout shift.
- Less decoded image memory.

### 12. Split large admin/profile components

Files:
- `src/routes/photos-dashboard/+page.svelte`
- `src/components/MainPages/Profile/ShoppingCart.svelte`
- `src/components/MainPages/Posts/PostEdit.svelte`
- `src/components/MainPages/Profile/ProfileEdit.svelte`

Problem:
- Very large Svelte components are harder for the compiler, harder to hydrate, and easier to leak state in.
- `photos-dashboard/+page.svelte` combines upload staging, bulk editing, existing grid, reorder, delete, popups, and styles in one file.

Tasks:
- [ ] Split `photos-dashboard` into `PhotoUploadStage`, `PhotoBulkToolbar`, `PhotoGrid`, `PhotoEditorCard`, and shared helpers.
- [ ] Split `ShoppingCart.svelte` into cart list, checkout form, delivery/payment sections, and summary.
- [ ] Keep admin/profile components route-local so they do not enter public bundles.

Expected impact:
- Easier maintenance.
- Smaller route chunks.
- Lower chance of stale state bugs.

## P2 Tasks

### 13. Add route-level code splitting and bundle analysis

Files:
- `vite.config.ts`
- `package.json`

Problem:
- There is no bundle analyzer or manual chunk strategy.
- Firebase, i18n, admin, and image CMS code should not accidentally merge into the same public chunk.

Tasks:
- [ ] Add a bundle visualizer in a temporary/perf branch.
- [ ] Identify the largest client chunks.
- [ ] Ensure Firebase, admin dashboard, and shop chunks stay route-specific.
- [ ] Consider manual chunks only after layout splitting and dependency cleanup.

Expected impact:
- Data-driven bundle reductions.

### 14. Improve font loading

Files:
- `src/app.css`
- `src/app.html`

Problem:
- `src/app.css` contains many remote `@font-face` declarations for multiple font families and weights.
- Fonts are fetched from Google font static URLs and may block text rendering if not tuned.

Tasks:
- [ ] Keep only font families and weights actually used.
- [ ] Self-host critical fonts under `static/fonts`.
- [ ] Use `font-display: swap`.
- [ ] Preload only the most important above-the-fold font file.

Expected impact:
- Faster text paint.
- Fewer external requests.

### 15. Tune analytics loading

Files:
- `src/lib/Analytics.svelte`
- `src/routes/+layout.svelte`

Problem:
- Analytics and Speed Insights are mounted globally.
- Analytics should not compete with portfolio LCP and first input responsiveness.

Tasks:
- [ ] Load analytics only in production.
- [ ] Initialize analytics after first paint or during idle time.
- [ ] Ensure `gtag('config')` runs once per navigation, not from noisy reactive updates.
- [ ] Keep Vercel Speed Insights if useful, but defer it from critical public render.

Expected impact:
- Faster initial interaction.
- Less third-party work during LCP.

### 16. Correct prerender configuration

Files:
- `svelte.config.js`

Problem:
- `prerender.entries` includes dynamic routes like `/posts/[id]`, private/admin routes, and dead routes like `/stat`.
- Prerendering admin pages has little SEO value and can create build noise.

Tasks:
- [ ] Remove private/admin pages from static prerender entries.
- [ ] Remove dead routes or create the missing route intentionally.
- [ ] Generate real product detail entries from product data if product pages should be prerendered.
- [ ] Keep portfolio/home public pages prerenderable after manifest loading is made static/server-safe.

Expected impact:
- Cleaner builds.
- Better static SEO where it matters.

## Verification Checklist

Run these after each optimization batch:

- [ ] `npm run check`
- [ ] `npm run build`
- [ ] Lighthouse mobile home page: LCP, CLS, INP, total JS, total image weight
- [ ] Lighthouse mobile shop page
- [ ] Lighthouse product detail page
- [ ] Manual test: login, admin dashboard, upload photo, reorder photo, delete photo
- [ ] Manual test: guest cart and logged-in cart
- [ ] Manual test: language switching

Target budgets:

- Home initial JS: under 170 KB gzip after layout split.
- Home LCP image: under 250 KB on mobile, under 500 KB on desktop.
- Home total initial image transfer: one hero/display image plus tiny manifest only.
- Public routes should not load Firebase unless user/auth UI is opened or route requires it.
- No public request should call GitHub API for static images.

## Suggested Execution Order

1. Clean `src/app.html`.
2. Serve portfolio images and manifest from static/CDN paths.
3. Split public layout from Firebase/auth layout.
4. Move home/shop/posts data loading out of `onMount`.
5. Fix image variants and `srcset`.
6. Fix Vercel photo upload batch commits.
7. Remove unused dependencies.
8. Fix memory cleanup and invalid HTML warnings.
9. Split large admin/profile components.
10. Run Lighthouse and bundle analysis, then tune remaining bottlenecks.
