'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const prevPathRef = useRef(`${pathname}?${searchParams.toString()}`);
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPath = `${pathname}?${searchParams.toString()}`;

    // If path changed, start bar briefly to show transition completed
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      setProgress(100);

      const fadeOutTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(fadeOutTimer);
    }
  }, [pathname, searchParams]);

  // Global listener on link clicks to start progress bar proactively
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.getAttribute('target') === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // If internal navigation to a different URL
      try {
        const url = new URL(href, window.location.href);
        if (
          url.origin === window.location.origin &&
          url.pathname + url.search !== window.location.pathname + window.location.search
        ) {
          setVisible(true);
          setProgress(25);

          // Animate forward smoothly
          setTimeout(() => setProgress((p) => (p === 25 ? 65 : p)), 100);
          setTimeout(() => setProgress((p) => (p === 65 ? 85 : p)), 300);

          // Failsafe timeout: if navigation fails or is aborted, ensure bar always disappears within 4s
          if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
          cleanupTimerRef.current = setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, 4000);
        }
      } catch {
        // invalid URL
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)] transition-all duration-300 ease-out motion-reduce:transition-opacity motion-reduce:duration-150"
        style={{
          width: `${progress}%`,
          opacity: visible || progress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarInner />
    </Suspense>
  );
}
