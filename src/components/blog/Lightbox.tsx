import { useState, useEffect } from 'react';

interface ActiveImage {
  src: string;
  alt: string;
}

export default function Lightbox() {
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);

  useEffect(() => {
    const imageHandlers = new Map<HTMLImageElement, (e: MouseEvent) => void>();
    const linkHandlers = new Map<HTMLAnchorElement, (e: MouseEvent) => void>();
    const imageExtensions = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

    const imageTargets = document.querySelectorAll<HTMLImageElement>(
      '.cover-image, .article-body img'
    );
    imageTargets.forEach((img) => {
      img.style.cursor = 'zoom-in';
      const handler = (e: MouseEvent) => {
        e.preventDefault();
        setActiveImage({ src: img.src, alt: img.alt });
      };
      img.addEventListener('click', handler);
      imageHandlers.set(img, handler);
    });

    const linkTargets = document.querySelectorAll<HTMLAnchorElement>(
      '.article-body a[href]'
    );
    linkTargets.forEach((link) => {
      if (!imageExtensions.test(link.getAttribute('href') ?? '')) return;
      const handler = (e: MouseEvent) => {
        e.preventDefault();
        setActiveImage({ src: link.href, alt: link.textContent ?? '' });
      };
      link.addEventListener('click', handler);
      linkHandlers.set(link, handler);
    });

    return () => {
      imageHandlers.forEach((handler, img) => {
        img.removeEventListener('click', handler);
        img.style.cursor = '';
      });
      linkHandlers.forEach((handler, link) => {
        link.removeEventListener('click', handler);
      });
    };
  }, []);

  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  if (!activeImage) return null;

  return (
    <div className="lightbox-overlay" onClick={() => setActiveImage(null)}>
      <button
        className="lightbox-close"
        onClick={() => setActiveImage(null)}
        aria-label="Close"
      >
        ×
      </button>
      <img
        src={activeImage.src}
        alt={activeImage.alt}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
