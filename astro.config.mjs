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
      // Paid-search landing pages are excluded too: they exist only for ad traffic
      // and would otherwise compete with the service pages on the same terms.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !['/admin', '/admin/', '/privacy/', '/tos/', '/thank-you/', '/restoration-marketing/'].includes(pathname);
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
