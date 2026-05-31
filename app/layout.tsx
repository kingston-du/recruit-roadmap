import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { AnalyticsPageViews } from "@/components/recruit/analytics-page-views";
import { JsonLd } from "@/components/recruit/json-ld";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  getSiteUrl,
  indexableRobots,
  siteConfig,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  referrer: "strict-origin-when-cross-origin",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: indexableRobots,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage.url,
        alt: siteConfig.ogImage.alt,
      },
    ],
  },
  icons: {
    icon: [{ url: siteConfig.iconPath, type: "image/png", sizes: "512x512" }],
    apple: [{ url: siteConfig.iconPath, type: "image/png", sizes: "512x512" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "sports",
};

export const viewport: Viewport = {
  themeColor: "#071a2f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd data={[createOrganizationJsonLd(), createWebsiteJsonLd()]} />
        <Suspense fallback={null}>
          <AnalyticsPageViews />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
