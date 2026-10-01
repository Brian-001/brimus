import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { teamMembers } from "@/lib/data";
import { sortedInsights } from "@/content/insights";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about/team", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/experience", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ...teamMembers
    .filter((member) => member.slug)
    .map((member) => ({
      path: `/about/${member.slug}`,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
  ...sortedInsights().map((post) => ({
    path: `/insights/${post.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
