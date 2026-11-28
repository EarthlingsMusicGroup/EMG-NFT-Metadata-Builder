/**
 * Public canonical origin. Keep this in sync with the host redirects in
 * `next.config.mjs`.
 *
 * `emgbuilder.spacebar.music` is the same deployment. Its `/` permanently
 * redirects to `/builder`; every other path is served as-is.
 */
export const SITE_URL = "https://earthlingsmusic.com";
export const BUILDER_HOST = "emgbuilder.spacebar.music";
