'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { participationService } from '@/services/participationService';
import { useAuth } from '@/providers/auth-provider';
import { useNow } from '@/hooks/useNow';
import type { Activity } from '@/types/activity';
import type { Event } from '@/types/event';

export function toTime(value: string | undefined): number {
  return value ? new Date(value).getTime() : Number.NaN;
}

export function isHappening(start: string | undefined, end: string | undefined, now: number) {
  return toTime(start) <= now && now <= toTime(end);
}

export function earliest<T>(items: T[], getStart: (item: T) => string | undefined): T | null {
  return [...items].sort((a, b) => toTime(getStart(a)) - toTime(getStart(b)))[0] ?? null;
}

function pickActivity(activities: Activity[], now: number) {
  const happening = activities.filter((activity) =>
    isHappening(activity.startDate, activity.endDate, now)
  );
  if (happening.length > 0) {
    return { activity: earliest(happening, (activity) => activity.startDate), isLive: true };
  }

  const upcoming = activities.filter((activity) => toTime(activity.startDate) > now);
  return { activity: earliest(upcoming, (activity) => activity.startDate), isLive: false };
}

/**
 * Atividade atual (ou próxima) e progresso do usuário num evento.
 * Só busca quando `enabled`: cards fechados não disparam requisição.
 */
export function useEventHighlight(event: Event | null, enabled: boolean) {
  const { user } = useAuth();
  const now = useNow();
  const eventId = event?.id;
  const active = enabled && eventId !== undefined;

  // Atividades e presenças mudam em outras telas sem invalidar estas chaves;
  // sem refetch ao montar, a home mostraria o evento recém-criado sem atividades.
  const { data: details, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['event-highlight', eventId],
    queryFn: () => eventService.findOne(eventId as number),
    enabled: active,
    refetchOnMount: 'always',
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['event-progress', eventId, user?.id],
    queryFn: () => participationService.getEventProgress(eventId as number),
    enabled: active && !!user,
    refetchOnMount: 'always',
  });

  const { activity, isLive } = useMemo(
    () => pickActivity(details?.atividades ?? [], now),
    [details?.atividades, now]
  );

  return {
    isEventLive: event ? isHappening(event.dataInicio, event.dataFim, now) : false,
    activity,
    isActivityLive: isLive,
    progress,
    now,
    isLoading: active && (isLoadingDetails || isLoadingProgress),
  };
}
