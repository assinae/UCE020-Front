'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import { EventList } from '@/components/event/EventList';
import { useAuth } from '@/providers/auth-provider';
import { eventService } from '@/services/eventService';
import type { Event } from '@/types/event';

export default function EventCreatedPage() {
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (isLoading || !user) return;

    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) {
        setIsFetchingEvents(true);
        setLoadError('');
      }
    });

    eventService
      .findParticipatingEvents('organizador')
      .then((events) => {
        if (isMounted) {
          setEvents(Array.isArray(events) ? events : []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
          //setLoadError('Nao foi possivel carregar os eventos criados.');
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

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', mb: 2 }}>
          {isFetchingEvents ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, width: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {loadError ? (
                <Typography sx={{ color: 'error.main', fontSize: 14, textAlign: 'center' }}>
                  {loadError}
                </Typography>
              ) : null}

              <EventList
                events={events}
                title="Eventos Criados"
                home={false}
                noEventsMessage="Nenhum evento encontrado."
              />
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
