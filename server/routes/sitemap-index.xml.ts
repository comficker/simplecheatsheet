import {domain} from "~/constants";

export default defineEventHandler(async (event) => {
  defaultContentType(event, "text/xml")
  const now = new Date()
  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap-template.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://${domain}/sitemap-page.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://${domain}/sitemap-tag.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>
  `
})
