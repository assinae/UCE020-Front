'use client';

import { Box, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { EventList } from '@/components/event';
import { colorTokens } from '@/lib/colors';
import { useAuth } from '@/providers/auth-provider';
import { eventService } from '@/services/eventService';
import { EventTicketCard } from './EventTicketCard';

const COLLECTIONS = {
  organizador: {
    queryKey: 'events-created',
    title: 'Eventos Criados',
    error: 'Não foi possível carregar os eventos criados.',
  },
  monitor: {
    queryKey: 'events-monitoring',
    title: 'Monitoria de Eventos',
    error: 'Não foi possível carregar os eventos monitorados.',
  },
} as const;

interface EventCollectionViewProps {
  tipo: keyof typeof COLLECTIONS;
}

export function EventCollectionView({ tipo }: EventCollectionViewProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const collection = COLLECTIONS[tipo];

  const { data, isLoading, isError } = useQuery({
    queryKey: [collection.queryKey, user?.id],
    // O endpoint não devolve o papel; ele é o mesmo para toda a lista.
    queryFn: async () =>
      (await eventService.findParticipatingEvents(tipo)).map((event) => ({
        ...event,
        tipoParticipacao: tipo,
      })),
    enabled: !!user && !isAuthLoading,
  });

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {isError && (
          <Typography sx={{ mb: 2, color: 'error.main', fontSize: 14, textAlign: 'center' }}>
            {collection.error}
          </Typography>
        )}
        <EventList
          events={Array.isArray(data) ? data : []}
          title={collection.title}
          loading={isAuthLoading || isLoading}
          noEventsMessage="Nenhum evento encontrado."
          renderEvent={(event) => <EventTicketCard event={event} />}
        />
      </Container>
    </Box>
  );
}
