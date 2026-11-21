import type { MetadataRoute } from "next";
import { site, isPreviewDeployment } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreviewDeployment()) return [];
  // Only actual indexable pages belong here; section anchors are not pages.
  return [{ url: `${site.url}/`, lastModified: "2026-11-21" }];
}
