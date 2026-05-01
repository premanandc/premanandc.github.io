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
