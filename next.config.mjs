import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = "https://earthlingsmusic.com";
const WWW_HOST = "www.earthlingsmusic.com";

/**
 * Static CSP. `headers()` is fixed at build time, so it cannot mint a
 * per-request nonce. A nonce would also force every route to render
 * dynamically (via `proxy.ts` / `headers()`), and browsers ignore
 * `'unsafe-inline'` once a nonce or hash is present.
 *
 * `'unsafe-inline'` is required in script-src because the production HTML
 * contains Next.js flight bootstrap scripts (`self.__next_f`) and the
 * next-themes inline script. Neither has a stable hash.
 *
 * `'unsafe-inline'` is required in style-src because React, Radix, and
 * motion set style attributes (CSP applies style-src to attributes unless
 * style-src-attr is split out, and that split still needs
 * `'unsafe-inline'`). next-themes also injects a `<style>` element while
 * the theme changes.
 *
 * Hosts:
 * - img-src: chain icons from `src/lib/chain-info.ts` (the same hosts as
 *   `images.remotePatterns`). Previews are blob: URLs from IndexedDB.
 * - media-src: audio and video previews are blob: URLs.
 * - connect-src: Pinata and Web3.Storage upload endpoints from
 *   `src/lib/ipfs.ts`. Custom IPFS gateways are written into metadata and
 *   are not fetched by the app. Vercel Analytics loads
 *   `/_vercel/insights/script.js` and beacons to `/_vercel/insights`
 *   (same origin). `va.vercel-scripts.com` is the dev debug script only.
 *   `vitals.vercel-insights.com` is the documented analytics fallback.
 * - font-src: next/font self-hosts Montserrat, Orbitron, and Geist Mono.
 * - Preview deployments on `*.vercel.app` also allow the Vercel Toolbar
 *   (`https://vercel.live`, `https://vercel.com`, `https://assets.vercel.com`,
 *   `wss://ws-us3.pusher.com`) per Vercel's toolbar CSP docs. Production
 *   hosts do not. The toolbar is injected by the platform and is not part
 *   of this app.
 *
 * HSTS is not set here. Vercel already sends
 * `strict-transport-security: max-age=63072000` on HTTPS responses. A
 * second HSTS header is ignored after the first (RFC 6797) and can
 * shorten that lifetime. includeSubDomains is intentionally not added.
 *
 * HTTP to HTTPS is also not configured here. Vercel's edge answers port 80
 * with a 308 before this app or `vercel.json` runs.
 */
function contentSecurityPolicy({ toolbar = false } = {}) {
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    isDev ? "https://va.vercel-scripts.com" : "",
    toolbar ? "https://vercel.live" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imgSrc = [
    "'self'",
    "blob:",
    "data:",
    "https://raw.githubusercontent.com",
    "https://assets.coingecko.com",
    toolbar ? "https://vercel.live https://vercel.com" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const fontSrc = [
    "'self'",
    toolbar ? "https://vercel.live https://assets.vercel.com" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const connectSrc = [
    "'self'",
    "https://api.pinata.cloud",
    "https://api.web3.storage",
    "https://vitals.vercel-insights.com",
    toolbar ? "https://vercel.live wss://ws-us3.pusher.com" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'${toolbar ? " https://vercel.live" : ""}`,
    `img-src ${imgSrc}`,
    `font-src ${fontSrc}`,
    `connect-src ${connectSrc}`,
    "media-src 'self' blob: data:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    toolbar ? "frame-src https://vercel.live" : "frame-src 'none'",
    "frame-ancestors 'none'",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");
}

function securityHeaders(toolbar) {
  return [
    {
      key: "Content-Security-Policy",
      value: contentSecurityPolicy({ toolbar }),
    },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: [
        "accelerometer=()",
        "camera=()",
        "display-capture=()",
        "geolocation=()",
        "gyroscope=()",
        "hid=()",
        "magnetometer=()",
        "microphone=()",
        "midi=()",
        "payment=()",
        "serial=()",
        "usb=()",
        "xr-spatial-tracking=()",
        "browsing-topics=()",
        "interest-cohort=()",
      ].join(", "),
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: WWW_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    const previewHost = {
      type: "host",
      value: ".*\\.vercel\\.app",
    };
    return [
      {
        source: "/:path*",
        has: [previewHost],
        headers: securityHeaders(true),
      },
      {
        source: "/:path*",
        missing: [previewHost],
        headers: securityHeaders(false),
      },
    ];
  },
};

export default nextConfig;
