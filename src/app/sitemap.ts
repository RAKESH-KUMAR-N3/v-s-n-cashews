import type { MetadataRoute } from 'next';
import { PRODUCTS_CATALOG } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VITE_APP_URL || 'https://vsncashews.com';
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/quotes`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/invoices`, lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS_CATALOG.map((p) => ({
    url: `${baseUrl}/products/${p.slug || p.id}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  return [...staticRoutes, ...productRoutes];
}
