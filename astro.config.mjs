import { defineConfig } from 'astro/config';

import icon from "astro-icon";

import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://remediationrestorationmarketing.com',
  integrations: [
    icon(),
    tailwind(),
    sitemap({
      // The CMS is an editorial interface, not a public content page.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !['/admin', '/admin/', '/privacy/', '/tos/', '/thank-you/'].includes(pathname);
      },
      // Keep sitemap freshness aligned with the editorial review date used by
      // the shared WebPage schema. Resource pages provide their own date in
      // their structured data when they are updated.
      serialize(item) {
        item.lastmod = '2026-08-10';
        return item;
      },
    }),
  ],
  trailingSlash: "always",
});
