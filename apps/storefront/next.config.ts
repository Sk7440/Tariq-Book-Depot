import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_E2E_WHATSAPP is set only by the Playwright e2e build (playwright.config.ts) so the
 * WhatsApp hand-off can be tested; that build goes to .next-e2e and never replaces the real one.
 * Production builds need no environment variables.
 */
const isE2E = Boolean(process.env.NEXT_PUBLIC_E2E_WHATSAPP);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: isE2E ? ".next-e2e" : ".next",
  experimental: {
    // Styled 404 for paths outside /en and /ur (src/app/global-not-found.tsx).
    globalNotFound: true,
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
