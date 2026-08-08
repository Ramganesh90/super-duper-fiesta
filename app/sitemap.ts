import type { MetadataRoute } from "next";
import { getAllPatternIds } from "@/lib/patterns";

const SITE_URL = "https://pattern-verse.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const patternRoutes = getAllPatternIds().map((id) => ({
    url: `${SITE_URL}/patterns/${id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    ...patternRoutes,
  ];
}
