'use client';

import { useMemo } from 'react';
import { useNow } from '@/hooks/useNow';
import {
  earliest,
  isHappening,
  toTime,
  useEventHighlight,
} from '@/features/event/hooks/useEventHighlight';
import type { Event } from '@/types/event';

// O status gravado no banco só muda ao finalizar, então "em andamento" e
// "próximo" são decididos pelas datas, não pelo campo `status`.
function pickFeaturedEvent(events: Event[], now: number): Event | null {
  const happening = events.filter((event) => isHappening(event.dataInicio, event.dataFim, now));
  if (happening.length > 0) return earliest(happening, (event) => event.dataInicio);

  const upcoming = events.filter((event) => toTime(event.dataInicio) > now);
  return earliest(upcoming, (event) => event.dataInicio);
}

export function useFeaturedEvent(events: Event[]) {
  const now = useNow();
  const event = useMemo(() => pickFeaturedEvent(events, now), [events, now]);
  // Mesmas chaves do card: o destaque já chega com atividade e progresso em cache.
  const { isLoading } = useEventHighlight(event, true);

  return { event, isLoading };
}
