import type { MetadataRoute } from 'next';
import { siteIndexable, SITE_URL } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return siteIndexable ? { rules:{ userAgent:'*', allow:'/', disallow:['/admin','/api','/special'] }, sitemap:`${SITE_URL}/sitemap.xml`, host:SITE_URL } : { rules:{ userAgent:'*', disallow:'/' } };
}
