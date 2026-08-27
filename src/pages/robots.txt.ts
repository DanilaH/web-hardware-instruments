import type { APIRoute } from 'astro';

import { siteConfig } from '../config/site';

export const GET: APIRoute = () => {
  const body = siteConfig.indexingEnabled
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', siteConfig.origin)}\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
