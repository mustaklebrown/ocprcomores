import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocprcomores.com';

  return {
    rules: [
      {
        // General crawlers
        userAgent: '*',
        allow: [
          '/',
          '/logo-blanc.png',
          '/logo-ocpr-mark.svg',
          '/logo-ocpr-white-mark.svg',
          '/og-image.png',
          '/uploads/',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin',
          '/api/admin/',
          '/api/contact',
          '/test-error',
        ],
      },
      {
        // Google — allow everything public
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
      {
        // Bing (powers Copilot AI search)
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
      {
        // Block OpenAI GPT crawler (AI training scraper)
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        // Block Common Crawl (AI training dataset scraper)
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
