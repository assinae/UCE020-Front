"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/providers/auth-provider";

export function useHomeEvents() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, isFetching, isLoading: isQueryLoading } = useQuery({
    queryKey: ["home-events", user?.id],
    queryFn: () => eventService.findParticipatingEvents('participante'),
    enabled: !!user && !isAuthLoading,
  });

  const events = Array.isArray(data) ? data : [];
  const filteredEvents = useMemo(() => (user ? events : []), [events, user]);

  const loading = isAuthLoading || isQueryLoading;

  return { filteredEvents, isFetchingEvents: isFetching, loading };
}
