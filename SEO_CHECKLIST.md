# SEO checklist

## Implemented

- [x] Descriptive title and description consistent with visible portfolio content.
- [x] Canonical URL https://www.ayyan.tech/ and absolute metadata URLs.
- [x] Open Graph and Twitter large-image metadata, with a 1200 x 630 PNG preview.
- [x] SVG icon and 180 x 180 Apple touch icon.
- [x] English document language and Next.js responsive viewport.
- [x] One descriptive H1, section headings, anchor links, skip link and image descriptions.
- [x] Content and metadata in server-rendered HTML, readable without JavaScript.
- [x] Person, WebSite and ProfilePage JSON-LD with approved details and profile URLs.
- [x] Sitemap contains only the canonical homepage, not section anchors or API routes.
- [x] Sitemap lastmod records the actual content update date, not every request. Update it when page content changes significantly.
- [x] Robots allows production crawling, references the sitemap, and excludes /api/. Robots is not access control.
- [x] Vercel preview/development deployments use noindex metadata, disallow crawling and have an empty sitemap.
- [x] Automated checks for metadata, JSON-LD parsing, crawler policies, sharing assets, responsive layouts and accessibility.
- [x] No API keys or private environment settings in page metadata or structured data.

## Owner and deployment steps

- [ ] Push the changes and wait for a successful Vercel deployment.
- [ ] Check the deployed homepage, sitemap.xml, robots.txt and sharing image.
- [ ] Verify ayyan.tech ownership in Google Search Console using its supplied DNS TXT value.
- [ ] Submit https://www.ayyan.tech/sitemap.xml in Search Console and inspect the homepage URL.
- [ ] Run the deployed page through Rich Results Test or Schema Markup Validator. Markup does not guarantee a rich result.
- [ ] Review Core Web Vitals in Search Console or PageSpeed Insights. No performance score is claimed.
- [ ] Monitor indexing and crawl reports after processing; indexing and rankings are not guaranteed or immediate.

## Maintenance

Add actual project-detail pages to the sitemap only when they exist, with unique metadata and links from the homepage. Keep preview URLs out of production metadata. Do not add keyword stuffing, invisible text, fake ratings, fabricated awards or automatically changing lastmod timestamps.

## References

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Installed Next.js documentation for Metadata, sitemap, robots and JSON-LD.
