import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const supabaseUrl = process.env.SUPABASE_URL;
let supabaseHost: string | null = null;
if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;
  } catch {
    /* ignore */
  }
}

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // Tree-shake icon / animation libraries — saves ~30 KB on First Load JS.
    // Each entry tells Next.js to import barrel files lazily.
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-link",
      "@tiptap/extension-placeholder",
    ],
  },
  images: {
    // Modern formats first — Next.js serves AVIF then WebP then original.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Vercel Blob (current storage provider on this deployment)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Supabase Storage (legacy / alternative provider — kept so projects
      // that still use Supabase keep working without a config change)
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  // Recommended security headers in addition to the ones from vercel.json
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Block clickjacking via iframe embeds outside our origin
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Force browsers to respect the declared MIME type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No legacy XSS auditor (modern browsers ignore but harmless)
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Constrain dangerous features by default
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

// Wrap with Sentry only when DSN is configured. Without that, the wrapper
// is a transparent passthrough and avoids generating sourcemaps / uploading
// during dev or non-error preview deploys.
const config = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      // Tunnel /monitoring → bypasses ad blockers in production
      tunnelRoute: "/monitoring",
      // Only upload sourcemaps when SENTRY_AUTH_TOKEN is set
      sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;

export default config;
