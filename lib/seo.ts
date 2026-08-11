import type { Metadata, MetadataRoute } from "next";

const localSiteUrl = "http://localhost:3000";

function normalizeBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return localSiteUrl;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  return new URL(
    normalizeBaseUrl(
      process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.VERCEL_PROJECT_PRODUCTION_URL ??
        process.env.VERCEL_URL,
    ),
  );
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  image?: string;
};

export const siteConfig = {
  name: "Hockey Pathway",
  title: "Hockey Pathway | Boys Hockey Roadmap and League Guide",
  description:
    "Learn how boys hockey leagues connect from youth and school programs through prep, academy, junior, college, and professional hockey.",
  locale: "en_US",
  language: "en-US",
  logoPath: "/logo.png",
  iconPath: "/favicon-rounded.png",
  ogImage: {
    url: "/landing-hero.png",
    width: 1672,
    height: 941,
    alt: "Hockey players standing together on the ice",
  },
  keywords: [
    "boys hockey roadmap",
    "hockey pathway",
    "junior hockey leagues",
    "college hockey pathways",
    "AAA hockey",
    "prep school hockey",
    "NCAA hockey",
    "ACHA hockey",
    "Canadian junior hockey",
  ],
} as const;

export const publicSeoRoutes = [
  {
    path: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    changeFrequency: "weekly",
    priority: 1,
    image: siteConfig.ogImage.url,
  },
  {
    path: "/roadmap",
    title: "Boys Hockey Roadmap",
    description:
      "See how boys hockey can move from youth and school programs into prep, academy, junior, college, and professional leagues.",
    changeFrequency: "weekly",
    priority: 0.95,
    image: "/images/hockey/empty-rink.jpg",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Read what Hockey Pathway collects, how site analytics may be used, and what happens when you follow an outside link.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    title: "Terms",
    description:
      "Read the terms for using Hockey Pathway and its league guides.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/disclaimer",
    title: "Disclaimer",
    description:
      "Hockey Pathway provides general information. We are not recruiters, scouts, or a player placement service.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
] satisfies SeoRoute[];

export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
} satisfies Metadata["robots"];

function getSocialTitle(title: string, path: string) {
  return path === "/" ? siteConfig.title : `${title} | ${siteConfig.name}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage.url,
  imageAlt = siteConfig.ogImage.alt,
  imageWidth = siteConfig.ogImage.width,
  imageHeight = siteConfig.ogImage.height,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}): Metadata {
  const socialTitle = getSocialTitle(title, path);

  return {
    title: path === "/" ? { absolute: siteConfig.title } : title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: {
      canonical: path,
    },
    robots: indexableRobots,
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
  };
}

export function createNoIndexMetadata({
  title,
  description,
  path,
  follow = false,
}: {
  title: string;
  description: string;
  path: string;
  follow?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: false,
      follow,
      noarchive: true,
      googleBot: {
        index: false,
        follow,
        noarchive: true,
      },
    },
    openGraph: {
      title: getSocialTitle(title, path),
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
  };
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logoPath),
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: siteConfig.language,
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    description: siteConfig.description,
  };
}

export function createCollectionJsonLd({
  description,
  id,
  items,
  name,
  path,
}: {
  description: string;
  id: string;
  items: Array<{ name: string; description: string; url: string }>;
  name: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": id,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.url,
      })),
    },
  };
}
