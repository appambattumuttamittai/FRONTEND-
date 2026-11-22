import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/adminPanel', '/adminPanel/', '/api/'],
      },
      // Allow Googlebot to crawl everything public
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/adminPanel', '/adminPanel/', '/api/'],
      },
    ],
    sitemap: 'https://appambattumuttamittai.com/sitemap.xml',
    host: 'https://appambattumuttamittai.com',
  };
}
