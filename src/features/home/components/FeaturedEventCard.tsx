'use client';

import { useId, useState, type ReactNode } from 'react';
import { Box, ButtonBase, Collapse, alpha } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;
const EXPAND_MS = 280;
const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export interface FeaturedProgress {
  label: string;
  value: string;
  total: string;
  percent: number;
}

export interface FeaturedActivity {
  kicker: string;
  name: string;
  location: string;
  time: string;
  day: string;
}

export interface FeaturedAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface FeaturedEventCardProps {
  title: string;
  subtitle: string;
  statusLabel: string;
  isLive: boolean;
  roleLabel: string | null;
  progress: FeaturedProgress | null;
  activity: FeaturedActivity | null;
  action: FeaturedAction;
  secondaryAction?: FeaturedAction;
  defaultOpen: boolean;
}

function LiveDot() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ position: 'relative', display: 'flex', width: 6, height: 6 }}
    >
      <Box
        component="span"
        className="animate-ping motion-reduce:animate-none"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '999px',
          bgcolor: colorTokens.brand.primary,
          opacity: 0.75,
        }}
      />
      <Box
        component="span"
        sx={{
          position: 'relative',
          width: 6,
          height: 6,
          borderRadius: '999px',
          bgcolor: colorTokens.brand.primary,
        }}
      />
    </Box>
  );
}

function Pill({ children, highlighted }: { children: ReactNode; highlighted?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        px: '10px',
        py: '3px',
        borderRadius: '999px',
        bgcolor: highlighted ? alpha(colorTokens.brand.mint, 0.2) : alpha(WHITE, 0.12),
        color: highlighted ? colorTokens.brand.primary : WHITE,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </Box>
  );
}

function ActionButton({
  action,
  variant = 'contained',
}: {
  action: FeaturedAction;
  variant?: 'contained' | 'outlined';
}) {
  const contained = variant === 'contained';

  return (
    <ButtonBase
      onClick={action.onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        width: { xs: '100%', md: 'auto' },
        whiteSpace: 'nowrap',
        py: contained ? '13px' : '11.5px',
        px: 3,
        borderRadius: '999px',
        border: contained ? 'none' : `1.5px solid ${alpha(INK, 0.14)}`,
        bgcolor: contained ? colorTokens.brand.secondary : WHITE,
        color: contained ? WHITE : colorTokens.text.heading,
        fontSize: 14,
        fontWeight: 700,
        transition:
          'background .18s ease, border-color .18s ease, transform .22s cubic-bezier(.34,1.2,.64,1)',
        '& svg': { fontSize: 18, transition: 'transform .22s cubic-bezier(.34,1.2,.64,1)' },
        '&:hover': {
          transform: 'translateY(-2px)',
          '& svg': { transform: 'scale(1.12)' },
          ...(contained
            ? { bgcolor: colorTokens.brand.secondaryDark }
            : { borderColor: alpha(INK, 0.24), bgcolor: colorTokens.surface.muted }),
        },
        '&:active': { transform: 'scale(.98)' },
        [reducedMotion]: {
          transition: 'background .18s ease, border-color .18s ease',
          '&:hover, &:active': { transform: 'none' },
          '&:hover svg': { transform: 'none' },
        },
      }}
    >
      {action.icon}
      {action.label}
    </ButtonBase>
  );
}

export function FeaturedEventCard({
  title,
  subtitle,
  statusLabel,
  isLive,
  roleLabel,
  progress,
  activity,
  action,
  secondaryAction,
  defaultOpen,
}: FeaturedEventCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  // Na primeira renderização o card inteiro já entra animado; o conteúdo só
  // anima sozinho quando o usuário abre o card.
  const [hasToggled, setHasToggled] = useState(false);
  const revealClass = hasToggled ? 'animate-sheet-up motion-reduce:animate-none' : undefined;
  const detailsId = useId();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        bgcolor: WHITE,
        border: `1px solid ${alpha(INK, 0.06)}`,
        boxShadow: `0 10px 28px ${alpha(colorTokens.shadow.ink, 0.09)}`,
        overflow: 'hidden',
        transition: 'transform .28s cubic-bezier(.34,1.2,.64,1), box-shadow .28s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 18px 38px ${alpha(colorTokens.shadow.ink, 0.14)}`,
        },
        [reducedMotion]: { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: '20px', md: '22px 24px' },
          background: colorTokens.navigation.gradient,
        }}
      >
        <Box
          aria-hidden
          className="animate-orb-float motion-reduce:animate-none"
          sx={{
            position: 'absolute',
            top: -70,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: '999px',
            bgcolor: alpha(colorTokens.brand.mint, 0.14),
            pointerEvents: 'none',
          }}
        />

        <ButtonBase
          onClick={() => {
            setHasToggled(true);
            setOpen((current) => !current);
          }}
          aria-expanded={open}
          aria-controls={detailsId}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            width: '100%',
            color: WHITE,
            textAlign: 'left',
            borderRadius: '16px',
            '&:hover .featured-chevron': {
              bgcolor: alpha(WHITE, 0.16),
              borderColor: alpha(WHITE, 0.3),
            },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Pill highlighted={isLive}>
                {isLive && <LiveDot />}
                {statusLabel}
              </Pill>
              {roleLabel && <Pill>{roleLabel}</Pill>}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box
                component="span"
                sx={{
                  fontSize: { xs: 19, md: 21 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  textWrap: 'pretty',
                }}
              >
                {title}
              </Box>
              <Box component="span" sx={{ fontSize: 12.5, color: alpha(WHITE, 0.72) }}>
                {subtitle}
              </Box>
            </Box>
          </Box>
          <Box
            component="span"
            className="featured-chevron"
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: '999px',
              border: `1px solid ${alpha(WHITE, 0.18)}`,
              bgcolor: alpha(WHITE, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .18s ease, border-color .18s ease',
            }}
          >
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: 20,
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform .25s ease',
              }}
            />
          </Box>
        </ButtonBase>

        {progress && (
          <Collapse in={open} timeout={EXPAND_MS} appear={false} unmountOnExit>
            <Box
              className={revealClass}
              sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, pt: 2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1.25,
                  fontSize: 12.5,
                  color: alpha(WHITE, 0.8),
                }}
              >
                <span>{progress.label}</span>
                <span>
                  <Box component="span" sx={{ fontWeight: 800, color: WHITE }}>
                    {progress.value}
                  </Box>{' '}
                  {progress.total}
                </span>
              </Box>
              <Box
                role="progressbar"
                aria-label={progress.label}
                aria-valuenow={progress.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                sx={{
                  height: 8,
                  borderRadius: '999px',
                  bgcolor: alpha(WHITE, 0.14),
                  overflow: 'hidden',
                }}
              >
                <Box
                  className="animate-grow-x motion-reduce:animate-none"
                  sx={{
                    transformOrigin: 'left',
                    width: `${progress.percent}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: `linear-gradient(90deg, ${colorTokens.brand.mint}, ${colorTokens.brand.secondary})`,
                  }}
                />
              </Box>
            </Box>
          </Collapse>
        )}
      </Box>

      <Collapse in={open} timeout={EXPAND_MS} appear={false} unmountOnExit id={detailsId}>
        <Box
          className={revealClass}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: '14px',
            p: { xs: '18px 20px 20px', md: '18px 24px' },
          }}
        >
          {activity && (
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'stretch', gap: 1.5 }}>
              <Box
                sx={{
                  minWidth: 50,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: '7px',
                  px: '6px',
                  whiteSpace: 'nowrap',
                  borderRadius: '14px',
                  bgcolor: colorTokens.surface.mint,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: colorTokens.brand.secondary,
                  }}
                >
                  {activity.time}
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
                  {activity.day}
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '1px',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: colorTokens.text.placeholder,
                  }}
                >
                  {activity.kicker}
                </Box>
                <Box
                  component="span"
                  sx={{ fontSize: 14.5, fontWeight: 700, color: colorTokens.text.heading }}
                >
                  {activity.name}
                </Box>
                {activity.location && (
                  <Box component="span" sx={{ fontSize: 12, color: colorTokens.text.muted }}>
                    Local: {activity.location}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 1,
              width: { xs: '100%', md: 'auto' },
              ml: { md: activity ? 0 : 'auto' },
              flexShrink: 0,
            }}
          >
            <ActionButton action={action} />
            {secondaryAction && <ActionButton action={secondaryAction} variant="outlined" />}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
