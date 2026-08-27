import type { APIRoute } from 'astro';

import { siteConfig } from '../config/site';

export const GET: APIRoute = () => {
  const sitemapUrl = new URL('/sitemap-index.xml', siteConfig.origin);

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
