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
        return !['/admin', '/admin/', '/privacy/', '/tos/', '/thank-you/', '/restoration-marketing/', '/resources/ai-visibility-checklist/', '/resources/ai-visibility-checklist/download/'].includes(pathname);
      },
      // Omit lastmod until each URL has a verified significant-update date.
      // A shared review date does not establish when every page changed.
    }),
  ],
  trailingSlash: "always",
});
