import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const turnstileOrigin = "https://challenges.cloudflare.com";
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  isProduction ? "" : "'unsafe-eval'",
  turnstileOrigin,
  "https://*.posthog.com",
  "https://*.i.posthog.com",
]
  .filter(Boolean)
  .join(" ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `script-src ${scriptSources}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.posthog.com https://*.i.posthog.com",
      `frame-src https://checkout.stripe.com ${turnstileOrigin}`,
      isProduction ? "upgrade-insecure-requests" : "",
    ]
      .filter(Boolean)
      .join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "64kb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
