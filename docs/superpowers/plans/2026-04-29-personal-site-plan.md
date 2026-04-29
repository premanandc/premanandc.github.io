# premonition.dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder Jekyll site at premanandc.github.io with a modern Astro + React site deployed to GitHub Pages, featuring a blog, talks, and about page.

**Architecture:** Astro with `@astrojs/react` for interactive islands. Blog posts via content collections (Markdown/MDX). Reveal.js presentations served as static HTML from `public/talks/` with a shared brand theme. GitHub Actions deploys on push to `main`.

**Tech Stack:** Astro 5, React 19, TypeScript, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-04-29-personal-site-design.md`

---

## File Map

### New files to create

```
astro.config.mjs                        ← Astro config with React integration, GitHub Pages site config
package.json                            ← Dependencies: astro, @astrojs/react, react, react-dom
tsconfig.json                           ← Extends Astro's strict preset
.gitignore                              ← node_modules, dist, .astro, .superpowers, .DS_Store
.github/workflows/deploy.yml            ← GitHub Actions: install, build, deploy to Pages
src/styles/global.css                   ← Editorial Light color tokens, typography, base styles
src/layouts/BaseLayout.astro            ← Shell: HTML head, nav, footer, global styles
src/layouts/BlogPost.astro              ← Article layout: header, metadata, reading time, content slot
src/components/Nav.astro                ← Horizontal nav with avatar and links
src/components/Footer.astro             ← Footer with copyright and social links
src/components/PostCard.astro           ← Blog post card: title, date, reading time, excerpt, tags
src/components/TalkCard.astro           ← Talk card: title, event, date, description
src/components/TagFilter.tsx            ← React island: client-side tag filtering for blog listing
src/pages/index.astro                   ← Home page
src/pages/about.astro                   ← About page
src/pages/talks.astro                   ← Talks listing page
src/pages/blog/index.astro              ← Blog listing page
src/pages/blog/[...slug].astro          ← Dynamic blog post routes
src/content.config.ts                   ← Content collection schema definition
src/content/blog/ai-assisted-development.md  ← First blog post with frontmatter
src/data/talks.ts                       ← Talks metadata (title, event, date, description, url)
public/talks/theme/premonition.css      ← Shared Reveal.js brand theme
```

### Existing files to move or remove

```
_config.yml                             ← DELETE (Jekyll config, no longer needed)
index.md                                ← DELETE (replaced by src/pages/index.astro)
images/headshot.png                     ← MOVE to public/images/headshot.png
talks/                                  ← MOVE to public/talks/ (ai-assisted-dev, graph-powered-storyworlds)
```

### Files NOT to touch

```
CNAME                                   ← Managed by GitHub Pages settings, never edit manually
```

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "premonition-dev",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.8.0",
    "@astrojs/react": "^4.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "typescript": "^5.8.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://premonition.dev',
  integrations: [react()],
  output: 'static',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.superpowers/
.DS_Store
.claude/
```

- [ ] **Step 5: Move existing assets into place**

Move `images/headshot.png` to `public/images/headshot.png`.
Move `talks/` contents to `public/talks/`.
Copy wordcloud image from `~/Downloads/Prem-Final-HD.png` to `public/images/wordcloud.png`.

```bash
mkdir -p public/images public/talks
mv images/headshot.png public/images/headshot.png
rmdir images
mv talks/ai-assisted-dev public/talks/ai-assisted-dev
mv talks/graph-powered-storyworlds public/talks/graph-powered-storyworlds
rmdir talks
cp ~/Downloads/Prem-Final-HD.png public/images/wordcloud.png
```

- [ ] **Step 6: Remove Jekyll files**

```bash
rm _config.yml index.md
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated, no errors.

- [ ] **Step 8: Verify Astro runs**

```bash
npx astro check
```

Expected: No errors (may warn about no pages yet, that's fine).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore public/
git add -u  # stages the deletions of _config.yml, index.md, and the moved files
git commit -m "Scaffold Astro project with React integration

Replace Jekyll setup with Astro 5 + @astrojs/react.
Move talks and images to public/ directory.
Remove _config.yml and index.md."
```

---

## Task 2: Global styles and base layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #fafaf9;
  --bg-surface: #ffffff;
  --text-primary: #1c1917;
  --text-secondary: #78716c;
  --accent: #0d9488;
  --accent-secondary: #2563eb;
  --border: #e7e5e4;
  --code-bg: #1c1917;
  --tag-bg: rgba(13, 148, 136, 0.08);
  --tag-border: rgba(13, 148, 136, 0.2);
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s;
}

a:hover {
  color: var(--accent-secondary);
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}

pre {
  background: var(--code-bg);
  color: #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
}

code:not(pre code) {
  background: rgba(13, 148, 136, 0.08);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

img {
  max-width: 100%;
  height: auto;
}

h1, h2, h3, h4 {
  color: var(--text-primary);
  line-height: 1.3;
}

h1 { font-size: 2.25rem; font-weight: 800; }
h2 { font-size: 1.5rem; font-weight: 700; }
h3 { font-size: 1.25rem; font-weight: 600; }

blockquote {
  border-left: 3px solid var(--accent);
  padding: 2px 0 2px 20px;
  margin: 24px 0;
  font-size: 1.05rem;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.7;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

th, td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  font-size: 0.9rem;
}

th {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
const currentPath = Astro.url.pathname;

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/talks', label: 'Talks' },
  { href: '/about', label: 'About' },
];
---

<nav>
  <a href="/" class="nav-brand">
    <img src="/images/headshot.png" class="nav-avatar" alt="Prem Chandrasekaran" />
    <span class="nav-name">Prem Chandrasekaran</span>
  </a>
  <div class="nav-links">
    {links.map(link => (
      <a
        href={link.href}
        class:list={[{ active: currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href)) }]}
      >
        {link.label}
      </a>
    ))}
  </div>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1080px;
    margin: 0 auto;
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--text-primary);
  }

  .nav-brand:hover {
    color: var(--text-primary);
  }

  .nav-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .nav-name {
    font-weight: 700;
    font-size: 15px;
  }

  .nav-links {
    display: flex;
    gap: 28px;
  }

  .nav-links a {
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    transition: color 0.15s;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---

<footer>
  <span>&copy; {year} Prem Chandrasekaran</span>
  <span class="footer-links">
    <a href="https://github.com/premanandc" target="_blank" rel="noopener noreferrer">GitHub</a>
    <span class="dot">&middot;</span>
    <a href="https://linkedin.com/in/premanandc" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </span>
</footer>

<style>
  footer {
    max-width: 1080px;
    margin: 60px auto 0;
    padding: 24px 32px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .footer-links a {
    color: var(--accent);
    text-decoration: none;
  }

  .dot {
    margin: 0 4px;
  }
</style>
```

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Prem Chandrasekaran — engineering leader, writer, speaker.' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title} | premonition.dev</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  main {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 32px;
  }
</style>
```

- [ ] **Step 5: Create a minimal home page to verify the layout**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <section class="hero">
    <div class="hero-text">
      <h1>Engineering leader who writes about what actually works.</h1>
      <p>I build software, lead teams, and write about the gap between what tools promise and what they deliver. Currently Market Tech Director at Thoughtworks.</p>
    </div>
    <img src="/images/headshot.png" class="hero-image" alt="Prem Chandrasekaran" />
  </section>
</BaseLayout>

<style>
  .hero {
    display: flex;
    align-items: center;
    gap: 48px;
    padding: 56px 0 48px;
  }

  .hero-text {
    flex: 1;
  }

  .hero-text h1 {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 12px;
  }

  .hero-text p {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 540px;
  }

  .hero-image {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 3px solid var(--border);
  }
</style>
```

- [ ] **Step 6: Run dev server and verify**

```bash
npx astro dev
```

Open `http://localhost:4321`. Expected: nav with avatar and links, hero section with heading, paragraph, and headshot. Footer with copyright and social links. Editorial Light styling applied.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/components/Nav.astro src/components/Footer.astro src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "Add base layout, nav, footer, and global styles

Editorial Light theme with Inter + JetBrains Mono typography.
Horizontal nav with avatar, footer with social links."
```

---

## Task 3: Blog content collection and first post

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/ai-assisted-development.md`
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create `src/content/blog/ai-assisted-development.md`**

Copy the article from `~/Projects/arc-of-ai/ai-assisted-development-article.md` and add frontmatter:

```bash
cp ~/Projects/arc-of-ai/ai-assisted-development-article.md src/content/blog/ai-assisted-development.md
```

Then prepend frontmatter to the file. The file should start with:

```markdown
---
title: "I Code 10x Faster. We Ship at the Same Speed."
date: 2026-04-29
excerpt: "AI coding tools accelerate delivery when the work before coding is settled AND the work after coding is consistent. Across three projects, both conditions held on exactly one."
tags: ["AI", "Engineering Leadership", "Developer Experience"]
---
```

Remove the `# I Code 10x Faster. We Ship at the Same Speed.` H1 heading from the body since the title comes from frontmatter and will be rendered by the layout.

- [ ] **Step 3: Create `src/components/PostCard.astro`**

```astro
---
interface Props {
  title: string;
  date: Date;
  excerpt: string;
  tags: string[];
  slug: string;
  readingTime: string;
}

const { title, date, excerpt, tags, slug, readingTime } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
});
---

<a href={`/blog/${slug}`} class="post-card">
  <div class="post-meta">
    <span class="post-date">{formattedDate}</span>
    <span class="post-meta-dot">&bull;</span>
    <span class="post-reading">{readingTime}</span>
  </div>
  <h3>{title}</h3>
  <p>{excerpt}</p>
  <div class="post-tags">
    {tags.map(tag => <span class="tag">{tag}</span>)}
  </div>
</a>

<style>
  .post-card {
    display: block;
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: inherit;
    transition: background 0.15s;
  }

  .post-card:hover {
    background: rgba(13, 148, 136, 0.02);
    margin: 0 -16px;
    padding: 24px 16px;
    border-radius: 8px;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .post-date,
  .post-reading {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .post-meta-dot {
    color: var(--border);
    font-size: 10px;
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
    line-height: 1.35;
  }

  p {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 680px;
  }

  .post-tags {
    display: flex;
    gap: 6px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 99px;
    background: var(--tag-bg);
    color: var(--accent);
    border: 1px solid var(--tag-border);
  }
</style>
```

- [ ] **Step 4: Verify content collection loads**

```bash
npx astro build
```

Expected: Build succeeds. No content collection errors.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/blog/ai-assisted-development.md src/components/PostCard.astro
git commit -m "Add blog content collection and first post

Content collection with typed frontmatter schema.
Migrate 'I Code 10x Faster' article from arc-of-ai.
PostCard component for blog listings."
```

---

## Task 4: Blog listing and post pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/layouts/BlogPost.astro`
- Create: `src/components/TagFilter.tsx`

- [ ] **Step 1: Create reading time utility**

Create `src/utils/reading-time.ts`:

```ts
export function getReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 250);
  return `${minutes} min read`;
}
```

- [ ] **Step 2: Create `src/layouts/BlogPost.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  date: Date;
  tags: string[];
  readingTime: string;
}

const { title, date, tags, readingTime } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
});
---

<BaseLayout title={title}>
  <article>
    <header class="article-header">
      <div class="article-tags">
        {tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
      <h1>{title}</h1>
      <div class="article-meta">
        <img src="/images/headshot.png" alt="Prem Chandrasekaran" class="meta-avatar" />
        <span>Prem Chandrasekaran</span>
        <span class="meta-dot">&bull;</span>
        <span>{formattedDate}</span>
        <span class="meta-dot">&bull;</span>
        <span>{readingTime}</span>
      </div>
    </header>
    <div class="article-body">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  article {
    padding-top: 40px;
  }

  .article-header {
    margin-bottom: 32px;
  }

  .article-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 99px;
    background: var(--tag-bg);
    color: var(--accent);
    border: 1px solid var(--tag-border);
  }

  h1 {
    font-size: 36px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .meta-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .meta-dot {
    color: var(--border);
  }

  .article-body {
    max-width: 680px;
  }

  .article-body :global(p) {
    font-size: 17px;
    line-height: 1.8;
    margin-bottom: 20px;
    color: #292524;
  }

  .article-body :global(h2) {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  .article-body :global(h3) {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .article-body :global(ul),
  .article-body :global(ol) {
    padding-left: 1.5em;
    margin-bottom: 1.25rem;
    font-size: 17px;
    line-height: 1.8;
    color: #292524;
  }

  .article-body :global(li) {
    margin-bottom: 0.25rem;
  }

  .article-body :global(strong) {
    font-weight: 700;
  }
</style>
```

- [ ] **Step 3: Create `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';
import { getReadingTime } from '../../utils/reading-time';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await render(post);
const readingTime = getReadingTime(post.body ?? '');
---

<BlogPost
  title={post.data.title}
  date={post.data.date}
  tags={post.data.tags}
  readingTime={readingTime}
>
  <Content />
</BlogPost>
```

- [ ] **Step 4: Create `src/components/TagFilter.tsx`**

```tsx
import { useState } from 'react';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
}

interface Props {
  posts: Post[];
  allTags: string[];
}

export default function TagFilter({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts;

  return (
    <div>
      <div className="tag-filter-bar">
        <button
          className={`filter-tag ${activeTag === null ? 'active' : ''}`}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`filter-tag ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="posts-list">
        {filtered.map(post => (
          <a key={post.slug} href={`/blog/${post.slug}`} className="post-card">
            <div className="post-meta">
              <span className="post-date">{post.date}</span>
              <span className="post-meta-dot">&bull;</span>
              <span className="post-reading">{post.readingTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagFilter from '../../components/TagFilter.tsx';
import { getReadingTime } from '../../utils/reading-time';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const allTags = [...new Set(posts.flatMap(p => p.data.tags))].sort();

const postsForClient = posts.map(post => ({
  slug: post.id,
  title: post.data.title,
  date: post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  excerpt: post.data.excerpt,
  tags: post.data.tags,
  readingTime: getReadingTime(post.body ?? ''),
}));
---

<BaseLayout title="Blog" description="Writing about AI, engineering leadership, and software delivery.">
  <div class="blog-header">
    <h1>Blog</h1>
    <p>Writing about AI, engineering leadership, and what actually works in software delivery.</p>
  </div>
  <TagFilter client:load posts={postsForClient} allTags={allTags} />
</BaseLayout>

<style>
  .blog-header {
    padding: 40px 0 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .blog-header h1 {
    margin-bottom: 8px;
  }

  .blog-header p {
    color: var(--text-secondary);
    font-size: 16px;
  }
</style>
```

- [ ] **Step 6: Add TagFilter styles to global.css**

Append to `src/styles/global.css`:

```css
/* ── Tag Filter (React island) ── */
.tag-filter-bar {
  display: flex;
  gap: 8px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.filter-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 5px 14px;
  border-radius: 99px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.filter-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-tag.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.posts-list .post-card {
  display: block;
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
}

.posts-list .post-card:hover {
  background: rgba(13, 148, 136, 0.02);
  margin: 0 -16px;
  padding: 24px 16px;
  border-radius: 8px;
}

.posts-list .post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.posts-list .post-date,
.posts-list .post-reading {
  font-size: 13px;
  color: var(--text-secondary);
}

.posts-list .post-meta-dot {
  color: var(--border);
  font-size: 10px;
}

.posts-list h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.35;
}

.posts-list p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 680px;
}

.posts-list .post-tags {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}
```

- [ ] **Step 7: Run dev server and verify**

```bash
npx astro dev
```

Visit `http://localhost:4321/blog` — should show the blog listing with the one post and tag filter buttons.
Visit `http://localhost:4321/blog/ai-assisted-development` — should show the full article with header, metadata, and styled content.

- [ ] **Step 8: Commit**

```bash
git add src/utils/reading-time.ts src/layouts/BlogPost.astro src/pages/blog/ src/components/TagFilter.tsx src/styles/global.css
git commit -m "Add blog listing with tag filter and post pages

Blog listing page with React-based tag filtering.
Dynamic post pages with article layout, reading time, and metadata.
Reading time utility based on word count."
```

---

## Task 5: Complete the home page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/TalkCard.astro`
- Create: `src/data/talks.ts`

- [ ] **Step 1: Create `src/data/talks.ts`**

```ts
export interface Talk {
  title: string;
  event: string;
  date: string;
  description: string;
  url: string;
}

export const talks: Talk[] = [
  {
    title: 'AI-Assisted Development: What Actually Works',
    event: 'Conference Talk',
    date: '2026',
    description: 'Lessons from three real projects on where AI coding tools accelerate delivery — and where they just accelerate rework.',
    url: '/talks/ai-assisted-dev/',
  },
  {
    title: 'Graph-Powered Storyworlds',
    event: 'NODES AI 2026',
    date: '2026',
    description: 'Using Neo4j to keep 1M+ word LitRPG epics coherent with AI — knowledge graphs as narrative immune systems.',
    url: '/talks/graph-powered-storyworlds/',
  },
];
```

- [ ] **Step 2: Create `src/components/TalkCard.astro`**

```astro
---
interface Props {
  title: string;
  event: string;
  date: string;
  description: string;
  url: string;
}

const { title, event, date, description, url } = Astro.props;
---

<a href={url} class="talk-card">
  <div class="talk-event">{event}</div>
  <h3>{title}</h3>
  <p>{description}</p>
  <div class="talk-date">{date}</div>
</a>

<style>
  .talk-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    display: block;
  }

  .talk-card:hover {
    border-color: var(--accent);
    box-shadow: 0 2px 12px rgba(13, 148, 136, 0.08);
  }

  .talk-event {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
    line-height: 1.35;
  }

  p {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .talk-date {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 12px;
  }
</style>
```

- [ ] **Step 3: Update `src/pages/index.astro`**

Replace the entire file:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import TalkCard from '../components/TalkCard.astro';
import { talks } from '../data/talks';
import { getReadingTime } from '../utils/reading-time';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---

<BaseLayout title="Home">
  <section class="hero">
    <div class="hero-text">
      <h1>Engineering leader who writes about what actually works.</h1>
      <p>I build software, lead teams, and write about the gap between what tools promise and what they deliver. Currently Market Tech Director at Thoughtworks.</p>
    </div>
    <img src="/images/headshot.png" class="hero-image" alt="Prem Chandrasekaran" />
  </section>

  <div class="section-header">
    <h2>Latest Writing</h2>
    <a href="/blog">View all &rarr;</a>
  </div>
  <div class="posts">
    {posts.map(post => (
      <PostCard
        title={post.data.title}
        date={post.data.date}
        excerpt={post.data.excerpt}
        tags={post.data.tags}
        slug={post.id}
        readingTime={getReadingTime(post.body ?? '')}
      />
    ))}
  </div>

  <div class="section-header">
    <h2>Talks</h2>
    <a href="/talks">View all &rarr;</a>
  </div>
  <div class="talks-grid">
    {talks.map(talk => (
      <TalkCard
        title={talk.title}
        event={talk.event}
        date={talk.date}
        description={talk.description}
        url={talk.url}
      />
    ))}
  </div>
</BaseLayout>

<style>
  .hero {
    display: flex;
    align-items: center;
    gap: 48px;
    padding: 56px 0 48px;
  }

  .hero-text {
    flex: 1;
  }

  .hero-text h1 {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 12px;
  }

  .hero-text p {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 540px;
  }

  .hero-image {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 3px solid var(--border);
  }

  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 40px 0 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .section-header h2 {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-secondary);
  }

  .section-header a {
    font-size: 13px;
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  .talks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
</style>
```

- [ ] **Step 4: Run dev server and verify**

```bash
npx astro dev
```

Visit `http://localhost:4321`. Expected: hero section, latest blog posts section with the AI article, talks grid with both talk cards. Talk cards link to `/talks/ai-assisted-dev/` and `/talks/graph-powered-storyworlds/`.

- [ ] **Step 5: Commit**

```bash
git add src/data/talks.ts src/components/TalkCard.astro src/pages/index.astro
git commit -m "Complete home page with posts and talks sections

Home page shows hero, latest 3 blog posts, and talks grid.
Talk metadata stored in src/data/talks.ts.
TalkCard component for reuse on home and talks pages."
```

---

## Task 6: Talks page and About page

**Files:**
- Create: `src/pages/talks.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/talks.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TalkCard from '../components/TalkCard.astro';
import { talks } from '../data/talks';
---

<BaseLayout title="Talks" description="Conference talks and presentations by Prem Chandrasekaran.">
  <div class="talks-header">
    <h1>Talks</h1>
    <p>Conference talks and presentations on AI, engineering, and software delivery.</p>
  </div>
  <div class="talks-grid">
    {talks.map(talk => (
      <TalkCard
        title={talk.title}
        event={talk.event}
        date={talk.date}
        description={talk.description}
        url={talk.url}
      />
    ))}
  </div>
</BaseLayout>

<style>
  .talks-header {
    padding: 40px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }

  .talks-header h1 {
    margin-bottom: 8px;
  }

  .talks-header p {
    color: var(--text-secondary);
    font-size: 16px;
  }

  .talks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="About Prem Chandrasekaran — Market Tech Director at Thoughtworks.">
  <div class="about-layout">
    <div class="about-content">
      <h1>About</h1>

      <p>I'm Prem Chandrasekaran, a Market Tech Director at <a href="https://www.thoughtworks.com" target="_blank" rel="noopener noreferrer">Thoughtworks</a>. I build software, lead engineering teams, and write about the gap between what technology promises and what it actually delivers.</p>

      <h2>What I Write About</h2>
      <ul>
        <li><strong>AI-assisted development</strong> — what actually accelerates delivery and what just accelerates rework</li>
        <li><strong>Engineering leadership</strong> — the human systems around the technical systems</li>
        <li><strong>Domain-Driven Design</strong> — modeling complex domains, bounded contexts, and event-driven architectures</li>
        <li><strong>Knowledge graphs</strong> — using Neo4j and graph databases for AI memory and consistency</li>
      </ul>

      <h2>Current Projects</h2>
      <p>I'm building <strong>LitQuest</strong>, an AI-assisted authoring platform that uses Neo4j knowledge graphs to keep million-word fiction series internally consistent. I spoke about the architecture at NODES AI 2026.</p>

      <h2>Get in Touch</h2>
      <p>Find me on <a href="https://github.com/premanandc" target="_blank" rel="noopener noreferrer">GitHub</a> and <a href="https://linkedin.com/in/premanandc" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
    </div>
    <div class="about-image">
      <img src="/images/wordcloud.png" alt="Prem Chandrasekaran — word cloud portrait" />
    </div>
  </div>
</BaseLayout>

<style>
  .about-layout {
    display: flex;
    gap: 48px;
    padding: 40px 0;
    align-items: flex-start;
  }

  .about-content {
    flex: 1;
    max-width: 640px;
  }

  .about-content h1 {
    margin-bottom: 20px;
  }

  .about-content h2 {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }

  .about-content p {
    font-size: 17px;
    line-height: 1.8;
    margin-bottom: 16px;
    color: #292524;
  }

  .about-content ul {
    padding-left: 1.5em;
    margin-bottom: 1rem;
  }

  .about-content li {
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 8px;
    color: #292524;
  }

  .about-image {
    flex-shrink: 0;
    width: 280px;
  }

  .about-image img {
    width: 100%;
    border-radius: 12px;
  }
</style>
```

- [ ] **Step 3: Verify all pages**

```bash
npx astro dev
```

Visit:
- `http://localhost:4321/talks` — talks grid with both cards
- `http://localhost:4321/about` — about page with word-cloud image
- Click talk cards — should open the raw Reveal.js HTML presentations

- [ ] **Step 4: Commit**

```bash
git add src/pages/talks.astro src/pages/about.astro
git commit -m "Add talks listing and about pages

Talks page reuses TalkCard component with data from talks.ts.
About page with bio, expertise areas, and word-cloud portrait."
```

---

## Task 7: Shared Reveal.js theme

**Files:**
- Create: `public/talks/theme/premonition.css`

- [ ] **Step 1: Create `public/talks/theme/premonition.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

/*
 * Premonition — shared Reveal.js theme for premonition.dev
 *
 * Dark presentation theme with brand continuity to the light site.
 * Site: Editorial Light (warm stone background, teal/blue accents)
 * Talks: Dark (deep navy, same teal/blue accents, same typography)
 */

:root {
  --r-background-color: #0f1729;
  --r-main-font: 'Inter', system-ui, sans-serif;
  --r-heading-font: 'Inter', system-ui, sans-serif;
  --r-code-font: 'JetBrains Mono', monospace;
  --r-main-font-size: 28px;
  --r-main-color: #e2e8f0;
  --r-heading-color: #ffffff;
  --r-link-color: #0d9488;
  --r-link-color-hover: #2dd4bf;
  --r-selection-background-color: rgba(13, 148, 136, 0.3);
  --r-selection-color: #fff;

  --accent: #0d9488;
  --accent2: #2563eb;
  --muted: #94a3b8;
  --surface: #1a2332;
  --dim: #475569;
}

.reveal {
  font-family: var(--r-main-font);
}

.reveal .slides section {
  text-align: left;
}

/* ── Typography ── */
.reveal h1 { font-weight: 900; font-size: 2.2em; line-height: 1.1; text-transform: none; color: var(--r-heading-color); margin: 0 0 0.25em; }
.reveal h2 { font-weight: 700; font-size: 1.5em; color: var(--accent); text-transform: none; margin: 0 0 0.6em; line-height: 1.2; }
.reveal h3 { font-weight: 600; font-size: 0.9em; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.4em; }
.reveal p  { line-height: 1.6; margin: 0.25em 0; }

/* ── Utility classes ── */
.accent  { color: var(--accent); }
.blue    { color: var(--accent2); }
.muted   { color: var(--muted); }
.white   { color: #fff; }
.small   { font-size: 0.7em; }
.bold    { font-weight: 700; }
.center  { text-align: center; }

/* ── Cards ── */
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px 28px;
  margin: 10px 0;
}

.card-accent { border-left: 4px solid var(--accent); }
.card-blue   { border-left: 4px solid var(--accent2); }

.card h4 {
  margin: 0 0 8px;
  font-size: 0.9em;
  font-weight: 700;
  color: #fff;
}

.card p {
  margin: 0;
  font-size: 0.75em;
  color: var(--muted);
  line-height: 1.55;
}

/* ── Layout ── */
.two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: start; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-items: start; }

/* ── Stats ── */
.stat-row  { display: flex; justify-content: center; gap: 60px; margin: 30px 0; }
.stat-item { text-align: center; }
.stat-number { font-size: 3.2em; font-weight: 900; line-height: 1; margin-bottom: 8px; }
.stat-label  { font-size: 0.65em; color: var(--muted); max-width: 200px; margin: 0 auto; }

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Code ── */
.reveal pre {
  font-family: var(--r-code-font);
  font-size: 0.55em;
  line-height: 1.6;
  background: #141e30;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: none;
}
```

- [ ] **Step 2: Verify the theme file is accessible**

```bash
npx astro dev
```

Visit `http://localhost:4321/talks/theme/premonition.css` — should serve the CSS file.

Note: Migrating the existing presentations to use this shared theme is a separate effort. The presentations currently work with their inline/bundled styles. The shared theme is available at `/talks/theme/premonition.css` for new presentations and for future migration of existing ones.

- [ ] **Step 3: Commit**

```bash
git add public/talks/theme/premonition.css
git commit -m "Add shared Reveal.js brand theme

premonition.css provides brand-consistent dark theme for presentations.
Same Inter + JetBrains Mono typography, teal/blue accent colors.
Available at /talks/theme/premonition.css for all decks."
```

---

## Task 8: GitHub Actions deploy pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify build succeeds locally**

```bash
npm run build
```

Expected: Build completes. `dist/` directory created with static output. Check that `dist/talks/ai-assisted-dev/index.html` exists (confirms talks are passed through from `public/`).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for Pages deployment

Builds Astro on push to main, deploys to GitHub Pages.
Uses upload-pages-artifact and deploy-pages actions."
```

---

## Task 9: Final verification and first deploy

- [ ] **Step 1: Full build check**

```bash
npm run build && npx astro preview
```

Visit `http://localhost:4321` and verify all pages:
- `/` — Home with hero, posts, talks
- `/blog` — Blog listing with tag filter
- `/blog/ai-assisted-development` — Full article renders correctly
- `/talks` — Talks listing
- `/talks/ai-assisted-dev/` — Reveal.js presentation loads
- `/talks/graph-powered-storyworlds/` — Reveal.js presentation loads
- `/about` — About page with word-cloud image

- [ ] **Step 2: Check that CNAME is preserved in build output**

```bash
ls dist/CNAME
```

Expected: `CNAME` file exists in `dist/` (Astro copies files from repo root that are needed — but CNAME needs to be in `public/`). If missing, copy `CNAME` to `public/CNAME`:

```bash
cp CNAME public/CNAME
```

Then rebuild and verify `dist/CNAME` exists.

- [ ] **Step 3: Commit if CNAME was copied**

```bash
git add public/CNAME
git commit -m "Copy CNAME to public/ for Astro build output"
```

- [ ] **Step 4: Verify GitHub Pages source setting**

In the GitHub repo settings (Settings > Pages), ensure **Source** is set to **GitHub Actions** (not "Deploy from a branch"). This is required for the `deploy-pages` action to work.

- [ ] **Step 5: Push to main and verify deployment**

```bash
git push origin main
```

Monitor the Actions tab on GitHub. Expected: workflow runs, build succeeds, deployment succeeds. Visit `https://premonition.dev` and verify the site is live.
