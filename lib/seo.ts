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
  title: "Hockey Pathway | Boys Hockey Recruiting Tracker",
  description:
    "A simple boys hockey recruiting tracker for families to learn the pathway, build My Plan, manage targets, and know what to do this week.",
  locale: "en_US",
  language: "en-US",
  logoPath: "/logo.png",
  iconPath: "/favicon-rounded.png",
  ogImage: {
    url: "/landing-hero.png",
    width: 1672,
    height: 941,
    alt: "Hockey Pathway planning app for boys hockey families",
  },
  keywords: [
    "boys hockey recruiting",
    "hockey recruiting tracker",
    "hockey pathway",
    "junior hockey roadmap",
    "college hockey planning",
    "hockey target list",
    "hockey parent planner",
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
      "Learn common boys hockey paths from youth, AAA, high school, prep, academy, junior hockey, college, and beyond before building your target list.",
    changeFrequency: "monthly",
    priority: 0.9,
    image: "/images/hockey/empty-rink.jpg",
  },
  {
    path: "/pricing",
    title: "Pricing",
    description:
      "Start Hockey Pathway free, upgrade to Pro for unlimited tracking, or add optional Setup Assist for user-provided targets, contacts, dates, and links.",
    changeFrequency: "monthly",
    priority: 0.8,
    image: "/images/hockey/sticks-detail.jpg",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Read how Hockey Pathway protects private family recruiting details, player profile information, targets, contacts, dates, and account data.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    title: "Terms",
    description:
      "Review the terms for using Hockey Pathway as a hockey recruiting planning and organization tool for families.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/disclaimer",
    title: "Disclaimer",
    description:
      "Understand Hockey Pathway's role as a planning tool, not a recruiting agency, scouting service, marketplace, or guarantee of outcomes.",
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
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: siteConfig.language,
  };
}

export function createOfferCatalogJsonLd() {
  return {
    "@type": "OfferCatalog",
    name: "Hockey Pathway plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro monthly",
        price: "5",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro yearly",
        price: "39",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Setup Assist",
        price: "20",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
    ],
  };
}

export function createWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": absoluteUrl("/#web-application"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.ogImage.url),
    audience: {
      "@type": "Audience",
      audienceType: "Boys hockey players and parents",
    },
    featureList: [
      "Public boys hockey Roadmap",
      "My Plan family recruiting plan",
      "Targets, coach contacts, camps, and dates",
      "My Player profile details and video links",
      "Today checklist for next steps",
    ],
    offers: createOfferCatalogJsonLd(),
  };
}
