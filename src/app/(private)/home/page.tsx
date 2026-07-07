'use client';

import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Event } from '@/types/event';
import { Searchbar, Toast } from '@/components/ui';
import { EventList } from '@/components/event';
import { ToastSeverity } from '@/types/toast';
import { ActivityModal } from '@/components/modals';
import { GreetingSection, QuickActions, useHomeEvents } from '@/features/home';
import { useAuth } from '@/providers/auth-provider';
import { eventService } from '@/services/eventService';
import { participationService } from '@/services/participationService';
import { isAxiosError } from 'axios';

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
    case 'FETCH_START': return { status: 'loading' };
    case 'FETCH_SUCCESS': return { status: 'success', event: action.event };
    case 'FETCH_NOT_FOUND': return { status: 'not_found' };
    case 'RESET': return { status: 'idle' };
  }
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { filteredEvents } = useHomeEvents();
  const [code, setCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const isSubscribingRef = useRef(false);
  const [feedback, setFeedback] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) setSearchCode(trimmed);
  }, [code]);

  function handleEventClick(event: Event) {
    setModalOpen(false);
    router.push(`/event/${event.id}`);
  }

  async function handleSignup(eventId: number) {
    if (isSubscribingRef.current) return;
    isSubscribingRef.current = true;
    try {
      await participationService.subscribe(eventId);
      setModalOpen(false);
      dispatch({ type: 'RESET' });
      setSearchCode('');
      setCode('');
      router.push(`/event/${eventId}`);
    } catch (error) {
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : 'Não foi possível concluir a inscrição';
      setFeedback({ open: true, message, severity: ToastSeverity.Error });
    } finally {
      isSubscribingRef.current = false;
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2.5, sm: 3 },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Searchbar value={code} onChange={setCode} placeholder="Pesquise o código do seu evento" />
        </form>

        <GreetingSection userName={user?.name?.split(' ')[0] || 'Usuário'} />
        <QuickActions />
        <EventList
          events={filteredEvents}
          onEventClick={handleEventClick}
        />
      </Box>

      <Toast
        open={toastOpen}
        message="Evento não encontrado. Verifique o código e tente novamente."
        severity={ToastSeverity.Warning}
        onClose={() => { setToastOpen(false); setCode(''); }}
      />

      {searchState.status === 'success' && (
        <ActivityModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setSearchCode(''); setCode(''); dispatch({ type: 'RESET' }); }}
          title={searchState.event.nome}
          image={searchState.event.foto ?? undefined}
          startDate={new Date(searchState.event.dataInicio).toLocaleDateString('pt-BR')}
          endDate={new Date(searchState.event.dataFim).toLocaleDateString('pt-BR')}
          location={searchState.event.localizacao}
          hours={searchState.event.cargaHoraria}
          participantsCount={0}
          status={searchState.event.status}
          description={searchState.event.descricao}
          variant="signup"
          onSignup={() => handleSignup(searchState.event.id)}
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