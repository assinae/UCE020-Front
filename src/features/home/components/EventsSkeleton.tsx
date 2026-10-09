import { Box } from '@mui/material';
import { EventTicketSkeleton } from '@/components/event';

interface EventsSkeletonProps {
  featured: boolean;
  cards: number;
  maxMobile: number;
  maxDesktop: number;
}

export function EventsSkeleton({ featured, cards, maxMobile, maxDesktop }: EventsSkeletonProps) {
  // Sem nenhum formato conhecido, um card basta para sinalizar o carregamento.
  const cardCount = Math.min(cards, maxDesktop) || (featured ? 0 : 1);

  return (
    <Box
      role="status"
      aria-label="Carregando seus eventos"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(auto-fill, minmax(300px, 1fr))' },
        alignItems: 'start',
        gap: 2,
      }}
    >
      {featured && <EventTicketSkeleton variant="featured" />}
      {Array.from({ length: cardCount }, (_, index) => (
        <Box
          key={index}
          sx={{ display: index < maxMobile ? 'block' : { xs: 'none', md: 'block' } }}
        >
          <EventTicketSkeleton />
        </Box>
      ))}
    </Box>
  );
}
