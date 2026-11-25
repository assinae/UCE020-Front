'use client';

import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], enabled: boolean): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idsKey = ids.join('|');

  useEffect(() => {
    if (!enabled) return;
    const sectionIds = idsKey.split('|').filter((id) => Boolean(id && document.getElementById(id)));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -55% 0px' }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const lastId = sectionIds[sectionIds.length - 1];
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (reachedBottom && lastId) setActiveId(lastId);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [idsKey, enabled]);

  return activeId;
}
