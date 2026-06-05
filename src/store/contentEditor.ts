import { writable } from 'svelte/store';

/**
 * Whether the admin-only in-app content (i18n) editor overlay is open.
 * Toggled from the gradient button in the expanded header (Navbar) and consumed
 * by the ContentEditor overlay mounted once in the root layout.
 */
export const contentEditorOpen = writable(false);
