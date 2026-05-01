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
