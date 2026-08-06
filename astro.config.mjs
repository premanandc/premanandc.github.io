import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// Slugs of blog posts marked `unlisted: true` in their frontmatter.
// Keep in sync when flipping an unlisted post to published or vice versa.
const UNLISTED_BLOG_SLUGS = [
  'spec-driven-development-not-just-the-spec',
  'ai-playbook-part-1-architect',
];

// Folder names under public/talks/ for talks marked `unlisted: true` in src/data/talks.ts.
// Keep in sync when flipping an unlisted talk to published or vice versa.
const UNLISTED_TALK_SLUGS = [
  'your-problem-isnt-the-monolith',
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
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  output: 'static',
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
