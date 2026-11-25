'use client';

import { useMemo, useState } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { colorTokens } from '@/lib/colors';
import type { PublicEventActivity } from '@/types/event';
import {
  type ActivityTiming,
  type ScheduleDay,
  formatGuests,
  formatTimeRange,
  getActivityTimings,
  getCategoryLabel,
  groupActivitiesByDay,
} from '../utils/eventLandingFormat';
import { EventLandingSection } from './EventLandingSection';

interface EventLandingScheduleProps {
  id: string;
  activities: PublicEventActivity[];
  now: number;
}

const ALL_DAYS = 'todos';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function TimingTag({ timing }: { timing: ActivityTiming | undefined }) {
  if (timing === 'past') {
    return (
      <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: colorTokens.text.label }}>
        Encerrada
      </Box>
    );
  }
  if (timing !== 'now' && timing !== 'next') return null;
  const isNow = timing === 'now';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 800,
        backgroundColor: isNow ? colorTokens.brand.secondary : colorTokens.role.organizerBg,
        color: isNow ? colorTokens.text.inverse : colorTokens.role.organizerText,
      }}
    >
      {isNow && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: colorTokens.brand.primary,
          }}
        />
      )}
      {isNow ? 'Acontecendo agora' : 'Próxima'}
    </Box>
  );
}

function TimelineItem({
  activity,
  timing,
  isLast,
  index,
}: {
  activity: PublicEventActivity;
  timing: ActivityTiming | undefined;
  isLast: boolean;
  index: number;
}) {
  const guests = formatGuests(activity.guests);
  const isNow = timing === 'now';
  const isPast = timing === 'past';

  return (
    <Box
      component="li"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
      sx={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: { xs: '20px minmax(0, 1fr)', sm: '112px 28px minmax(0, 1fr)' },
        columnGap: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography
        sx={{
          display: { xs: 'none', sm: 'block' },
          pt: '2px',
          textAlign: 'right',
          fontSize: 15,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: isPast ? colorTokens.text.label : colorTokens.text.heading,
        }}
      >
        {formatTimeRange(activity.startDate, activity.endDate)}
      </Typography>

      <Box aria-hidden sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            mt: '5px',
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `3px solid ${isPast ? colorTokens.text.icon : colorTokens.brand.secondary}`,
            backgroundColor: isNow ? colorTokens.brand.secondary : colorTokens.neutral.white,
            boxShadow: isNow ? '0 0 0 5px rgba(0,137,99,0.18)' : 'none',
          }}
        />
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: 22,
              bottom: -6,
              width: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(13,30,59,0.1)',
            }}
          />
        )}
      </Box>

      <Box sx={{ minWidth: 0, pb: isLast ? 0 : { xs: 4, md: 4.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.75 }}>
          <Typography
            component="span"
            sx={{
              display: { xs: 'inline', sm: 'none' },
              fontSize: 14,
              fontWeight: 800,
              color: isPast ? colorTokens.text.label : colorTokens.text.heading,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatTimeRange(activity.startDate, activity.endDate)}
          </Typography>
          <Box
            component="span"
            sx={{
              px: 1.25,
              py: 0.4,
              borderRadius: 999,
              backgroundColor: colorTokens.surface.mint,
              color: colorTokens.text.mint,
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            {getCategoryLabel(activity.category)}
          </Box>
          <TimingTag timing={timing} />
        </Box>

        <Typography
          component="h4"
          sx={{
            fontSize: { xs: 17, md: 19 },
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: '-.01em',
            color: isPast ? colorTokens.text.muted : colorTokens.text.heading,
          }}
        >
          {activity.name}
        </Typography>

        {activity.description && (
          <Typography
            sx={{ mt: 0.75, fontSize: 15, lineHeight: 1.65, color: colorTokens.text.muted }}
          >
            {activity.description}
          </Typography>
        )}

        {(activity.location || guests) && (
          <Box
            sx={{
              mt: 1.25,
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 2.5,
              rowGap: 0.75,
              fontSize: 14,
              color: colorTokens.text.muted,
            }}
          >
            {guests && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <RecordVoiceOverOutlinedIcon
                  sx={{ fontSize: 18, color: colorTokens.brand.secondary }}
                />
                <span>{guests}</span>
              </Box>
            )}
            {activity.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 18, color: colorTokens.brand.secondary }} />
                <span>{activity.location}</span>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function DayFilter({
  days,
  selected,
  onSelect,
}: {
  days: ScheduleDay[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  const options = [
    { key: ALL_DAYS, label: 'Todos os dias' },
    ...days.map((day) => ({
      key: day.key,
      label: `${capitalize(day.weekday)}, ${day.day}/${day.key.slice(5, 7)}`,
    })),
  ];

  return (
    <Box
      role="group"
      aria-label="Filtrar programação por dia"
      sx={{
        display: 'flex',
        justifyContent: { xs: 'flex-start', sm: 'center' },
        gap: 1,
        mb: { xs: 4, md: 6 },
        overflowX: 'auto',
        pb: 0.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {options.map(({ key, label }) => {
        const isActive = key === selected;
        return (
          <ButtonBase
            key={key}
            onClick={() => onSelect(key)}
            aria-pressed={isActive}
            sx={{
              flexShrink: 0,
              px: 2.25,
              py: 1,
              borderRadius: 999,
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 700,
              border: `1.5px solid ${isActive ? colorTokens.text.heading : 'rgba(13,30,59,0.14)'}`,
              backgroundColor: isActive ? colorTokens.text.heading : 'transparent',
              color: isActive ? colorTokens.text.inverse : colorTokens.text.heading,
              transition: 'background-color .18s ease, border-color .18s ease, color .18s ease',
              '&:hover': { borderColor: colorTokens.text.heading },
            }}
          >
            {label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export function EventLandingSchedule({ id, activities, now }: EventLandingScheduleProps) {
  const days = useMemo(() => groupActivitiesByDay(activities), [activities]);
  const timings = useMemo(() => getActivityTimings(activities, now), [activities, now]);
  const [selectedDay, setSelectedDay] = useState(ALL_DAYS);
  const visibleDays =
    selectedDay === ALL_DAYS ? days : days.filter((day) => day.key === selectedDay);
  const total = activities.length;

  return (
    <EventLandingSection
      id={id}
      badge={total ? `${total} ${total === 1 ? 'atividade' : 'atividades'}` : 'Programação'}
      title="Programação"
      description="Palestras, oficinas e minicursos do evento. A presença em cada atividade é registrada pelo QR Code."
      maxWidth="md"
    >
      {total === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
            py: 4,
          }}
        >
          <EventBusyOutlinedIcon sx={{ fontSize: 40, color: colorTokens.text.icon }} />
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: colorTokens.text.heading }}>
            Programação ainda não divulgada
          </Typography>
          <Typography sx={{ fontSize: 15, color: colorTokens.text.muted }}>
            Salve o evento na agenda e volte mais perto da data.
          </Typography>
        </Box>
      ) : (
        <>
          {days.length > 1 && (
            <DayFilter days={days} selected={selectedDay} onSelect={setSelectedDay} />
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 5, md: 6 } }}>
            {visibleDays.map((day) => (
              <Box key={day.key}>
                <Typography
                  component="h3"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 3,
                    fontSize: { xs: 15, md: 16 },
                    fontWeight: 800,
                    color: colorTokens.text.heading,
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden
                    sx={{
                      width: 5,
                      height: 22,
                      borderRadius: 999,
                      backgroundColor: colorTokens.brand.secondary,
                    }}
                  />
                  {day.label}
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(13,30,59,0.1)' }}
                  />
                </Typography>
                <Box component="ol" sx={{ m: 0, p: 0 }}>
                  {day.activities.map((activity, index) => (
                    <TimelineItem
                      key={activity.id}
                      activity={activity}
                      timing={timings.get(activity.id)}
                      isLast={index === day.activities.length - 1}
                      index={index}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </EventLandingSection>
  );
}
