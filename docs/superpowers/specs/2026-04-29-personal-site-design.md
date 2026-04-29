# premonition.dev — Personal Site Design Spec

## Overview

Replace the placeholder Jekyll site at `premanandc.github.io` with a modern Astro + React site serving as Prem Chandrasekaran's personal online presence. Domain: `premonition.dev`. Deployed to GitHub Pages via GitHub Actions on push to `main`.

## Priority Order

1. Technical blog (long-form writing)
2. Portfolio / personal brand (talks, projects, books)
3. Digital garden (future — interconnected notes and references)

## Framework & Architecture

- **Astro** with `@astrojs/react` integration for interactive islands
- **Content collections** for blog posts (Markdown/MDX, type-safe frontmatter)
- **React components** for interactive features (tag filtering, search, future interactive elements)
- **Reveal.js presentations** served as static HTML from `public/talks/`, sharing a custom brand theme
- **GitHub Actions** deploys to GitHub Pages on push to `main`

## Project Structure

```
premanandc.github.io/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── CNAME                               ← managed by GitHub, do not edit manually
├── .github/
│   └── workflows/
│       └── deploy.yml                  ← build Astro → deploy to GitHub Pages
├── public/
│   ├── images/
│   │   ├── headshot.png                ← professional headshot
│   │   └── wordcloud.png              ← word-cloud portrait (about page)
│   └── talks/
│       ├── theme/
│       │   └── premonition.css         ← shared Reveal.js brand theme
│       ├── ai-assisted-dev/
│       │   └── index.html              ← standalone deck, imports shared theme
│       └── graph-powered-storyworlds/
│           ├── index.html
│           ├── style.css               ← talk-specific overrides
│           └── images/
├── src/
│   ├── components/                     ← Astro + React components
│   ├── layouts/
│   │   ├── BaseLayout.astro            ← shell: head, nav, footer
│   │   └── BlogPost.astro             ← article layout with metadata, reading time
│   ├── pages/
│   │   ├── index.astro                 ← Home
│   │   ├── about.astro                 ← About
│   │   ├── talks.astro                 ← Talks listing
│   │   └── blog/
│   │       └── [...slug].astro         ← Dynamic blog post routes
│   ├── content/
│   │   └── blog/
│   │       └── ai-assisted-development.md
│   └── styles/
│       └── global.css                  ← Editorial Light theme tokens
```

## Pages

### Home (`/`)

- Brief intro: name, role, one-liner
- Professional headshot (circular, 140px)
- Latest 3 blog posts (title, date, reading time, excerpt, tags)
- Featured talks section (card grid with title, event, date, description)
- Content-forward, editorial — no hero banner theatrics

### Blog (`/blog`)

- Chronological post listing with tags
- Each post: title, date, reading time, excerpt, tags
- Tag filtering via React island (client-side)
- Individual post pages (`/blog/[slug]`): article header (title, date, reading time, tags), full markdown content, author byline with headshot

### Talks (`/talks`)

- Card grid — each talk has title, event name, date, brief description
- Cards link directly to Reveal.js decks (`/talks/[slug]/`)
- Presentations open as standalone full pages, not embedded in Astro layout

### About (`/about`)

- Who you are, what you do (Market Tech Director at Thoughtworks)
- Word-cloud portrait as signature visual
- Areas of expertise / interests
- Links to social profiles (GitHub, LinkedIn)
- Contact info

### Future: Books

- Will need a books section or dedicated page
- One published book, one in progress — details TBD

### Future: Digital Garden

- Interconnected notes and references
- Lower priority, to be designed when needed

## Visual Design: Editorial Light

### Typography

- **Headings:** Inter, 700/800 weight
- **Body:** Inter, 400 weight
- **Code:** JetBrains Mono, 400/500 weight

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#fafaf9` | Page background (warm stone) |
| `--bg-surface` | `#ffffff` | Cards, post containers |
| `--text-primary` | `#1c1917` | Headings, body text |
| `--text-secondary` | `#78716c` | Dates, excerpts, metadata |
| `--accent` | `#0d9488` | Links, tags, active states (teal) |
| `--accent-secondary` | `#2563eb` | Secondary highlights, hover (blue) |
| `--border` | `#e7e5e4` | Card borders, dividers |
| `--code-bg` | `#1c1917` | Code blocks (dark) |
| `--tag-bg` | `rgba(13, 148, 136, 0.08)` | Tag background tint |
| `--tag-border` | `rgba(13, 148, 136, 0.2)` | Tag border |

### Key Visual Decisions

- Code blocks are dark (`--code-bg`) — matches talk themes, standard for technical content
- Cards use subtle borders and light shadows, not heavy containers
- Generous whitespace for long-form readability
- Tags use teal tint pills
- Navigation: horizontal nav at desktop, headshot as circular avatar next to name
- No dark mode at launch (can be added later)

## Reveal.js Shared Theme (`premonition.css`)

- Dark background: `#0f1729` (from existing AI talk)
- Same Inter + JetBrains Mono typography as the site
- Accent colors (`--accent`, `--accent-secondary`) carry into slide theme
- Brand continuity: site is light for reading, presentations are dark for projection, typeface and color accents are the same family
- Each presentation imports the shared theme and can add talk-specific overrides

## Deployment

- **GitHub Actions** workflow triggered on push to `main`
- Builds Astro project, outputs static files
- Deploys to GitHub Pages
- Custom domain `premonition.dev` (CNAME managed by GitHub Pages settings)
- `www.premonition.dev` redirects to `premonition.dev` automatically

## Content at Launch

- **1 blog post:** "I Code 10x Faster. We Ship at the Same Speed." (migrated from `arc-of-ai/ai-assisted-development-article.md`)
- **2 Reveal.js presentations:**
  - "AI-Assisted Development: What Actually Works"
  - "Graph-Powered Storyworlds" (NODES AI 2026)
- **Future migration:** Posts from ddd-practitioners.com

## Technical Notes

- CNAME file is managed by GitHub Pages settings — never edit manually (causes certificate warnings)
- `.superpowers/` directory must be in `.gitignore`
- Talks in `public/` are served as raw static HTML, not processed by Astro
- React is available via `@astrojs/react` for interactive islands but most pages are static Astro components
