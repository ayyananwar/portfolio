import type { MetadataRoute } from "next";
import { site, isPreviewDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment())
    return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
