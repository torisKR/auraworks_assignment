import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Search and user-requested AI retrieval use the same publicly accessible pages.
    rules: {
      userAgent: "*",
      allow: isPreviewDeployment ? undefined : "/",
      disallow: isPreviewDeployment ? "/" : undefined,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
