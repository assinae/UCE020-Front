'use client';

import { useEffect, useState } from 'react';

export interface EventsLayout {
  featured: boolean;
  cards: number;
}

const DEFAULT_LAYOUT: EventsLayout = { featured: true, cards: 0 };

function storageKey(userId: string | number) {
  return `assinae:home-events-layout:${userId}`;
}

function readLayout(userId: string | number | undefined): EventsLayout {
  if (userId === undefined || typeof window === 'undefined') return DEFAULT_LAYOUT;
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? 'null');
    return typeof stored?.featured === 'boolean' && Number.isFinite(stored?.cards)
      ? stored
      : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

// Antes da lista chegar não há como saber quantos cards virão; o esqueleto
// usa o formato da última visita para não piscar cards que não vão aparecer.
export function useRememberedEventsLayout(
  userId: string | number | undefined,
  current: EventsLayout | null
) {
  const [remembered] = useState(() => readLayout(userId));

  const featured = current?.featured;
  const cards = current?.cards;

  useEffect(() => {
    if (userId === undefined || featured === undefined || cards === undefined) return;
    window.localStorage.setItem(storageKey(userId), JSON.stringify({ featured, cards }));
  }, [userId, featured, cards]);

  return current ?? remembered;
}
