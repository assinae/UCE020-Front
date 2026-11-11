'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, ButtonBase, Collapse, alpha } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { SkeletonBone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;
const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export interface TicketProgress {
  label: string;
  value: string;
  total: string;
  percent: number;
}

export interface TicketActivity {
  kicker: string;
  name: string;
  location: string;
  time: string;
  day: string;
}

export interface TicketAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface EventTicketProps {
  /** `featured`: destaque da home, com faixa de status ao vivo. */
  variant: 'featured' | 'compact';
  title: string;
  roleLabel: string;
  status: { label: string; bg: string; color: string };
  isLive: boolean;
  date: { day: string; month: string };
  place: string;
  meta: string;
  code?: string;
  expanded: boolean;
  onToggle: () => void;
  onOpen: () => void;
  loading: boolean;
  progress: TicketProgress | null;
  activity: TicketActivity | null;
  action: TicketAction;
}

function LiveDot() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ position: 'relative', display: 'flex', width: 7, height: 7 }}
    >
      <Box
        component="span"
        className="animate-ping motion-reduce:animate-none"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '999px',
          bgcolor: colorTokens.brand.primary,
          opacity: 0.6,
        }}
      />
      <Box
        component="span"
        sx={{
          position: 'relative',
          width: 7,
          height: 7,
          borderRadius: '999px',
          bgcolor: colorTokens.brand.primary,
        }}
      />
    </Box>
  );
}

const NOTCH_RADIUS = 10;

// Recorte de verdade nas laterais do picote: a máscara tira meio círculo da
// borda de cada parte do ingresso, e a sombra (drop-shadow) acompanha o recorte.
function notchMask(top: boolean, bottom: boolean) {
  const sides = [top && 'top', bottom && 'bottom'].filter(Boolean) as ('top' | 'bottom')[];
  if (sides.length === 0) return {};

  const layers = sides.flatMap((vertical) =>
    (['left', 'right'] as const).map((horizontal) => ({
      image: `radial-gradient(circle ${NOTCH_RADIUS}px at ${horizontal === 'left' ? '0' : '100%'} ${
        vertical === 'top' ? '0' : '100%'
      }, transparent 98%, #000 100%)`,
      size: `51% ${sides.length === 2 ? '51%' : '100%'}`,
      position: `${horizontal} ${vertical}`,
    }))
  );
  const join = (key: 'image' | 'size' | 'position') => layers.map((layer) => layer[key]).join(', ');

  return {
    maskImage: join('image'),
    WebkitMaskImage: join('image'),
    maskSize: join('size'),
    WebkitMaskSize: join('size'),
    maskPosition: join('position'),
    WebkitMaskPosition: join('position'),
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
}

// Linha tracejada na emenda entre duas partes, alinhada aos recortes. A parte
// de baixo sobe 1px sobre a de cima: sem isso, a altura fracionada deixa um fio
// entre as duas por onde o fundo e a sombra aparecem como uma linha contínua.
function perforationLine(inset: number) {
  return {
    position: 'relative',
    marginTop: '-1px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: inset,
      right: inset,
      borderTop: `2px dashed ${alpha(INK, 0.12)}`,
    },
  } as const;
}

function ProgressBlock({ progress }: { progress: TicketProgress }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px', pt: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          fontSize: 12,
          color: colorTokens.text.muted,
        }}
      >
        <span>{progress.label}</span>
        <span>
          <Box component="span" sx={{ fontWeight: 800, color: colorTokens.text.heading }}>
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
          height: 7,
          borderRadius: '999px',
          bgcolor: colorTokens.surface.app,
          overflow: 'hidden',
        }}
      >
        <Box
          className="animate-grow-x motion-reduce:animate-none"
          sx={{
            width: `${progress.percent}%`,
            height: '100%',
            borderRadius: '999px',
            transformOrigin: 'left',
            background: `linear-gradient(90deg, ${colorTokens.brand.mint}, ${colorTokens.brand.secondary})`,
          }}
        />
      </Box>
    </Box>
  );
}

function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    // Fora de HTTPS a área de transferência recusa; o código continua visível no botão.
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <ButtonBase
      onClick={copy}
      aria-label={copied ? 'Código copiado' : `Copiar código do evento ${code}`}
      sx={{
        flexShrink: 0,
        gap: '7px',
        px: 1.75,
        borderRadius: '999px',
        border: `1.5px solid ${copied ? colorTokens.brand.secondary : alpha(INK, 0.12)}`,
        bgcolor: WHITE,
        color: colorTokens.text.heading,
        fontSize: 12.5,
        fontWeight: 800,
        letterSpacing: '0.06em',
        transition: 'border-color .18s ease',
        '&:hover': { borderColor: colorTokens.brand.secondary },
      }}
    >
      {code}
      {copied ? (
        <CheckRoundedIcon sx={{ fontSize: 16, color: colorTokens.brand.secondary }} />
      ) : (
        <ContentCopyRoundedIcon sx={{ fontSize: 15, color: colorTokens.text.label }} />
      )}
    </ButtonBase>
  );
}

function DetailsSkeleton() {
  return (
    <Box
      role="status"
      aria-label="Carregando atividade"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SkeletonBone sx={{ width: 50, height: 50, borderRadius: '14px', flexShrink: 0 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SkeletonBone sx={{ width: 100, height: 10 }} />
          <SkeletonBone sx={{ width: '70%', height: 14 }} />
        </Box>
      </Box>
      <SkeletonBone sx={{ height: 46 }} />
    </Box>
  );
}

export function EventTicket({
  variant,
  title,
  roleLabel,
  status,
  isLive,
  date,
  place,
  meta,
  code,
  expanded,
  onToggle,
  onOpen,
  loading,
  progress,
  activity,
  action,
}: EventTicketProps) {
  const featured = variant === 'featured';
  const inset = featured ? 18 : 16;

  return (
    <Box
      sx={{
        // Sombra curta: um borrão maior entraria pelos recortes e os deixaria cinza.
        filter: featured
          ? `drop-shadow(0 1px 1px ${alpha(colorTokens.shadow.ink, 0.08)}) drop-shadow(0 6px 10px ${alpha(colorTokens.shadow.ink, 0.06)})`
          : `drop-shadow(0 1px 1px ${alpha(colorTokens.shadow.ink, 0.07)}) drop-shadow(0 3px 6px ${alpha(colorTokens.shadow.ink, 0.04)})`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: featured ? '24px' : '22px',
        }}
      >
        {featured && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.25,
              px: 2.25,
              py: 1.25,
              bgcolor: colorTokens.navigation.deep,
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: isLive ? colorTokens.brand.primary : alpha(WHITE, 0.82),
              }}
            >
              {isLive && <LiveDot />}
              {status.label}
            </Box>
            <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: alpha(WHITE, 0.7) }}>
              {roleLabel}
            </Box>
          </Box>
        )}

        <ButtonBase
          onClick={onOpen}
          aria-label={`Ver o evento ${title}`}
          sx={{
            flexDirection: 'column',
            alignItems: 'stretch',
            textAlign: 'left',
            p: featured ? '16px 18px' : '16px 16px 14px',
            bgcolor: WHITE,
            ...notchMask(false, true),
            transition: 'background .18s ease',
            '&:hover': { bgcolor: colorTokens.surface.muted },
            '&:hover .ticket-open-icon': {
              transform: 'translateX(3px)',
              color: colorTokens.brand.secondary,
            },
          }}
        >
          {!featured && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.25,
                mb: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colorTokens.text.icon,
                }}
              >
                {roleLabel}
              </Box>
              <Box
                component="span"
                sx={{
                  px: '10px',
                  py: '3px',
                  borderRadius: '999px',
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  bgcolor: status.bg,
                  color: status.color,
                }}
              >
                {status.label}
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              component="h3"
              sx={{
                flex: 1,
                minWidth: 0,
                m: 0,
                fontSize: featured ? 20 : 17,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: featured ? 1.2 : 1.25,
                color: colorTokens.text.heading,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Box>
            <ChevronRightRoundedIcon
              aria-hidden
              className="ticket-open-icon"
              sx={{
                mt: featured ? '2px' : 0,
                fontSize: 22,
                color: colorTokens.text.icon,
                transition: 'transform .2s ease, color .2s ease',
                [reducedMotion]: { transition: 'none' },
              }}
            />
          </Box>
          <Collapse in={expanded && (loading || !!progress)} timeout={280} appear={false}>
            {loading ? (
              <Box sx={{ pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <SkeletonBone sx={{ width: '55%', height: 10 }} />
                <SkeletonBone sx={{ height: 7 }} />
              </Box>
            ) : (
              progress && <ProgressBlock progress={progress} />
            )}
          </Collapse>
        </ButtonBase>

        <Box
          sx={{
            ...perforationLine(inset),
            ...notchMask(true, expanded),
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            p: `14px ${inset - 6}px 15px ${inset}px`,
            bgcolor: WHITE,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '14px',
              bgcolor: colorTokens.navigation.deep,
              color: WHITE,
            }}
          >
            <Box component="span" sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
              {date.day}
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colorTokens.brand.primary,
              }}
            >
              {date.month}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              fontSize: 12.5,
              color: colorTokens.text.muted,
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: colorTokens.text.heading,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {place}
            </Box>
            <span>{meta}</span>
          </Box>
          <ButtonBase
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? 'Ocultar detalhes do evento' : 'Mostrar detalhes do evento'}
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: '999px',
              border: `1px solid ${alpha(INK, 0.1)}`,
              color: colorTokens.text.heading,
              transition: 'background .18s ease, border-color .18s ease',
              '&:hover': {
                bgcolor: colorTokens.surface.mint,
                borderColor: colorTokens.brand.secondary,
              },
            }}
          >
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: 22,
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform .28s ease',
                [reducedMotion]: { transition: 'none' },
              }}
            />
          </ButtonBase>
        </Box>

        <Collapse in={expanded} timeout={300} appear={false}>
          <Box
            sx={{
              ...perforationLine(inset),
              ...notchMask(true, false),
              display: 'flex',
              flexDirection: 'column',
              gap: 1.75,
              p: `15px ${inset}px 18px`,
              bgcolor: colorTokens.surface.mintSubtle,
            }}
          >
            {loading ? (
              <DetailsSkeleton />
            ) : (
              <>
                {activity ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '14px',
                        bgcolor: colorTokens.surface.mint,
                        color: colorTokens.brand.secondary,
                      }}
                    >
                      <Box component="span" sx={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>
                        {activity.time}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.06em',
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
                        gap: '2px',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: colorTokens.text.icon,
                        }}
                      >
                        {activity.kicker}
                      </Box>
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
                      {activity.location && (
                        <Box component="span" sx={{ fontSize: 12, color: colorTokens.text.muted }}>
                          Local: {activity.location}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box component="span" sx={{ fontSize: 13, color: colorTokens.text.muted }}>
                    Nenhuma atividade programada por enquanto.
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <ButtonBase
                    onClick={action.onClick}
                    sx={{
                      flex: 1,
                      gap: 1,
                      minHeight: 46,
                      px: 2,
                      borderRadius: '999px',
                      bgcolor: colorTokens.brand.secondary,
                      color: WHITE,
                      fontSize: 14,
                      fontWeight: 700,
                      transition:
                        'background .18s ease, transform .28s cubic-bezier(.34,1.2,.64,1)',
                      '&:hover': {
                        bgcolor: colorTokens.brand.secondaryDark,
                        transform: 'translateY(-2px)',
                      },
                      '& svg': { fontSize: 19 },
                      [reducedMotion]: { transition: 'none' },
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </ButtonBase>
                  {code && <CodeChip code={code} />}
                </Box>
              </>
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
