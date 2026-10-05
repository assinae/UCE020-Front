"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/providers/auth-provider";
import { useNow } from "@/hooks/useNow";
import type { Event } from "@/types/event";

type TipoParticipacao = NonNullable<Event["tipoParticipacao"]>;

function comPapel(events: Event[], tipoParticipacao: TipoParticipacao): Event[] {
  return events.map((event) => ({ ...event, tipoParticipacao }));
}

// Quando o mesmo evento vem em mais de uma lista, o último papel prevalece — por
// isso a ordem é participante, monitor, organizador.
function mergeByStartDate(...lists: Event[][]): Event[] {
  const porId = new Map<number, Event>();
  lists.flat().forEach((event) => porId.set(event.id, event));

  return [...porId.values()].sort(
    (a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime(),
  );
}

export function useHomeEvents() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const now = useNow();

  const { data, isFetching, isLoading: isQueryLoading } = useQuery({
    queryKey: ["home-events", user?.id],
    // O endpoint filtra por um único tipo de participação, então a home precisa
    // de uma chamada por papel para reunir todos os eventos do usuário.
    queryFn: async () => {
      const [comoParticipante, comoMonitor, comoOrganizador] = await Promise.all([
        eventService.findParticipatingEvents("participante"),
        eventService.findParticipatingEvents("monitor"),
        eventService.findParticipatingEvents("organizador"),
      ]);

      return mergeByStartDate(
        comPapel(comoParticipante, "participante"),
        comPapel(comoMonitor, "monitor"),
        comPapel(comoOrganizador, "organizador"),
      );
    },
    enabled: !!user && !isAuthLoading,
  });

  // "Agora" = eventos que ainda não terminaram. O status gravado só muda ao
  // finalizar, então o fim do período é decidido pela data.
  const filteredEvents = useMemo(
    () =>
      user && Array.isArray(data)
        ? data.filter(
            (event) =>
              event.status?.toLowerCase() !== "finalizada" &&
              new Date(event.dataFim).getTime() >= now,
          )
        : [],
    [data, user, now],
  );

  const loading = isAuthLoading || isQueryLoading;

  return { filteredEvents, isFetchingEvents: isFetching, loading };
}
