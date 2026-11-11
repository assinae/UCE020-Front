'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { eventService } from '@/services/eventService';
import { certificateService } from '@/services/certificate.service';
import { colorTokens } from '@/lib/colors';
import type { Activity } from '@/types/activity';
import { primaryPillSx } from './EventSubscriptionAction';

interface OrganizerEventActionsProps {
  eventId: number;
  activities?: Activity[];
  isFinalized?: boolean;
  /** Exclusão só é permitida enquanto o evento está pendente. */
  canDelete?: boolean;
  onAddActivity?: () => void;
  onDelete?: () => void;
  onFinalized?: () => void;
  onFinalizeError?: (message: string) => void;
  /** `button`: pílula "Ações do evento" (desktop). `icon`: só a engrenagem, sem fundo (mobile). */
  trigger?: 'button' | 'icon';
}

type ActionTone = 'accent' | 'default' | 'danger';

interface ActionItem {
  key: string;
  label: string;
  icon: ReactNode;
  tone: ActionTone;
  onClick: () => void;
  dividerBefore?: boolean;
}

const TONE_STYLES: Record<ActionTone, { color: string; hoverBg: string; hoverColor: string; weight: number }> = {
  accent: {
    color: colorTokens.brand.secondary,
    hoverBg: colorTokens.surface.mint,
    hoverColor: colorTokens.brand.secondaryDark,
    weight: 700,
  },
  default: {
    color: colorTokens.text.heading,
    hoverBg: colorTokens.surface.mintSubtle,
    hoverColor: colorTokens.brand.secondary,
    weight: 600,
  },
  danger: {
    color: colorTokens.status.error,
    hoverBg: colorTokens.surface.dangerSubtle,
    hoverColor: colorTokens.status.error,
    weight: 700,
  },
};

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return fallback;
}

// As chamadas de certificado na finalização são best-effort (um evento/atividade sem
// ninguém a certificar não deve travar a navegação), mas isso não pode significar
// "falha invisível". Loga cada rejeição com contexto pra aparecer no console em vez
// de só na aba Network.
function logSettledFailures(labels: string[], results: PromiseSettledResult<unknown>[]): void {
  results.forEach((result, index) => {
    if (result.status !== 'rejected') return;
    const label = labels[index] ?? `chamada ${index}`;
    const message = extractErrorMessage(result.reason, 'erro desconhecido');
    console.warn(`[certificados] falha ao gerar certificado (${label}): ${message}`, result.reason);
  });
}

/**
 * Ações do evento do organizador: menu suspenso ancorado no botão (pílula no
 * desktop, engrenagem no mobile).
 */
export function OrganizerEventActions({
  eventId,
  activities = [],
  isFinalized = false,
  canDelete = false,
  onAddActivity,
  onDelete,
  onFinalized,
  onFinalizeError,
  trigger = 'button',
}: OrganizerEventActionsProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const unfinishedActivities = activities.filter(
    (activity) => activity.status?.trim().toLowerCase() !== 'finalizada',
  );

  const isOpen = Boolean(anchorEl);

  function openActions(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeActions() {
    setAnchorEl(null);
  }

  function run(action: () => void) {
    closeActions();
    action();
  }

  async function onFinalizeEvent() {
    setIsFinalizing(true);
    try {
      await eventService.finalize(eventId);

      // Gera os certificados na sequência. Cada chamada é best-effort — um
      // evento/atividade sem ninguém a certificar (ex: atividade sem convidado)
      // não deve impedir a navegação para a tela de certificados gerados. Mas
      // "best-effort" não é "silencioso": ver logSettledFailures acima.
      const evento = await eventService.findOne(eventId).catch((error) => {
        console.warn('[certificados] falha ao rebuscar evento após finalizar:', error);
        return null;
      });
      const activityIds = evento?.atividades?.map((activity) => activity.id) ?? [];

      const certificateLabels = [
        'certificados de participante do evento',
        ...activityIds.map((activityId) => `certificados de convidado da atividade ${activityId}`),
      ];
      const certificateResults = await Promise.allSettled([
        certificateService.generateParticipantCertificates(eventId),
        ...activityIds.map((activityId) => certificateService.generateGuestCertificates(activityId)),
      ]);
      logSettledFailures(certificateLabels, certificateResults);

      onFinalized?.();
      // Retorna ao painel do evento para oferecer relatórios, certificados e
      // os dados finais no mesmo lugar. A seção já oculta ações de edição.
      router.push(`/event/${eventId}`);
    } catch (error) {
      onFinalizeError?.(extractErrorMessage(error, 'Não foi possível finalizar o evento'));
    } finally {
      setIsFinalizing(false);
    }
  }

  const iconSx = { fontSize: 20 };
  const items: ActionItem[] = [
    ...(!isFinalized
      ? [
          {
            key: 'add-activity',
            label: 'Cadastrar atividade',
            icon: <AddRoundedIcon sx={iconSx} />,
            tone: 'accent' as const,
            onClick: () => onAddActivity?.(),
          },
          {
            key: 'edit',
            label: 'Editar evento',
            icon: <EditRoundedIcon sx={iconSx} />,
            tone: 'default' as const,
            onClick: () => router.push(`/event/${eventId}/edit`),
          },
        ]
      : []),
    {
      key: 'members',
      label: 'Gerenciar usuários',
      icon: <PersonAddAlt1RoundedIcon sx={iconSx} />,
      tone: 'default',
      onClick: () => router.push(`/event/${eventId}/manage-users`),
    },
    ...(isFinalized
      ? [
          {
            key: 'attendance-report',
            label: 'Relatório de presenças',
            icon: <FactCheckRoundedIcon sx={iconSx} />,
            tone: 'default' as const,
            onClick: () => router.push(`/event/${eventId}/report/attendance`),
          },
          {
            key: 'monitor-report',
            label: 'Relatório de monitores',
            icon: <BadgeRoundedIcon sx={iconSx} />,
            tone: 'default' as const,
            onClick: () => router.push(`/event/${eventId}/report/monitors`),
          },
          {
            key: 'certificates',
            label: 'Certificados gerados',
            icon: <WorkspacePremiumRoundedIcon sx={iconSx} />,
            tone: 'default' as const,
            onClick: () => router.push(`/certificate/generated/${eventId}`),
          },
        ]
      : []),
    ...(!isFinalized
      ? [
          {
            key: 'finalize',
            label: 'Finalizar evento',
            icon: <TaskAltRoundedIcon sx={iconSx} />,
            tone: 'danger' as const,
            onClick: () => setIsConfirmOpen(true),
            dividerBefore: true,
          },
        ]
      : []),
    ...(canDelete && onDelete
      ? [
          {
            key: 'delete',
            label: 'Excluir evento',
            icon: <DeleteOutlineRoundedIcon sx={iconSx} />,
            tone: 'danger' as const,
            onClick: onDelete,
            dividerBefore: isFinalized,
          },
        ]
      : []),
  ];

  function renderItems() {
    return items.flatMap((item) => {
      const tone = TONE_STYLES[item.tone];
      const node = (
        <MenuItem
          key={item.key}
          onClick={() => run(item.onClick)}
          sx={{
            gap: 1.5,
            minHeight: 48,
            px: 1.75,
            borderRadius: '14px',
            color: tone.color,
            fontSize: 14,
            fontWeight: tone.weight,
            '&:hover, &.Mui-focusVisible': { bgcolor: tone.hoverBg, color: tone.hoverColor },
          }}
        >
          {item.icon}
          {item.label}
        </MenuItem>
      );
      return item.dividerBefore
        ? [<Divider key={`${item.key}-divider`} sx={{ my: '6px !important', mx: 1.25, borderColor: 'rgba(13, 30, 59, 0.08)' }} />, node]
        : [node];
    });
  }

  return (
    <>
      {trigger === 'icon' ? (
        <IconButton
          onClick={openActions}
          aria-label="Ações do evento"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            color: colorTokens.text.heading,
            '&:hover': { bgcolor: colorTokens.surface.mintSubtle, color: colorTokens.brand.secondary },
          }}
        >
          <SettingsRoundedIcon sx={{ fontSize: 26 }} />
        </IconButton>
      ) : (
        <Button
          onClick={openActions}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          sx={{
            ...primaryPillSx,
            color: '#FFFFFF',
            background: colorTokens.navigation.gradient,
            boxShadow: '0 8px 20px rgba(13, 30, 59, 0.26)',
            transition: 'transform .25s ease, box-shadow .25s ease',
            '&:hover': {
              color: '#FFFFFF',
              background: colorTokens.navigation.gradient,
              boxShadow: '0 10px 26px rgba(13, 30, 59, 0.34)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <SettingsRoundedIcon sx={{ fontSize: 19 }} />
          Ações do evento
          <KeyboardArrowDownRoundedIcon
            sx={{ fontSize: 20, transition: 'transform .2s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }}
          />
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              minWidth: Math.max(anchorEl?.offsetWidth ?? 0, 260),
              maxWidth: 'calc(100vw - 32px)',
              p: 1,
              borderRadius: '20px',
              border: '1px solid rgba(13, 30, 59, 0.08)',
              boxShadow: '0 18px 42px rgba(15, 29, 53, 0.16)',
            },
          },
          list: { sx: { p: 0, display: 'flex', flexDirection: 'column', gap: '2px' } },
        }}
      >
        {renderItems()}
      </Menu>

      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        message="Ao finalizar, inscrições, alterações de participantes e presenças serão bloqueadas."
        emphasisEndText="Essa ação não pode ser desfeita."
        details={unfinishedActivities.length > 0 ? (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: '#FFF7E6', textAlign: 'left' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.75 }}>
              {unfinishedActivities.length === 1
                ? 'A atividade abaixo será finalizada junto com o evento:'
                : `As ${unfinishedActivities.length} atividades abaixo serão finalizadas junto com o evento:`}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, maxHeight: 150, overflowY: 'auto' }}>
              {unfinishedActivities.map((activity) => (
                <Typography component="li" key={activity.id} sx={{ fontSize: 13, py: 0.2 }}>
                  {activity.name}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: 'text.secondary', fontSize: 12, textAlign: 'center', mb: 2 }}>
            Não há atividades pendentes de finalização.
          </Typography>
        )}
        confirmText="Finalizar"
        cancelText="Cancelar"
        isLoading={isFinalizing}
        onConfirm={onFinalizeEvent}
        type="warning"
      />
    </>
  );
}
