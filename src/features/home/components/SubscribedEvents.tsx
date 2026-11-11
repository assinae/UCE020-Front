'use client';

import Link from 'next/link';
import { Box, alpha } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { SectionHeading } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import type { Event } from '@/types/event';
import { EventTicketCard } from '@/features/event';
import { useAuth } from '@/providers/auth-provider';
import { useFeaturedEvent } from '../hooks/useFeaturedEvent';
import { useRememberedEventsLayout } from '../hooks/useRememberedEventsLayout';
import { EventsSkeleton } from './EventsSkeleton';
import { NoEventsState } from './NoEventsState';

const MAX_MOBILE = 3;
const MAX_DESKTOP = 6;
const CARD_STAGGER_S = 0.06;

interface SubscribedEventsProps {
  events: Event[];
  loading: boolean;
}

export function SubscribedEvents({ events, loading }: SubscribedEventsProps) {
  const { user } = useAuth();
  const featured = useFeaturedEvent(events);
  const listedEvents = events.filter((event) => event.id !== featured.event?.id);
  const skeletonLayout = useRememberedEventsLayout(
    user?.id,
    loading ? null : { featured: !!featured.event, cards: listedEvents.length }
  );
  // O destaque precisa das atividades e do progresso; esperar por eles evita
  // que o card apareça pela metade e cresça aos trancos.
  const showSkeleton = loading || featured.isLoading;

  return (
    <Box
      component="section"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: '0.16s' }}
      sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      <SectionHeading
        title="Meus eventos agora"
        icon={
          <AccessTimeRoundedIcon
            aria-hidden
            sx={{ fontSize: 18, color: colorTokens.brand.secondary, flexShrink: 0 }}
          />
        }
        count={loading ? undefined : events.length}
        action={
          !loading && events.length > 0 ? (
            <Box
              component={Link}
              href="/event/list"
              sx={{
                px: 2,
                py: 1,
                border: `1px solid ${alpha(colorTokens.navigation.default, 0.12)}`,
                borderRadius: '999px',
                bgcolor: colorTokens.neutral.white,
                color: colorTokens.text.heading,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background .18s ease, border-color .18s ease',
                '&:hover': {
                  bgcolor: colorTokens.surface.mintSubtle,
                  borderColor: colorTokens.brand.secondary,
                },
              }}
            >
              Ver todos
            </Box>
          ) : null
        }
      />

      {showSkeleton ? (
        <EventsSkeleton
          featured={skeletonLayout.featured}
          cards={skeletonLayout.cards}
          maxMobile={MAX_MOBILE}
          maxDesktop={MAX_DESKTOP}
        />
      ) : events.length === 0 ? (
        <NoEventsState />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'repeat(auto-fill, minmax(300px, 1fr))',
            },
            alignItems: 'start',
            gap: 2,
          }}
        >
          {featured.event && (
            <Box className="animate-card-in motion-reduce:animate-none" sx={{ minWidth: 0 }}>
              <EventTicketCard
                event={featured.event}
                variant="featured"
                defaultExpanded={events.length === 1}
              />
            </Box>
          )}
          {listedEvents.slice(0, MAX_DESKTOP).map((event, index) => (
            <Box
              key={event.id}
              className="animate-card-in motion-reduce:animate-none"
              style={{ animationDelay: `${(index + 1) * CARD_STAGGER_S}s` }}
              sx={{
                minWidth: 0,
                display: index < MAX_MOBILE ? 'block' : { xs: 'none', md: 'block' },
              }}
            >
              <EventTicketCard event={event} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
