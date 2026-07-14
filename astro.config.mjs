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
        return pathname !== '/admin' && pathname !== '/admin/';
      },
      // Keep sitemap freshness aligned with the editorial review date used by
      // the shared WebPage schema. Resource pages provide their own date in
      // their structured data when they are updated.
      serialize(item) {
        item.lastmod = '2026-07-13';
        return item;
      },
    }),
  ],
  trailingSlash: "always",
});
