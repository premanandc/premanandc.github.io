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
