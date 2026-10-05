'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { participationService } from '@/services/participationService';
import { useAuth } from '@/providers/auth-provider';
import { useNow } from '@/hooks/useNow';
import type { Activity } from '@/types/activity';
import type { Event } from '@/types/event';

function time(value: string | undefined): number {
  return value ? new Date(value).getTime() : Number.NaN;
}

function isHappening(start: string | undefined, end: string | undefined, now: number) {
  return time(start) <= now && now <= time(end);
}

function earliest<T>(items: T[], getStart: (item: T) => string | undefined): T | null {
  return [...items].sort((a, b) => time(getStart(a)) - time(getStart(b)))[0] ?? null;
}

// O status gravado no banco só muda ao finalizar, então "em andamento" e
// "próximo" são decididos pelas datas, não pelo campo `status`.
function pickFeaturedEvent(events: Event[], now: number): Event | null {
  const happening = events.filter((event) => isHappening(event.dataInicio, event.dataFim, now));
  if (happening.length > 0) return earliest(happening, (event) => event.dataInicio);

  const upcoming = events.filter((event) => time(event.dataInicio) > now);
  return earliest(upcoming, (event) => event.dataInicio);
}

function pickActivity(activities: Activity[], now: number) {
  const happening = activities.filter((activity) =>
    isHappening(activity.startDate, activity.endDate, now)
  );
  if (happening.length > 0) {
    return { activity: earliest(happening, (activity) => activity.startDate), isLive: true };
  }

  const upcoming = activities.filter((activity) => time(activity.startDate) > now);
  return { activity: earliest(upcoming, (activity) => activity.startDate), isLive: false };
}

export function useFeaturedEvent(events: Event[]) {
  const { user } = useAuth();
  const now = useNow();
  const featured = useMemo(() => pickFeaturedEvent(events, now), [events, now]);
  const featuredId = featured?.id;

  // Atividades e presenças mudam em outras telas sem invalidar estas chaves;
  // sem refetch ao montar, a home mostraria o evento recém-criado sem atividades.
  const { data: details, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['home-featured-event', featuredId],
    queryFn: () => eventService.findOne(featuredId as number),
    enabled: featuredId !== undefined,
    refetchOnMount: 'always',
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['event-progress', featuredId, user?.id],
    queryFn: () => participationService.getEventProgress(featuredId as number),
    enabled: featuredId !== undefined && !!user,
    refetchOnMount: 'always',
  });

  const { activity, isLive } = useMemo(
    () => pickActivity(details?.atividades ?? [], now),
    [details?.atividades, now]
  );

  return {
    event: featured,
    isEventLive: featured ? isHappening(featured.dataInicio, featured.dataFim, now) : false,
    activity,
    isActivityLive: isLive,
    progress,
    now,
    isLoading: featuredId !== undefined && (isLoadingDetails || isLoadingProgress),
  };
}
