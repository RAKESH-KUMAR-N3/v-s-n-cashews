import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.VITE_APP_URL || 'https://vsncashews.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/protected/', '/admin'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
