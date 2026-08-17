import type { MetadataRoute } from "next";
import { getAllPatternIds } from "@/lib/patterns";
import { getAllSegmentIds } from "@/lib/aws/segments";
import { getAllTopicIds } from "@/lib/ai/topics";

const SITE_URL = "https://study-companion.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const patternRoutes = getAllPatternIds().map((id) => ({
    url: `${SITE_URL}/patterns/${id}`,
    lastModified: new Date(),
  }));

  const awsRoutes = getAllSegmentIds().map((id) => ({
    url: `${SITE_URL}/aws/${id}`,
    lastModified: new Date(),
  }));

  const aiRoutes = getAllTopicIds().map((id) => ({
    url: `${SITE_URL}/ai/${id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/patterns`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/aws`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/ai`,
      lastModified: new Date(),
    },
    ...patternRoutes,
    ...awsRoutes,
    ...aiRoutes,
  ];
}
