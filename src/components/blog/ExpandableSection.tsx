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
