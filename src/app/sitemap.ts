import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewDeployment, publicPages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreviewDeployment) return [];
  // No synthetic lastModified timestamps or duplicate /store entry.
  return publicPages.map(({ path }) => ({ url: absoluteUrl(path) }));
}
