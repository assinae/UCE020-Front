'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Box, ButtonBase, Collapse, alpha } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { SkeletonBone } from '@/components/ui';
import { useNow } from '@/hooks/useNow';
import { colorTokens } from '@/lib/colors';
import type { ParticipationRole, UserActivity, UserEventHistoryItem } from '@/types/userProfile';
import { APP_TIMEZONE } from '@/utils/date';
import { ProfileCard, fieldLabelSx, profileDivider } from './ProfileCard';

const VISIBLE_HISTORY = 3;

const ROLE_LABEL: Record<ParticipationRole, string> = {
  participante: 'Participante',
  organizador: 'Organizador',
  monitor: 'Monitor',
};

const dayMonthFormat = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: APP_TIMEZONE,
});

function dateParts(value: string) {
  const parts = dayMonthFormat.formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return { day: get('day'), month: get('month').replace('.', ''), year: get('year') };
}

function formatPeriod(start: string, end: string, currentYear: string): string {
  const from = dateParts(start);
  const to = dateParts(end);
  const yearSuffix = to.year === currentYear ? '' : ` ${to.year}`;

  if (from.year === to.year && from.month === to.month) {
    const days = from.day === to.day ? from.day : `${from.day} a ${to.day}`;
    return `${days} ${to.month}${yearSuffix}`;
  }
  const fromYear = from.year === to.year ? '' : ` ${from.year}`;
  return `${from.day} ${from.month}${fromYear} a ${to.day} ${to.month}${yearSuffix}`;
}

type HistoryState = 'certificate' | 'live' | 'upcoming' | 'ended';

const STATE_CHIP: Record<HistoryState, { label: string; bg: string; color: string }> = {
  certificate: { label: 'Certificado', bg: colorTokens.surface.mint, color: colorTokens.text.mint },
  live: {
    label: 'Em andamento',
    bg: colorTokens.progress.liveBg,
    color: colorTokens.progress.liveText,
  },
  upcoming: {
    label: 'Em breve',
    bg: colorTokens.presence.pendingBg,
    color: colorTokens.presence.pendingText,
  },
  ended: {
    label: 'Encerrado',
    bg: colorTokens.presence.pendingBg,
    color: colorTokens.presence.pendingText,
  },
};

// O status salvo só muda quando o organizador finaliza; o andamento vem das datas.
function getHistoryState(item: UserEventHistoryItem, now: number): HistoryState {
  if (item.possuiCertificado) return 'certificate';
  if (item.status === 'finalizada' || new Date(item.dataFim).getTime() < now) return 'ended';
  if (new Date(item.dataInicio).getTime() > now) return 'upcoming';
  return 'live';
}

function HistoryRow({
  item,
  now,
  currentYear,
}: {
  item: UserEventHistoryItem;
  now: number;
  currentYear: string;
}) {
  const chip = STATE_CHIP[getHistoryState(item, now)];
  const meta = [
    formatPeriod(item.dataInicio, item.dataFim, currentYear),
    ROLE_LABEL[item.papel],
    `${item.cargaHoraria}h`,
  ].join(' · ');

  return (
    <Box component="li" sx={{ borderTop: profileDivider }}>
      <ButtonBase
        component={Link}
        href={`/event/${item.eventoId}`}
        aria-label={`Ver o evento ${item.nome}`}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.75,
          pl: 3,
          pr: 2,
          py: 1.75,
          textAlign: 'left',
          transition: 'background .18s ease',
          '&:hover': { bgcolor: colorTokens.surface.muted },
          '&:hover .history-row-arrow': {
            color: colorTokens.brand.secondary,
            transform: 'translateX(3px)',
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Box
            component="span"
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: colorTokens.text.heading,
              overflowWrap: 'anywhere',
            }}
          >
            {item.nome}
          </Box>
          <Box
            component="span"
            sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.label }}
          >
            {meta}
          </Box>
        </Box>
        <Box
          component="span"
          sx={{
            px: '11px',
            py: '5px',
            borderRadius: '999px',
            bgcolor: chip.bg,
            color: chip.color,
            fontSize: 11.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {chip.label}
        </Box>
        <ChevronRightRoundedIcon
          aria-hidden
          className="history-row-arrow"
          sx={{
            fontSize: 20,
            flexShrink: 0,
            color: colorTokens.text.icon,
            transition: 'color .18s ease, transform .18s ease',
          }}
        />
      </ButtonBase>
    </Box>
  );
}

const statCellSx = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  p: { xs: '18px 14px 16px', sm: '20px 20px 18px' },
  '&:not(:first-of-type)': { borderLeft: profileDivider },
} as const;

const statLabelSx = { fontSize: 12, fontWeight: 600, color: colorTokens.text.muted } as const;

function StatsStrip({ activity }: { activity: UserActivity }) {
  const stats = [
    { label: 'Eventos organizados', value: activity.eventosOrganizados },
    { label: 'Certificados recebidos', value: activity.certificadosRecebidos },
    { label: 'Carga horária total', value: `${activity.cargaHorariaTotal}h`, accent: true },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {stats.map((stat) => (
        <Box key={stat.label} sx={statCellSx}>
          <Box
            component="span"
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              overflowWrap: 'anywhere',
              color: stat.accent ? colorTokens.brand.secondary : colorTokens.text.heading,
            }}
          >
            {stat.value}
          </Box>
          <Box component="span" sx={statLabelSx}>
            {stat.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function HistoryHeader({ action }: { action?: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        minHeight: 48,
        p: '14px 24px 10px',
        borderTop: profileDivider,
      }}
    >
      <Box component="h3" sx={{ ...fieldLabelSx, m: 0 }}>
        Histórico de eventos
      </Box>
      {action}
    </Box>
  );
}

export function ActivityCard({ activity }: { activity: UserActivity }) {
  const now = useNow();
  const [expanded, setExpanded] = useState(false);
  const currentYear = dateParts(new Date(now).toISOString()).year;
  const visible = activity.historico.slice(0, VISIBLE_HISTORY);
  const hidden = activity.historico.slice(VISIBLE_HISTORY);

  const listSx = { m: 0, p: 0, listStyle: 'none' } as const;

  return (
    <ProfileCard delay={0.06}>
      <StatsStrip activity={activity} />

      <HistoryHeader
        action={
          hidden.length > 0 && (
            <ButtonBase
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              aria-controls="profile-history-more"
              sx={{
                px: 1,
                py: 0.5,
                mr: -1,
                borderRadius: '999px',
                fontSize: 12.5,
                fontWeight: 700,
                color: colorTokens.brand.secondary,
                transition: 'background .18s ease',
                '&:hover': { bgcolor: alpha(colorTokens.brand.secondary, 0.08) },
              }}
            >
              {expanded ? 'Ver menos' : `Ver todos (${activity.historico.length})`}
            </ButtonBase>
          )
        }
      />

      {activity.historico.length === 0 ? (
        <Box
          component="p"
          sx={{
            m: 0,
            px: 3,
            pt: 1.5,
            pb: 3,
            fontSize: 13,
            fontWeight: 500,
            color: colorTokens.text.muted,
          }}
        >
          Você ainda não participou de nenhum evento.
        </Box>
      ) : (
        <Box sx={{ pb: 0.5 }}>
          <Box component="ul" sx={listSx}>
            {visible.map((item) => (
              <HistoryRow
                key={item.participacaoId}
                item={item}
                now={now}
                currentYear={currentYear}
              />
            ))}
          </Box>
          <Collapse in={expanded} timeout={320} id="profile-history-more">
            <Box component="ul" sx={listSx}>
              {hidden.map((item) => (
                <HistoryRow
                  key={item.participacaoId}
                  item={item}
                  now={now}
                  currentYear={currentYear}
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      )}
    </ProfileCard>
  );
}

export function ActivityCardSkeleton() {
  return (
    <ProfileCard delay={0.06}>
      <Box role="status" aria-label="Carregando atividade">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {[0, 1, 2].map((index) => (
            <Box key={index} sx={{ ...statCellSx, gap: 1 }}>
              <SkeletonBone sx={{ width: 44, height: 26 }} />
              <SkeletonBone sx={{ width: '80%', height: 12 }} />
            </Box>
          ))}
        </Box>
        <HistoryHeader />
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.75,
              px: 3,
              py: 1.75,
              borderTop: profileDivider,
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SkeletonBone sx={{ width: '70%', height: 14 }} />
              <SkeletonBone sx={{ width: '45%', height: 11 }} />
            </Box>
            <SkeletonBone sx={{ width: 84, height: 24 }} />
          </Box>
        ))}
      </Box>
    </ProfileCard>
  );
}
