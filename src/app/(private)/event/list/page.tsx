'use client';

import { Box, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { EventList } from '@/components/event/EventList';
import { PageLoader } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { eventService } from '@/services/eventService';

export default function EventCreatedPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading: isQueryLoading, isError } = useQuery({
    queryKey: ['events-created', user?.id],
    queryFn: () => eventService.findParticipatingEvents('organizador'),
    enabled: !!user && !isAuthLoading,
  });

  const events = Array.isArray(data) ? data : [];
  const loadError = isError ? 'Não foi possível carregar os eventos criados.' : '';

  const isFetchingEvents = isAuthLoading || isQueryLoading;

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch', width: '100%', minWidth: 0, mb: 2 }}>
          {isFetchingEvents ? (
            <PageLoader minHeight="calc(100dvh - 160px)" />
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
