import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { siteConfig } from './src/config/site';

export default defineConfig({
  output: 'static',
  site: siteConfig.origin,
  integrations: siteConfig.indexingEnabled ? [sitemap()] : [],
});
