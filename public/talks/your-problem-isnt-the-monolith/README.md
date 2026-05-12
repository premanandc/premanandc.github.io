# Your Problem Isn't the Monolith. It's the Data.

LDX3 London, June 2026. 28 slides, ~25 minutes of talk.

## Files

- `index.html` — the deck (Reveal.js v5.1.0 from CDN)
- `theme.css` — color tokens, typography, base Reveal overrides
- `slides.css` — slide template styles (dark, thesis, big-number, content, code, diagram, image-bg)
- `images/metaphor/` — full-bleed and background images (17 expected)
- `images/diagrams/` — architecture diagrams (7 expected)

## Status

Currently **unlisted**. Listed only at `/talks/drafts`. Flip the `unlisted` flag in `src/data/talks.ts` when ready to publish.

## Images

The deck renders with placeholders when images are missing. To add an image:

- Metaphor images go in `images/metaphor/` named `NN-description.jpg` (e.g., `01-title.jpg`, `04-rot.jpg`). See the deck plan for image prompts.
- Diagrams go in `images/diagrams/` named per the references in `index.html` (e.g., `06-penultimate-year-4.svg`, `16a-before.svg`, `16b-after.svg`). SVG preferred for crispness at projection.

## Local preview

The deck is served as part of premonition.dev via `npm run dev` or `npm run build && npm run preview` from the repo root.

Direct URL: `/talks/your-problem-isnt-the-monolith/`

Keyboard shortcuts:
- `S` — speaker view (notes, timer, next slide)
- `F` — fullscreen
- `Esc` — slide overview
- `?` — show all shortcuts

## PDF export (backup deck)

Open the deck in Chrome with `?print-pdf` appended:

```
http://localhost:4321/talks/your-problem-isnt-the-monolith/?print-pdf
```

Then Cmd+P → Save as PDF, Margins: None, Background graphics: Enabled.

## Source documents

The content comes from `~/Downloads/ldx3-deck-plan.md` and the visual spec from `~/Downloads/ldx3-revealjs-spec.md`. Those are the canonical sources; this deck is the implementation.
