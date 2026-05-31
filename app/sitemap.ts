import type { MetadataRoute } from "next";

import { absoluteUrl, publicSeoRoutes } from "@/lib/seo";

const lastModified = new Date("2026-05-31T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSeoRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: route.image ? [absoluteUrl(route.image)] : undefined,
  }));
}
