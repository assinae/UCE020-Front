'use client';

import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Event } from '@/types/event';
import { Toast } from '@/components/ui';
import { ToastSeverity } from '@/types/toast';
import { useHomeEvents } from '@/hooks/useHomeEvents';
import { colorTokens } from '@/lib/colors';
import { eventService } from '@/services/eventService';
import { participationService } from '@/services/participationService';
import { extractApiErrorMessage } from '@/utils/apiError';
import { useQueryClient } from '@tanstack/react-query';
import { EventFoundModal } from './EventFoundModal';
import { HomeHero } from './HomeHero';
import { QuickActions } from './QuickActions';
import { SubscribedEvents } from './SubscribedEvents';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; event: Event }
  | { status: 'not_found' };

type SearchAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; event: Event }
  | { type: 'FETCH_NOT_FOUND' }
  | { type: 'RESET' };

function searchReducer(_: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', event: action.event };
    case 'FETCH_NOT_FOUND':
      return { status: 'not_found' };
    case 'RESET':
      return { status: 'idle' };
  }
}

export function HomeView() {
  const router = useRouter();
  const { filteredEvents, loading: eventsLoading } = useHomeEvents();
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const isSubscribingRef = useRef(false);
  const [subscribing, setSubscribing] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });
  const [searchState, dispatch] = useReducer(searchReducer, { status: 'idle' });

  useEffect(() => {
    if (!searchCode) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'FETCH_START' });
    const controller = new AbortController();

    eventService
      .findByCodigo(searchCode)
      .then((event) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'FETCH_SUCCESS', event });
          setModalOpen(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'FETCH_NOT_FOUND' });
          setToastOpen(true);
          setSearchCode('');
        }
      });

    return () => controller.abort();
  }, [searchCode]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = code.trim();
      if (trimmed) setSearchCode(trimmed);
    },
    [code]
  );

  function resetSearch() {
    setModalOpen(false);
    dispatch({ type: 'RESET' });
    setSearchCode('');
    setCode('');
  }

  function handleViewDetails(eventId: number) {
    resetSearch();
    router.push(`/event/${eventId}`);
  }

  async function handleSignup(eventId: number) {
    if (isSubscribingRef.current) return;
    isSubscribingRef.current = true;
    setSubscribing(true);
    try {
      await participationService.subscribe(eventId);
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['participating-events'] });
      resetSearch();
      router.push(`/event/${eventId}`);
    } catch (error) {
      setFeedback({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível concluir a inscrição'),
        severity: ToastSeverity.Error,
      });
    } finally {
      isSubscribingRef.current = false;
      setSubscribing(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 2.5, md: 3 },
          pt: { xs: 3.5, md: 4.5 },
          pb: { xs: 4, md: 9 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
        }}
      >
        <HomeHero
          code={code}
          onCodeChange={setCode}
          onSubmit={handleSubmit}
          searching={searchState.status === 'loading'}
        />
        <QuickActions />
        <SubscribedEvents events={filteredEvents} loading={eventsLoading} />
      </Box>

      <Toast
        open={toastOpen}
        message="Evento não encontrado. Verifique o código e tente novamente."
        severity={ToastSeverity.Warning}
        onClose={() => {
          setToastOpen(false);
          setCode('');
        }}
      />

      {searchState.status === 'success' && (
        <EventFoundModal
          event={searchState.event}
          open={modalOpen}
          subscribing={subscribing}
          onClose={resetSearch}
          onViewDetails={() => handleViewDetails(searchState.event.id)}
          onSubscribe={() => handleSignup(searchState.event.id)}
        />
      )}

      <Toast
        open={feedback.open}
        message={feedback.message}
        severity={feedback.severity}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
