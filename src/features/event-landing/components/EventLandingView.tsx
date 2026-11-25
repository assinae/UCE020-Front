'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { Button, Toast } from '@/components/ui';
import { PublicMobileNav } from '@/components/navigation';
import { Footer } from '@/features/landing-page';
import { colorTokens } from '@/lib/colors';
import { useAuth } from '@/providers/auth-provider';
import { eventService } from '@/services/eventService';
import { ToastSeverity } from '@/types/toast';
import {
  buildCalendarFile,
  describeEventPhase,
  formatEventPeriod,
  formatHours,
  getEventPhase,
} from '../utils/eventLandingFormat';
import { EventLandingAbout } from './EventLandingAbout';
import { EventLandingHeader } from './EventLandingHeader';
import { EventLandingHero } from './EventLandingHero';
import { EventLandingHowTo } from './EventLandingHowTo';
import { EventLandingSchedule } from './EventLandingSchedule';
import { SECTION_TINT } from './EventLandingSection';
import type { SectionLink } from './EventLandingSectionLinks';
import { useActiveSection } from '../hooks/useActiveSection';
import { EventLandingSkeleton } from './EventLandingSkeleton';

interface EventLandingViewProps {
  codigo: string;
}

type ToastState = { message: string; severity: ToastSeverity } | null;

const SECTIONS: SectionLink[] = [
  { id: 'programacao', label: 'Programação' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'como-participar', label: 'Como participar' },
];

const SECTIONS_ENDED = SECTIONS.filter((section) => section.id !== 'como-participar');

function EventNotFound({ isMissing }: { isMissing: boolean }) {
  const { user } = useAuth();

  return (
    <>
      <EventLandingHeader />
      <Box
        component="main"
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          pt: { xs: 8, md: 14 },
          pb: 8,
          backgroundColor: SECTION_TINT,
        }}
      >
        <Box
          className="animate-card-in motion-reduce:animate-none"
          sx={{
            maxWidth: 460,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1.5,
            p: { xs: 4, md: 5 },
            borderRadius: '28px',
            backgroundColor: colorTokens.neutral.white,
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              backgroundColor: colorTokens.surface.mint,
              color: colorTokens.brand.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchOffRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 800, color: colorTokens.text.heading }}
          >
            {isMissing ? 'Evento não encontrado' : 'Não foi possível carregar o evento'}
          </Typography>
          <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: colorTokens.text.muted }}>
            {isMissing
              ? 'O link pode estar incompleto ou o evento foi removido. Se você tem o código do evento, busque por ele dentro do Assinaê.'
              : 'Pode ser uma instabilidade momentânea. Recarregue a página em alguns instantes.'}
          </Typography>
          {isMissing ? (
            <Button
              component={Link}
              href={user ? '/home' : '/login'}
              variant="contained"
              color="secondary"
              sx={{ mt: 1.5, borderRadius: '999px', fontWeight: 700, px: 4, boxShadow: 'none' }}
            >
              Buscar pelo código no Assinaê
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.reload()}
              sx={{ mt: 1.5, borderRadius: '999px', fontWeight: 700, px: 4, boxShadow: 'none' }}
            >
              Tentar novamente
            </Button>
          )}
        </Box>
      </Box>
      <Footer />
      <PublicMobileNav />
    </>
  );
}

export function EventLandingView({ codigo }: EventLandingViewProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [now] = useState(() => Date.now());
  const [codeCopied, setCodeCopied] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['event-landing', codigo],
    queryFn: () => eventService.findPublicByCodigo(codigo),
    enabled: Boolean(codigo),
    retry: false,
  });

  const [pastHero, setPastHero] = useState(false);
  const hasEvent = Boolean(event);
  useEffect(() => {
    if (!hasEvent || isAuthLoading) return;
    const hero = document.getElementById('event-hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [hasEvent, isAuthLoading]);

  const activeSectionId = useActiveSection(
    SECTIONS.map((section) => section.id),
    hasEvent && !isAuthLoading
  );

  if (isLoading || isAuthLoading) return <EventLandingSkeleton />;

  if (isError || !event) {
    const isMissing = error instanceof AxiosError && error.response?.status === 404;
    return <EventNotFound isMissing={isMissing} />;
  }

  const period = formatEventPeriod(event.dataInicio, event.dataFim);
  const hours = formatHours(event.cargaHoraria);
  const phase = getEventPhase(event.status, event.dataInicio, event.dataFim, now);
  const phaseLabel = describeEventPhase(phase, event.dataInicio, now);
  const isEnded = phase === 'ended';
  const visibleSections = isEnded ? SECTIONS_ENDED : SECTIONS;

  const cta = user
    ? {
        href: `/event/${event.id}`,
        label: isEnded ? 'Ver evento no Assinaê' : 'Inscrever-se',
        hint: isEnded
          ? 'Confira sua presença e baixe o certificado no Assinaê.'
          : 'Você já está logado: conclua a inscrição no Assinaê.',
      }
    : {
        href: '/login',
        label: isEnded ? 'Entrar para ver certificados' : 'Entrar e se inscrever',
        hint: isEnded
          ? 'Entre com a conta usada no evento para baixar o certificado.'
          : 'Inscrição gratuita pelo Assinaê. Criar conta leva menos de um minuto.',
      };

  const pageUrl =
    typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${event.nome} (${period})${event.localizacao ? ` em ${event.localizacao}` : ''}. Veja a programação e participe: ${pageUrl}`
  )}`;

  async function handleCopyCode() {
    if (!event?.codigo) return;
    try {
      await navigator.clipboard.writeText(event.codigo);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setToast({
        message: 'Não foi possível copiar. Selecione o código e copie manualmente.',
        severity: ToastSeverity.Error,
      });
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setToast({
        message: 'Link do evento copiado. É só colar onde quiser divulgar.',
        severity: ToastSeverity.Success,
      });
    } catch {
      setToast({
        message: 'Não foi possível copiar o link. Copie o endereço da barra do navegador.',
        severity: ToastSeverity.Error,
      });
    }
  }

  async function handleNativeShare() {
    if (!event) return;
    try {
      await navigator.share({ title: event.nome, url: pageUrl });
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return;
      await handleCopyLink();
    }
  }

  function handleAddToCalendar() {
    if (!event) return;
    let file: string;
    try {
      file = buildCalendarFile({
        codigo: event.codigo,
        nome: event.nome,
        descricao: event.descricao,
        localizacao: event.localizacao,
        dataInicio: event.dataInicio,
        dataFim: event.dataFim,
        url: pageUrl,
      });
    } catch {
      setToast({
        message: 'Não foi possível gerar o arquivo de agenda para este evento.',
        severity: ToastSeverity.Error,
      });
      return;
    }
    const blobUrl = URL.createObjectURL(new Blob([file], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${event.codigo ?? 'evento'}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    setToast({
      message: 'Arquivo de agenda baixado. Abra-o para adicionar ao seu calendário.',
      severity: ToastSeverity.Success,
    });
  }

  return (
    <>
      <EventLandingHeader
        sections={visibleSections}
        activeSectionId={activeSectionId}
        cta={{ href: cta.href, label: cta.label }}
        showCta={pastHero}
      />
      <EventLandingHero
        title={event.nome}
        photo={event.foto}
        phase={phase}
        phaseLabel={phaseLabel}
        period={period}
        location={event.localizacao}
        hours={hours}
        organizer={event.responsavel}
        subscribers={event.totalInscritos ?? 0}
        code={event.codigo}
        codeCopied={codeCopied}
        ctaHref={cta.href}
        ctaLabel={cta.label}
        ctaHint={cta.hint}
        whatsappHref={whatsappHref}
        onCopyCode={handleCopyCode}
        onCopyLink={handleCopyLink}
        onNativeShare={canNativeShare ? handleNativeShare : undefined}
        onAddToCalendar={handleAddToCalendar}
      />

      <Box component="main">
        <EventLandingSchedule id="programacao" activities={event.atividades ?? []} now={now} />
        <EventLandingAbout id="sobre" eventName={event.nome} description={event.descricao} />
        {!isEnded && <EventLandingHowTo id="como-participar" code={event.codigo} />}
      </Box>

      <Footer />
      <PublicMobileNav />

      <Toast
        open={Boolean(toast)}
        message={toast?.message ?? ''}
        severity={toast?.severity}
        onClose={() => setToast(null)}
      />
    </>
  );
}
