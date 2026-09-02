import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { siteConfig } from './src/config/site';

const homepageUrl = new URL('/', siteConfig.origin).href;

export default defineConfig({
  output: 'static',
  site: siteConfig.origin,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: siteConfig.indexingEnabled
    ? [
        sitemap({
          serialize(item) {
            if (item.url === siteConfig.origin) {
              item.url = homepageUrl;
            }
            return item;
          },
        }),
      ]
    : [],
});
