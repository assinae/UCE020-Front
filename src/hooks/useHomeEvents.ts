"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/providers/auth-provider";
import type { Event } from "@/types/event";

type TipoParticipacao = NonNullable<Event["tipoParticipacao"]>;

function comPapel(events: Event[], tipoParticipacao: TipoParticipacao): Event[] {
  return events.map((event) => ({ ...event, tipoParticipacao }));
}

// Quando o mesmo evento vem nas duas listas, o último papel prevalece — por isso
// monitor entra depois de participante.
function mergeByStartDate(...lists: Event[][]): Event[] {
  const porId = new Map<number, Event>();
  lists.flat().forEach((event) => porId.set(event.id, event));

  return [...porId.values()].sort(
    (a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime(),
  );
}

export function useHomeEvents() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, isFetching, isLoading: isQueryLoading } = useQuery({
    queryKey: ["home-events", user?.id],
    // O endpoint filtra por um único tipo de participação, então a home precisa
    // das duas chamadas para reunir os eventos dos dois papeis de inscrito.
    queryFn: async () => {
      const [comoParticipante, comoMonitor] = await Promise.all([
        eventService.findParticipatingEvents("participante"),
        eventService.findParticipatingEvents("monitor"),
      ]);

      return mergeByStartDate(
        comPapel(comoParticipante, "participante"),
        comPapel(comoMonitor, "monitor"),
      );
    },
    enabled: !!user && !isAuthLoading,
  });

  const filteredEvents = useMemo(
    () => (user && Array.isArray(data) ? data : []),
    [data, user],
  );

  const loading = isAuthLoading || isQueryLoading;

  return { filteredEvents, isFetchingEvents: isFetching, loading };
}
