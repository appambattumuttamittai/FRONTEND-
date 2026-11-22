import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://appambattumuttamittai.com';
  const now = new Date();
  return [
    { url: baseUrl,                 lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/order`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/privacy`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/refund`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
