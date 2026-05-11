import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchResult {
  url: string;
  meta: { title: string };
  excerpt: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<any>(null);

  const loadPagefind = useCallback(async () => {
    if (pagefindRef.current) return;
    try {
      // @ts-expect-error - Pagefind is generated at build time and resolved at runtime
      pagefindRef.current = await import(/* @vite-ignore */ '/pagefind/pagefind.js');
      await pagefindRef.current.init();
    } catch {
      // Pagefind not available (dev mode without index)
    }
  }, []);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (!value.trim() || !pagefindRef.current) {
      setResults([]);
      return;
    }
    const search = await pagefindRef.current.debouncedSearch(value);
    if (!search) return;
    const items = await Promise.all(
      search.results.slice(0, 8).map((r: any) => r.data())
    );
    setResults(items);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPagefind();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, loadPagefind]);

  // Pagefind excerpts contain <mark> tags for highlighting search matches.
  // This is safe: Pagefind generates these excerpts from our own static build
  // output — there is no user-supplied or external content involved.
  const renderExcerpt = (html: string) => {
    return { __html: html };
  };

  return (
    <>
      <button className="search-trigger" onClick={() => setIsOpen(true)} aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="search-shortcut">
          <kbd>{navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'}</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      {isOpen && (
        <div className="search-overlay" onClick={() => setIsOpen(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search articles, talks, pages..."
                value={query}
                onChange={e => handleSearch(e.target.value)}
              />
              <kbd className="search-esc">Esc</kbd>
            </div>
            {results.length > 0 && (
              <ul className="search-results">
                {results.map((result, i) => (
                  <li key={i}>
                    <a href={result.url} className="search-result">
                      <span className="search-result-title">{result.meta.title}</span>
                      <span
                        className="search-result-excerpt"
                        dangerouslySetInnerHTML={renderExcerpt(result.excerpt)}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {query && results.length === 0 && (
              <div className="search-empty">No results for "{query}"</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
