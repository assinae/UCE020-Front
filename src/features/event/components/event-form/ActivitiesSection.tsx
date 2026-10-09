'use client';

import { Box, ButtonBase, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CATEGORY_OPTIONS } from '@/features/activities/utils/activityFormRules';
import { colorTokens } from '@/lib/colors';
import type { ActivityItem } from '../../utils/eventFormRules';
import { PillButton, SectionTitle } from './FormControls';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function dayMonth(date: string) {
  const [, month, day] = date.split('-');
  return { day: day ?? '--', month: MONTHS[Number(month) - 1] ?? '' };
}

function activityMeta(activity: ActivityItem): string {
  const sameDay = activity.startDate === activity.endDate;
  const end = dayMonth(activity.endDate);
  const time = sameDay
    ? `${activity.startTime} — ${activity.endTime}`
    : `${activity.startTime} — ${end.day} ${end.month}, ${activity.endTime}`;
  const category = CATEGORY_OPTIONS.find((option) => option.value === activity.category)?.label;
  return [time, activity.location, category].filter(Boolean).join(' · ');
}

interface ActivitiesSectionProps {
  activities: ActivityItem[];
  canAdd: boolean;
  canRemove: boolean;
  removing: boolean;
  onAdd: () => void;
  onEdit: (activity: ActivityItem) => void;
  onRemove: (id: string) => void;
}

export function ActivitiesSection({
  activities,
  canAdd,
  canRemove,
  removing,
  onAdd,
  onEdit,
  onRemove,
}: ActivitiesSectionProps) {
  const count = activities.length;
  const title =
    count === 0
      ? 'Nenhuma atividade cadastrada'
      : count === 1
        ? '1 atividade cadastrada'
        : `${count} atividades cadastradas`;
  const subtitle = !canAdd
    ? 'Preencha as datas, os horários e a carga horária do evento para montar a programação.'
    : count > 0
      ? 'Você pode adicionar mais atividades antes de salvar o evento.'
      : 'A programação pode ser montada agora ou depois de salvar o evento.';

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SectionTitle>Atividades</SectionTitle>

      {count > 0 && (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
          }}
        >
          {activities.map((activity, index) => {
            const { day, month } = dayMonth(activity.startDate);
            return (
              <Box
                component="li"
                key={activity.id}
                className="animate-fade-up motion-reduce:animate-none"
                style={{
                  animationDelay: `${Math.min(index, 5) * 0.04}s`,
                  animationDuration: '0.35s',
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '20px',
                  bgcolor: colorTokens.neutral.white,
                  border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
                  boxShadow: `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.05)}`,
                  transition: 'border-color .18s ease, transform .28s cubic-bezier(.34,1.2,.64,1)',
                  '&:hover': {
                    borderColor: alpha(colorTokens.brand.secondary, 0.4),
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <ButtonBase
                  onClick={() => onEdit(activity)}
                  aria-label={`Editar atividade ${activity.name}`}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'flex-start',
                    gap: 1.625,
                    p: '14px 8px 14px 16px',
                    borderRadius: '20px',
                    textAlign: 'left',
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '15px',
                      bgcolor: colorTokens.surface.mint,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: 16,
                        fontWeight: 800,
                        lineHeight: 1,
                        color: colorTokens.text.heading,
                      }}
                    >
                      {day}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: colorTokens.text.mint,
                      }}
                    >
                      {month}
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: colorTokens.text.heading,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {activity.name}
                    </Box>
                    <Box
                      component="span"
                      sx={{ fontSize: 12.5, fontWeight: 500, color: colorTokens.text.label }}
                    >
                      {activityMeta(activity)}
                    </Box>
                  </Box>
                </ButtonBase>
                {canRemove && (
                  <ButtonBase
                    onClick={() => onRemove(activity.id)}
                    disabled={removing}
                    aria-label={`Remover atividade ${activity.name}`}
                    sx={{
                      width: 44,
                      height: 44,
                      mr: 1,
                      flexShrink: 0,
                      borderRadius: '999px',
                      color: colorTokens.text.placeholder,
                      transition: 'background .18s ease, color .18s ease',
                      '&:hover': {
                        bgcolor: colorTokens.surface.dangerSubtle,
                        color: colorTokens.status.error,
                      },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                  </ButtonBase>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 2.25 },
          p: { xs: 2.5, md: 3 },
          borderRadius: '24px',
          bgcolor: colorTokens.surface.panel,
          border: `1px solid ${alpha(colorTokens.navigation.default, 0.05)}`,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontSize: 15,
              fontWeight: 700,
              color: colorTokens.text.heading,
            }}
          >
            {title}
          </Box>
          <Box
            component="span"
            sx={{ display: 'block', mt: '3px', fontSize: 13, color: colorTokens.text.muted }}
          >
            {subtitle}
          </Box>
        </Box>
        <PillButton
          tone="navy"
          onClick={onAdd}
          disabled={!canAdd}
          startIcon={<AddRoundedIcon sx={{ fontSize: 20 }} />}
          sx={{ width: { xs: '100%', md: 250 }, flexShrink: 0 }}
        >
          Adicionar atividade
        </PillButton>
      </Box>
    </Box>
  );
}
