import { useEffect } from 'react';
import { buildFeedbackUrl } from '../../utils/feedback';

interface Props {
  slug: string;
  title: string;
}

const ANCHOR_CLASS = 'feedback-anchor';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function DraftFeedbackAnchors({ slug, title }: Props) {
  useEffect(() => {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    const headings = articleBody.querySelectorAll<HTMLElement>('h2, h3');
    const added: HTMLAnchorElement[] = [];

    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = slugify(heading.textContent ?? '');
      }
      if (heading.querySelector(`.${ANCHOR_CLASS}`)) return;

      const sectionText = heading.textContent ?? '';
      const link = document.createElement('a');
      link.className = ANCHOR_CLASS;
      link.href = buildFeedbackUrl({
        slug,
        title,
        sectionId: heading.id,
        sectionText,
      });
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `Send feedback on "${sectionText}"`);
      link.title = 'Send feedback on this section';
      link.textContent = '\u{1F4AC}';

      heading.appendChild(document.createTextNode(' '));
      heading.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => {
        const prev = link.previousSibling;
        if (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent === ' ') {
          prev.parentNode?.removeChild(prev);
        }
        link.parentNode?.removeChild(link);
      });
    };
  }, [slug, title]);

  return null;
}
