const REPO = 'premanandc/premanandc.github.io';
const SITE_URL = 'https://premonition.dev';
const TEMPLATE = 'draft-feedback.md';
const LABEL = 'draft-feedback';

interface BuildFeedbackUrlOptions {
  slug: string;
  title: string;
  sectionId?: string;
  sectionText?: string;
}

export function buildFeedbackUrl({ slug, title, sectionId, sectionText }: BuildFeedbackUrlOptions): string {
  const draftUrl = `${SITE_URL}/blog/${slug}/`;

  const issueTitle = sectionId
    ? `Draft feedback: ${slug}#${sectionId}`
    : `Draft feedback: ${slug}`;

  const bodyLines = [`**Draft:** [${title}](${draftUrl})`];
  if (sectionId && sectionText) {
    bodyLines.push(`**Section:** [${sectionText}](${draftUrl}#${sectionId})`);
  }
  bodyLines.push(
    '',
    '### What worked',
    '',
    '',
    '### What needs work',
    '',
    '',
    '### Specific suggestions',
    '',
    ''
  );

  const params = new URLSearchParams({
    template: TEMPLATE,
    title: issueTitle,
    body: bodyLines.join('\n'),
    labels: LABEL,
  });

  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
