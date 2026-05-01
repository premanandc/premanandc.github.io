# Interactive Blog Elements (MDX + React Components) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MDX support and 4 reusable React components to blog posts, making articles interactive and visually rich.

**Architecture:** Install `@astrojs/mdx` integration so `.mdx` blog posts can embed React components inline. Create a library of blog-specific React components (Callout, ExpandableSection, CodeComparison, CopyCodeBlock) as islands that hydrate on visibility. Convert the existing article to `.mdx` as proof of concept.

**Tech Stack:** Astro 5, @astrojs/mdx, React 19, TypeScript

**Parent issue:** https://github.com/premanandc/premanandc.github.io/issues/1

---

## File Map

### New files

```
src/components/blog/Callout.tsx              ← styled aside boxes (info, warning, tip, insight)
src/components/blog/ExpandableSection.tsx     ← click-to-reveal deep dives
src/components/blog/CodeComparison.tsx        ← side-by-side before/after code blocks
src/components/blog/CopyCodeBlock.tsx         ← code block with copy-to-clipboard button
```

### Files to modify

```
package.json                                 ← add @astrojs/mdx
astro.config.mjs                             ← add mdx() integration
src/content.config.ts                        ← glob pattern **/*.md → **/*.{md,mdx}
src/styles/global.css                        ← add blog component CSS vars and styles
src/content/blog/ai-assisted-development.md  ← RENAME to .mdx, add component usage
```

---

## Task 1: Install MDX and update content config

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `src/content.config.ts`

- [ ] **Step 1: Install `@astrojs/mdx`**

```bash
npm install @astrojs/mdx
```

- [ ] **Step 2: Add `mdx()` to Astro config**

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://premonition.dev',
  integrations: [react(), mdx()],
  output: 'static',
});
```

- [ ] **Step 3: Update content collection glob pattern**

In `src/content.config.ts`, change the glob pattern from `**/*.md` to `**/*.{md,mdx}`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 4: Verify build still works**

```bash
npm run build
```

Expected: 5 pages built, no errors. The existing `.md` file still works with the updated glob.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/content.config.ts
git commit -m "Add MDX support to blog content collection

Install @astrojs/mdx, add to integrations.
Update content collection glob to accept .md and .mdx files."
```

---

## Task 2: Callout component

**Files:**
- Create: `src/components/blog/Callout.tsx`
- Modify: `src/styles/global.css` (add callout styles)

- [ ] **Step 1: Add callout CSS variables and styles to `global.css`**

Append to the end of `src/styles/global.css`:

```css
/* ── Blog Components ── */
:root {
  --callout-info-bg: rgba(13, 148, 136, 0.06);
  --callout-info-border: #0d9488;
  --callout-warning-bg: rgba(217, 119, 6, 0.06);
  --callout-warning-border: #d97706;
  --callout-tip-bg: rgba(37, 99, 235, 0.06);
  --callout-tip-border: #2563eb;
  --callout-insight-bg: rgba(124, 58, 237, 0.06);
  --callout-insight-border: #7c3aed;
}

.callout {
  border-left: 3px solid var(--callout-info-border);
  background: var(--callout-info-bg);
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
  margin: 24px 0;
  max-width: 680px;
}

.callout-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  color: var(--callout-info-border);
}

.callout-content {
  font-size: 16px;
  line-height: 1.7;
  color: #292524;
}

.callout-content p {
  margin: 0;
}

.callout-content p + p {
  margin-top: 8px;
}

.callout.warning {
  border-left-color: var(--callout-warning-border);
  background: var(--callout-warning-bg);
}

.callout.warning .callout-label {
  color: var(--callout-warning-border);
}

.callout.tip {
  border-left-color: var(--callout-tip-border);
  background: var(--callout-tip-bg);
}

.callout.tip .callout-label {
  color: var(--callout-tip-border);
}

.callout.insight {
  border-left-color: var(--callout-insight-border);
  background: var(--callout-insight-bg);
}

.callout.insight .callout-label {
  color: var(--callout-insight-border);
}
```

- [ ] **Step 2: Create `src/components/blog/Callout.tsx`**

```tsx
import type { ReactNode } from 'react';

interface Props {
  variant?: 'info' | 'warning' | 'tip' | 'insight';
  label?: string;
  children: ReactNode;
}

const defaultLabels: Record<string, string> = {
  info: 'Note',
  warning: 'Warning',
  tip: 'Tip',
  insight: 'Key Insight',
};

export default function Callout({ variant = 'info', label, children }: Props) {
  const displayLabel = label ?? defaultLabels[variant];

  return (
    <aside className={`callout ${variant}`}>
      <div className="callout-label">{displayLabel}</div>
      <div className="callout-content">{children}</div>
    </aside>
  );
}
```

- [ ] **Step 3: Verify the component renders**

Create a quick test by temporarily adding a minimal `.mdx` file. Create `src/content/blog/test-mdx.mdx`:

```mdx
---
title: "MDX Test"
date: 2026-01-01
excerpt: "Testing MDX"
tags: ["test"]
draft: true
---

import Callout from '../../components/blog/Callout.tsx';

# Test

<Callout variant="info">This is an info callout.</Callout>

<Callout variant="warning">This is a warning callout.</Callout>

<Callout variant="tip">This is a tip callout.</Callout>

<Callout variant="insight">This is a key insight callout.</Callout>
```

```bash
npm run build
```

Expected: Build succeeds. The test post is excluded from output because `draft: true`, but it validates that MDX + React component rendering works. Delete the test file after verification.

```bash
rm src/content/blog/test-mdx.mdx
```

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/Callout.tsx src/styles/global.css
git commit -m "Add Callout blog component

Four variants: info (teal), warning (amber), tip (blue), insight (purple).
Renders as styled aside boxes in MDX blog posts."
```

---

## Task 3: ExpandableSection component

**Files:**
- Create: `src/components/blog/ExpandableSection.tsx`
- Modify: `src/styles/global.css` (add expandable section styles)

- [ ] **Step 1: Add expandable section styles to `global.css`**

Append to `src/styles/global.css`:

```css
.expandable {
  border: 1px solid var(--border);
  border-radius: 8px;
  margin: 24px 0;
  max-width: 680px;
  overflow: hidden;
}

.expandable-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 20px;
  background: var(--bg-surface);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  transition: background 0.15s;
}

.expandable-trigger:hover {
  background: var(--bg);
}

.expandable-arrow {
  font-size: 12px;
  color: var(--accent);
  transition: transform 0.2s;
}

.expandable-arrow.open {
  transform: rotate(90deg);
}

.expandable-body {
  padding: 0 20px 16px;
  font-size: 16px;
  line-height: 1.7;
  color: #292524;
}

.expandable-body p {
  margin: 0 0 8px;
}
```

- [ ] **Step 2: Create `src/components/blog/ExpandableSection.tsx`**

```tsx
import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function ExpandableSection({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="expandable">
      <button
        className="expandable-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={`expandable-arrow ${isOpen ? 'open' : ''}`}>&#9654;</span>
      </button>
      {isOpen && (
        <div className="expandable-body">
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/ExpandableSection.tsx src/styles/global.css
git commit -m "Add ExpandableSection blog component

Click-to-reveal sections for deep dives in blog posts.
Smooth toggle with arrow indicator and aria-expanded."
```

---

## Task 4: CodeComparison component

**Files:**
- Create: `src/components/blog/CodeComparison.tsx`
- Modify: `src/styles/global.css` (add code comparison styles)

- [ ] **Step 1: Add code comparison styles to `global.css`**

Append to `src/styles/global.css`:

```css
.code-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 24px 0;
  max-width: 680px;
}

.code-comparison-panel {
  min-width: 0;
}

.code-comparison-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 6px;
  padding-left: 4px;
}

.code-comparison-panel pre {
  font-size: 12px;
  padding: 16px;
  margin: 0;
}

@media (max-width: 640px) {
  .code-comparison {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create `src/components/blog/CodeComparison.tsx`**

```tsx
import type { ReactNode } from 'react';

interface Props {
  beforeLabel?: string;
  afterLabel?: string;
  before: ReactNode;
  after: ReactNode;
}

export default function CodeComparison({
  beforeLabel = 'Before',
  afterLabel = 'After',
  before,
  after,
}: Props) {
  return (
    <div className="code-comparison">
      <div className="code-comparison-panel">
        <div className="code-comparison-label">{beforeLabel}</div>
        <div>{before}</div>
      </div>
      <div className="code-comparison-panel">
        <div className="code-comparison-label">{afterLabel}</div>
        <div>{after}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/CodeComparison.tsx src/styles/global.css
git commit -m "Add CodeComparison blog component

Side-by-side code blocks with before/after labels.
Responsive: stacks vertically on mobile."
```

---

## Task 5: CopyCodeBlock component

**Files:**
- Create: `src/components/blog/CopyCodeBlock.tsx`
- Modify: `src/styles/global.css` (add copy code block styles)

- [ ] **Step 1: Add copy code block styles to `global.css`**

Append to `src/styles/global.css`:

```css
.copy-code-block {
  position: relative;
  margin: 24px 0;
  max-width: 680px;
}

.copy-code-block pre {
  margin: 0;
}

.copy-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #141e30;
  padding: 8px 16px;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.copy-code-header + pre {
  border-radius: 0 0 10px 10px;
}

.copy-code-filename {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #94a3b8;
}

.copy-code-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 11px;
  color: #94a3b8;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.copy-code-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.copy-code-btn.copied {
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 2: Create `src/components/blog/CopyCodeBlock.tsx`**

```tsx
import { useState, useRef, type ReactNode } from 'react';

interface Props {
  filename?: string;
  children: ReactNode;
}

export default function CopyCodeBlock({ filename, children }: Props) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const codeElement = codeRef.current?.querySelector('code');
    if (!codeElement) return;

    await navigator.clipboard.writeText(codeElement.textContent ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copy-code-block">
      <div className="copy-code-header">
        <span className="copy-code-filename">{filename ?? ''}</span>
        <button className={`copy-code-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div ref={codeRef}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/CopyCodeBlock.tsx src/styles/global.css
git commit -m "Add CopyCodeBlock blog component

Code blocks with filename label and copy-to-clipboard button.
Dark header bar matches code block theme."
```

---

## Task 6: Convert existing article to MDX

**Files:**
- Rename: `src/content/blog/ai-assisted-development.md` → `src/content/blog/ai-assisted-development.mdx`
- Modify: the renamed file to add component imports and usage

- [ ] **Step 1: Rename the file**

```bash
mv src/content/blog/ai-assisted-development.md src/content/blog/ai-assisted-development.mdx
```

- [ ] **Step 2: Add component imports after the frontmatter**

Add these import lines immediately after the closing `---` of the frontmatter:

```mdx
import Callout from '../../components/blog/Callout.tsx';
import ExpandableSection from '../../components/blog/ExpandableSection.tsx';
```

- [ ] **Step 3: Add a Callout around the thesis statement**

Find the paragraph that starts with "But the industry narrative conflates..." (the bold thesis statement). Wrap it with a Callout:

Replace:

```markdown
But the industry narrative conflates "coding faster" with "delivering faster," and my experience across these three projects tells a different story. **AI coding tools accelerate delivery when the work before coding (requirements, design, architecture) is settled AND the work after coding (reviews, testing, deployment) is consistent and representable in the coding process. When either side breaks down, faster coding doesn't translate to faster delivery, it translates to faster rework.**
```

With:

```mdx
But the industry narrative conflates "coding faster" with "delivering faster," and my experience across these three projects tells a different story.

<Callout variant="insight" label="The Two-Sided Formula" client:visible>
AI coding tools accelerate delivery when the work before coding (requirements, design, architecture) is settled AND the work after coding (reviews, testing, deployment) is consistent and representable in the coding process. When either side breaks down, faster coding doesn't translate to faster delivery, it translates to faster rework.
</Callout>
```

- [ ] **Step 4: Add a Callout around the "illusion of progress" insight**

Find the paragraph in "The Illusion of Progress" section that starts with "**The AI tools masked the problem...**". Wrap it:

Replace:

```markdown
**The AI tools masked the problem by making rework cheap enough to seem productive.** The team was always moving fast — just not always forward. In 10 working weeks, coding was 10-15% of the time, and much of that coding was done more than once.
```

With:

```mdx
<Callout variant="warning" label="The Illusion of Progress" client:visible>
The AI tools masked the problem by making rework cheap enough to seem productive. The team was always moving fast — just not always forward. In 10 working weeks, coding was 10-15% of the time, and much of that coding was done more than once.
</Callout>
```

- [ ] **Step 5: Add a Callout around the final arithmetic**

Find the paragraph near the end that starts with "The arithmetic doesn't lie." Wrap it:

Replace:

```markdown
The arithmetic doesn't lie. If coding is 10-15% of your delivery time, a 10x improvement in coding speed gets you — at most — a 15% improvement in delivery. The other 85% is requirements, architecture, coordination, review, dependencies, and waiting.
```

With:

```mdx
<Callout variant="info" label="The Arithmetic" client:visible>
If coding is 10-15% of your delivery time, a 10x improvement in coding speed gets you — at most — a 15% improvement in delivery. The other 85% is requirements, architecture, coordination, review, dependencies, and waiting.
</Callout>
```

- [ ] **Step 6: Add an ExpandableSection around Claude Code specifics**

Find the section "### Where Claude Code Had an Edge". Wrap the content (from **Skills** through the end of **Hooks**) in an ExpandableSection:

Replace:

```markdown
### Where Claude Code Had an Edge

Claude Code offered constructs that Copilot seemed to lack at the time of writing (Copilot's January 2026 release may close some gaps):

**Skills** are markdown files encoding domain expertise...
...
**Hooks** played a supporting role, triggering actions on events like auto-formatting and pre-commit checks after every *logical* change was completed.
```

With:

```mdx
### Where Claude Code Had an Edge

Claude Code offered constructs that Copilot seemed to lack at the time of writing (Copilot's January 2026 release may close some gaps):

<ExpandableSection title="Skills, Subagents, Plan Mode, and Hooks — click to expand" client:load>

**Skills** are markdown files encoding domain expertise that persist across sessions. On the Java project, I created six testing skills: unit tests, Testcontainers, Spring REST Docs, ArchUnit, BDD with Cucumber and Playwright, and JMH with Gatling. Each skill codified the conventions and patterns a senior engineer would bring to that specific testing type: not just "write a test," but "write a test *the way this project writes tests*." Skills live in the project repository, so any developer using Claude Code gets the same quality guardrails.

**Subagents** allow spawning background agents for parallel, isolated work. On the Java project, I built three custom agents:

1. A *coverage analyst* that scanned the codebase for meaningful test gaps: not line coverage metrics, but actual untested behavior prioritized by cyclomatic complexity.
2. A *test scaffolder* that set up infrastructure: Testcontainers base classes, Maven source sets, plugin configurations.
3. A *database migration test writer* that read all Liquibase changesets and generated a test for each one.

These ran as background tasks while I continued working in the foreground. The analyst produced a prioritized report: 14 untested service methods, 8 undocumented endpoints, 3 untested native queries, 2 architecture violations. Subagents handled the scale problem without exhausting the context window. Each operated in isolation with its own context.

**Plan mode** switches to exploration and planning before committing to code. I used it across all three projects to evaluate multiple approaches in parallel, which naturally triggered subagent spawning. It prevented premature implementation, which is ironic given that premature implementation turned out to be a recurring problem on the other projects.

**Hooks** played a supporting role, triggering actions on events like auto-formatting and pre-commit checks after every *logical* change was completed.

</ExpandableSection>
```

- [ ] **Step 7: Verify build and preview**

```bash
npm run build
npx astro preview
```

Visit `http://localhost:4321/blog/ai-assisted-development`. Expected:
- Teal "Key Insight" callout around the thesis
- Amber "Warning" callout around the illusion of progress paragraph
- Teal "Note" callout around the arithmetic
- Expandable section for Claude Code details (collapsed by default, expands on click)
- All other content renders normally

- [ ] **Step 8: Commit**

```bash
git add src/content/blog/ai-assisted-development.mdx
git rm src/content/blog/ai-assisted-development.md
git commit -m "Convert AI article to MDX with interactive components

Rename .md to .mdx. Add Callout boxes around key insights:
- thesis statement (insight variant)
- illusion of progress (warning variant)
- final arithmetic (info variant)
Add ExpandableSection for Claude Code details."
```

---

## Task 7: Final verification and push

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: 5 pages built, no errors.

- [ ] **Step 2: Preview all pages**

```bash
npx astro preview
```

Verify:
- `/` — home page still renders, post card for the article works
- `/blog` — blog listing with tag filter works
- `/blog/ai-assisted-development` — article renders with Callouts and ExpandableSection
- `/talks`, `/about` — unchanged, still work

- [ ] **Step 3: Push**

```bash
git push origin main
```

Monitor GitHub Actions. Verify deployment at https://premonition.dev/blog/ai-assisted-development.
