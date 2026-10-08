import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { STATIC_PATHS, SITE_URL } from '@/lib/site-config';
import { news, newsPath } from '@/lib/public-content';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });
  const [categories, products, articles] = await Promise.all([
    payload.find({collection:'categories',overrideAccess:false,depth:0,pagination:false,where:{_status:{equals:'published'}},select:{slug:true,visible:true,updatedAt:true}}),
    payload.find({collection:'products',overrideAccess:false,depth:0,pagination:false,where:{_status:{equals:'published'}},select:{slug:true,category:true,updatedAt:true}}), news(),
  ]);
  const categorySlugs = new Map(categories.docs.map(item => [item.id,item.slug]));
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map(path => ({url:SITE_URL+path}));
  for (const item of categories.docs) if (item.visible) entries.push({url:`${SITE_URL}/products/${encodeURIComponent(item.slug)}`,lastModified:item.updatedAt});
  for (const item of products.docs) { const slug = categorySlugs.get(typeof item.category === 'number' ? item.category : item.category.id); if (slug) entries.push({url:`${SITE_URL}/products/${encodeURIComponent(slug)}/${encodeURIComponent(item.slug)}`,lastModified:item.updatedAt}); }
  for (const article of articles) entries.push({url:SITE_URL+newsPath(article),lastModified:article.updatedAt});
  return entries;
}
