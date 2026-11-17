// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFile } from 'node:fs/promises';

export default defineConfig({
  site: 'https://www.horsesandcars.com',
  // "preserve" keeps the same URLs Jekyll produced (/about -> about.html, /category/family/ -> category/family/index.html)
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  integrations: [
    sitemap(),
    // The Jekyll site served /sitemap.xml, which is the URL search engines know,
    // so publish the full URL list there too.
    {
      name: 'sitemap-xml',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await copyFile(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
        },
      },
    },
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
