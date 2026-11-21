import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

// Open absolute http(s) and protocol-relative links in a new tab.
const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^(https?:)?\/\//i.test(href)) return;
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
    },
  },
};

// Slugs of blog posts marked `unlisted: true` in their frontmatter.
// Keep in sync when flipping an unlisted post to published or vice versa.
const UNLISTED_BLOG_SLUGS = [
];

// Folder names under public/talks/ for talks marked `unlisted: true` in src/data/talks.ts.
// Keep in sync when flipping an unlisted talk to published or vice versa.
const UNLISTED_TALK_SLUGS = [
];

export default defineConfig({
  site: 'https://premonition.dev',
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/blog/drafts') &&
        !page.includes('/talks/drafts') &&
        !UNLISTED_BLOG_SLUGS.some((slug) => page.includes(`/blog/${slug}`)) &&
        !UNLISTED_TALK_SLUGS.some((slug) => page.includes(`/talks/${slug}`)),
    }),
  ],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
  output: 'static',
  // Astro 7 defaults to 'jsx', which drops whitespace between elements and
  // glues words together in pages and in the search index.
  compressHTML: true,
  // Allow tunneled hostnames (cloudflared, ngrok, etc.) to reach the local
  // server. Applies to both `astro dev` and `astro preview`.
  // Local dev only; production is GitHub Pages and not affected.
  server: {
    allowedHosts: true,
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
