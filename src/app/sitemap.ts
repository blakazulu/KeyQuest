import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'he'];
  const routes = ['', '/levels', '/practice', '/dashboard'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route
  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${route}`,
            he: `${BASE_URL}/he${route}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
