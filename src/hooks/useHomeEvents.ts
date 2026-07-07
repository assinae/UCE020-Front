"use client";

import { useEffect, useMemo, useState } from "react";
import { Event } from "@/types/event";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/providers/auth-provider";

export function useHomeEvents() {
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;

    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setIsFetchingEvents(true);
      }
    });

    eventService
      .findParticipatingEvents('participante')
      .then((events) => {
        if (isMounted) {
          setEvents(Array.isArray(events) ? events : []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFetchingEvents(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user, isLoading]);

  const filteredEvents = useMemo(() => (user ? events : []), [events, user]);

  return { filteredEvents, isFetchingEvents };
}
