# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and e-commerce platform for fashion designer/photographer Nikita Nekhay. Built with SvelteKit 2.18, Svelte 5.21, and Firebase (Auth, Firestore, Storage). Deployed on Vercel.

## Common Commands

```bash
npm run dev          # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run check       # Type-check with svelte-check
npm run check:watch # Watch mode for type-checking
npm run lint        # Run ESLint
```

## Architecture

### Tech Stack
- **SvelteKit 2.18** - Full-stack framework with SSR and API routes
- **Svelte 5.21** - UI components using modern runes API
- **Firebase 11** - Authentication, Firestore database, Storage
- **Tailwind CSS 3.3** - Styling with custom breakpoints
- **Vercel** - Deployment with Node.js 22.x runtime

### Directory Structure
- `src/routes/` - SvelteKit file-based routing (API routes in `src/routes/api/`)
- `src/components/` - Reusable Svelte components
- `src/lib/` - Firebase initialization and utilities
- `src/store/` - Svelte stores for state management
- `src/shared/` - Shared types and constants

### State Management
- `authStore` - User authentication state with Firebase user and Firestore data
- `isAdmin` - Admin role status (checked against hardcoded admin emails)
- `productStore` - Product data for shop
- `triggerComments` - Comment system trigger

### Authentication & Authorization
- Firebase Authentication (email/password)
- Admin emails hardcoded in `src/routes/+layout.svelte`:
  - `ktofreesapiens@gmail.com`
  - `vaper20041337@gmail.com`
- Protected routes defined in `src/shared/types.ts` (AdminRoutes, nonAuthRoutes)

### Database (Firestore)
- `users` - User profiles with cart data
- `posts` - Blog posts
- `comments` - Post comments
- `products` - Product catalog

### API Routes
- `src/routes/api/sendEmail/` - Server-side email sending via Nodemailer

### Environment Variables
Firebase config keys (PUBLIC_) and email credentials (SECRET_) are loaded from `.env` via `$env/dynamic/public` and `$env/dynamic/private`.

### Prerendering
Enabled for key pages (defined in `svelte.config.js`). The `base` path differs between dev (`/Personal-Website`) and production (`/`).
