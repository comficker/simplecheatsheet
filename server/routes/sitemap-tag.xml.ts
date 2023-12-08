import {ResponseTaxonomy} from "~/interface";
import {ofetch} from "ofetch";
import {domain} from "~/constants";


export default defineEventHandler(async (event) => {
  let out = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap-template.xsl"?>'
  const res: ResponseTaxonomy = await ofetch(`${process.env.API}/cs/taxonomies/`)
  out = out + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  res.results.forEach(item => {
    out = out + '<url>' +
      `<loc>https://${domain}/${item.type}/${item.id_string}</loc>` +
      `<lastmod>${item.updated}</lastmod>` +
      '<changefreq>daily</changefreq>' +
      '<priority>0.8</priority>' +
      '</url>'
  })
  out = out + '</urlset>'
  defaultContentType(event, "text/xml")
  return out
})
