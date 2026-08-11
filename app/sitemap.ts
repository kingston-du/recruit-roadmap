import type { MetadataRoute } from "next";

import { getLeaguePath, leagues } from "@/lib/roadmap-data";
import { absoluteUrl, publicSeoRoutes } from "@/lib/seo";

const lastModified = new Date("2026-06-18T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicSeoRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      images: route.image ? [absoluteUrl(route.image)] : undefined,
    })),
    ...leagues.map((league) => ({
      url: absoluteUrl(getLeaguePath(league)),
      lastModified: new Date(`${league.lastReviewed}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.82,
      images: [absoluteUrl("/images/hockey/on-ice-action.jpg")],
    })),
  ];
}
