'use client';

import type { ReactNode } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { colorTokens } from '@/lib/colors';
import { APP_TIMEZONE, formatBahiaTime } from '@/utils/date';
import type { ActivityGuest, ActivityModalProps, DateLike } from '@/types/activity';
import { ActivityModalActions } from './ActivityModalActions';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: '#F1F2F6', color: '#667085', label: 'Pendente' },
  iniciada: { bg: colorTokens.surface.mint, color: colorTokens.text.mint, label: 'Em andamento' },
  andamento: { bg: colorTokens.surface.mint, color: colorTokens.text.mint, label: 'Em andamento' },
  finalizada: { bg: colorTokens.surface.hover, color: colorTokens.text.muted, label: 'Finalizada' },
};

const GUEST_ROLE_LABELS: Record<string, string> = {
  palestrante: 'Palestrante',
  ministrante: 'Ministrante',
  moderador: 'Moderador',
};

function toDate(value?: DateLike) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDay(value?: DateLike) {
  const date = toDate(value);
  if (!date) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatTimeRange(start?: DateLike, end?: DateLike) {
  const startDate = toDate(start);
  if (!startDate) return '';
  const endDate = toDate(end);
  return endDate
    ? `${formatBahiaTime(startDate)} — ${formatBahiaTime(endDate)}`
    : formatBahiaTime(startDate);
}

function getRoleLabel(role: string) {
  const normalized = role?.trim().toLowerCase() ?? '';
  return (
    GUEST_ROLE_LABELS[normalized] ??
    (normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Convidado')
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  return `${parts[0].charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function InfoItem({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: '13px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: colorTokens.surface.mint,
          color: colorTokens.brand.secondary,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ color: colorTokens.text.heading, fontSize: 14, fontWeight: 700, lineHeight: 1.3, overflowWrap: 'anywhere' }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: colorTokens.text.label, fontSize: 12, fontWeight: 500 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h3"
      sx={{
        mb: 1,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: colorTokens.text.label,
      }}
    >
      {children}
    </Typography>
  );
}

function GuestList({ guests }: { guests: ActivityGuest[] }) {
  return (
    <Box component="section">
      <SectionTitle>Convidados</SectionTitle>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {guests.map((guest, index) => (
          <Box
            key={`${guest.email || guest.name}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.25,
              borderRadius: '16px',
              border: '1px solid rgba(13, 30, 59, 0.07)',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: colorTokens.brand.primary,
                color: colorTokens.surface.ink,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {getInitials(guest.name)}
            </Box>
            <Typography
              sx={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: colorTokens.text.heading, overflowWrap: 'anywhere' }}
            >
              {guest.name}
            </Typography>
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                px: 1.25,
                py: 0.35,
                borderRadius: 99,
                bgcolor: colorTokens.role.organizerBg,
                color: colorTokens.role.organizerText,
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              {getRoleLabel(guest.role)}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function ActivityModal({
  open,
  onClose,
  title,
  startDate,
  endDate,
  location,
  hours,
  participantsCount,
  status,
  description,
  variant,
  guests,
  presenceConfirmed,
  generateCertificate,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
  onGenerateCertificates,
  onViewReport,
  isLoading,
  isGeneratingCertificates,
}: ActivityModalProps) {
  if (!open) return null;

  const statusStyle = STATUS_STYLES[(status ?? '').trim().toLowerCase()];
  const visibleGuests = (guests ?? []).filter((guest) => guest?.name?.trim());
  const timeRange = formatTimeRange(startDate, endDate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="activity-modal-title"
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(9, 18, 35, 0.5)', backdropFilter: 'blur(2px)' } },
        paper: {
          sx: {
            m: { xs: 1.5, sm: 3 },
            width: { xs: 'calc(100% - 24px)', sm: 560 },
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: { xs: 'calc(100dvh - 24px)', sm: 'calc(100dvh - 64px)' },
            borderRadius: '28px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            boxShadow: '0 24px 60px rgba(10, 20, 38, 0.32)',
          },
        },
      }}
    >
      {/* Cabeçalho navy, como nas folhas da identidade visual. */}
      <Box
        sx={{
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2.25, sm: 3 },
          pt: { xs: 2.25, sm: 2.75 },
          pb: { xs: 2.25, sm: 2.5 },
          background: colorTokens.navigation.gradient,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: 'rgba(110, 215, 180, 0.12)',
          }}
        />
        <Box sx={{ position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colorTokens.brand.primary,
            }}
          >
            Programação
          </Typography>
          <Typography
            id="activity-modal-title"
            component="h2"
            sx={{
              fontSize: { xs: 19, sm: 21 },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              color: '#FFFFFF',
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Fechar"
          sx={{
            position: 'relative',
            flexShrink: 0,
            width: 34,
            height: 34,
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.18)' },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Corpo com rolagem própria; o rodapé de ações fica sempre visível. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: { xs: 2.25, sm: 3 },
          py: { xs: 2.25, sm: 2.75 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {statusStyle || status ? (
            <Box
              component="span"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 99,
                bgcolor: statusStyle?.bg ?? '#F1F2F6',
                color: statusStyle?.color ?? '#667085',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {statusStyle?.label ?? status}
            </Box>
          ) : null}
          {variant === 'organizer' && generateCertificate ? (
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.5,
                py: 0.5,
                borderRadius: 99,
                bgcolor: colorTokens.surface.mint,
                color: colorTokens.text.mint,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 15 }} />
              Emite certificado individual
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 1.75,
            p: 1.75,
            borderRadius: '20px',
            bgcolor: colorTokens.surface.panel,
            border: '1px solid rgba(13, 30, 59, 0.05)',
          }}
        >
          <InfoItem
            icon={<CalendarTodayRoundedIcon sx={{ fontSize: 19 }} />}
            title={formatDay(startDate)}
            subtitle={timeRange || 'Horário não informado'}
          />
          <InfoItem
            icon={<PlaceRoundedIcon sx={{ fontSize: 20 }} />}
            title={location || 'A definir'}
            subtitle="Local"
          />
          <InfoItem
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 20 }} />}
            title={`${hours} ${hours === 1 ? 'hora' : 'horas'}`}
            subtitle="Carga horária"
          />
          <InfoItem
            icon={<GroupsRoundedIcon sx={{ fontSize: 20 }} />}
            title={participantsCount === 1 ? '1 inscrito' : `${participantsCount} inscritos`}
            subtitle="Nesta atividade"
          />
        </Box>

        {description?.trim() ? (
          <Box component="section">
            <SectionTitle>Sobre a atividade</SectionTitle>
            <Typography
              sx={{ fontSize: 14.5, lineHeight: 1.7, color: colorTokens.text.muted, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}
            >
              {description}
            </Typography>
          </Box>
        ) : null}

        {visibleGuests.length > 0 ? <GuestList guests={visibleGuests} /> : null}
      </Box>

      <ActivityModalActions
        variant={variant}
        status={status}
        presenceConfirmed={presenceConfirmed}
        generateCertificate={generateCertificate}
        onSignup={onSignup}
        onCancelParticipation={onCancelParticipation}
        onMarkPresence={onMarkPresence}
        onValidatePresences={onValidatePresences}
        onListParticipants={onListParticipants}
        onGenerateCertificates={onGenerateCertificates}
        onViewReport={onViewReport}
        isLoading={isLoading}
        isGeneratingCertificates={isGeneratingCertificates}
      />
    </Dialog>
  );
}
