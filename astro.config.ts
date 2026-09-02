import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { siteConfig } from './src/config/site';

export default defineConfig({
  output: 'static',
  site: siteConfig.origin,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: siteConfig.indexingEnabled ? [sitemap()] : [],
});
