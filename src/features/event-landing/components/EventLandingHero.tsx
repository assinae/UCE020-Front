'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, ButtonBase, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { colorTokens } from '@/lib/colors';
import type { EventPhase } from '../utils/eventLandingFormat';
import { ghostOnDarkSx, primaryCtaSx } from './ctaStyles';
import { EventPhaseBadge } from './EventPhaseBadge';
import { EventShareButton } from './EventShareButton';

interface EventLandingHeroProps {
  title: string;
  photo: string | null;
  phase: EventPhase;
  phaseLabel: string;
  period: string;
  location: string | null;
  hours: string | null;
  organizer: string | null;
  subscribers: number;
  code: string | null;
  codeCopied: boolean;
  ctaHref: string;
  ctaLabel: string;
  ctaHint: string;
  whatsappHref: string;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onNativeShare?: () => void;
  onAddToCalendar: () => void;
}

const actionSize = {
  height: 50,
  py: 0,
  px: { xs: 1.5, sm: 2.75 },
  fontSize: { xs: 14, sm: 15 },
} as const;

export function EventLandingHero({
  title,
  photo,
  phase,
  phaseLabel,
  period,
  location,
  hours,
  organizer,
  subscribers,
  code,
  codeCopied,
  ctaHref,
  ctaLabel,
  ctaHint,
  whatsappHref,
  onCopyCode,
  onCopyLink,
  onNativeShare,
  onAddToCalendar,
}: EventLandingHeroProps) {
  const isEnded = phase === 'ended';
  const secondaryCount = isEnded ? 1 : 2;
  const facts = [
    { icon: CalendarMonthRoundedIcon, label: 'Data', value: period },
    { icon: PlaceOutlinedIcon, label: 'Local', value: location },
    {
      icon: WorkspacePremiumOutlinedIcon,
      label: 'Certificado',
      value: hours ? `Até ${hours}` : null,
    },
    {
      icon: GroupsRoundedIcon,
      label: 'Inscritos',
      value: `${subscribers} ${subscribers === 1 ? 'pessoa' : 'pessoas'}`,
    },
  ].filter((fact): fact is typeof fact & { value: string } => Boolean(fact.value));

  return (
    <Box
      id="event-hero"
      component="section"
      aria-labelledby="event-hero-title"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: colorTokens.navigation.gradient,
        color: colorTokens.text.inverse,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        className="animate-orb-float motion-reduce:animate-none"
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 2.5, sm: 4 },
          pt: { xs: 5, md: 17 },
          pb: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          },
          gridTemplateAreas: {
            xs: '"head" "photo" "body"',
            md: '"head photo" "body photo"',
          },
          columnGap: 6,
          rowGap: { xs: 3, md: 0 },
        }}
      >
        <Box
          className="animate-fade-up motion-reduce:animate-none"
          sx={{ gridArea: 'head', minWidth: 0, alignSelf: 'end' }}
        >
          <EventPhaseBadge phase={phase} label={phaseLabel} tone="dark" />

          <Typography
            id="event-hero-title"
            component="h1"
            sx={{
              mt: 2,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: { xs: '-0.5px', md: '-1.2px' },
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.4rem' },
              maxWidth: 760,
              textWrap: 'balance',
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Typography>

          {organizer && (
            <Typography
              sx={{ mt: 1.5, color: '#C7D2E0', fontSize: { xs: '0.95rem', md: '1.05rem' } }}
            >
              Organizado por{' '}
              <Box component="span" sx={{ color: colorTokens.brand.mint, fontWeight: 700 }}>
                {organizer}
              </Box>
            </Typography>
          )}
        </Box>

        <Box
          className="animate-fade-up motion-reduce:animate-none"
          sx={{ gridArea: 'body', minWidth: 0, alignSelf: 'start' }}
        >
          <Box
            component="dl"
            sx={{
              m: 0,
              mt: { xs: 0, md: 3.5 },
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr 1fr',
                sm: `repeat(${facts.length}, minmax(0, auto))`,
              },
              justifyContent: 'start',
              columnGap: { xs: 2, sm: 4 },
              rowGap: 2,
            }}
          >
            {facts.map(({ icon: Icon, label, value }) => (
              <Box
                key={label}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(110,215,180,0.14)',
                    color: colorTokens.brand.mint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="dt"
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    component="dd"
                    sx={{ m: 0, fontSize: 14.5, fontWeight: 700, overflowWrap: 'anywhere' }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: { xs: 3.5, md: 4.5 },
              display: 'grid',
              width: { xs: '100%', sm: 'fit-content' },
              maxWidth: '100%',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: `repeat(${secondaryCount}, minmax(0, 1fr))`,
                  sm: `repeat(${secondaryCount + 1}, auto)`,
                },
                gap: 1.25,
              }}
            >
              <Box
                component={Link}
                href={ctaHref}
                sx={{ ...primaryCtaSx, ...actionSize, gridColumn: { xs: '1 / -1', sm: 'auto' } }}
              >
                {ctaLabel}
                <ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
              </Box>
              {!isEnded && (
                <ButtonBase onClick={onAddToCalendar} sx={{ ...ghostOnDarkSx, ...actionSize }}>
                  <EventAvailableRoundedIcon sx={{ fontSize: 19 }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Salvar na agenda
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Agenda
                  </Box>
                </ButtonBase>
              )}
              <EventShareButton
                whatsappHref={whatsappHref}
                onCopyLink={onCopyLink}
                onNativeShare={onNativeShare}
                sx={{ ...ghostOnDarkSx, ...actionSize }}
              />
            </Box>

            <Typography
              sx={{
                width: 0,
                minWidth: '100%',
                mt: 1.5,
                color: '#C7D2E0',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {ctaHint}
            </Typography>

            {code && (
              <Box
                sx={{
                  width: 0,
                  minWidth: '100%',
                  mt: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  height: 50,
                  pl: 2.5,
                  pr: 0.75,
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: '#C7D2E0',
                  fontSize: 14,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Código
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {' '}
                    do evento
                  </Box>{' '}
                  <Box
                    component="strong"
                    sx={{ color: colorTokens.text.inverse, letterSpacing: '.08em', fontSize: 15 }}
                  >
                    {code}
                  </Box>
                </Box>
                <ButtonBase
                  onClick={onCopyCode}
                  aria-label="Copiar código do evento"
                  sx={{
                    flexShrink: 0,
                    gap: 0.75,
                    height: 38,
                    px: 2,
                    borderRadius: 999,
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: codeCopied ? colorTokens.brand.mint : colorTokens.text.inverse,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transition: 'background-color .18s ease',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.18)' },
                    '&:focus-visible': {
                      outline: `2px solid ${colorTokens.brand.mint}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  {codeCopied ? (
                    <CheckRoundedIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />
                  )}
                  {codeCopied ? 'Copiado' : 'Copiar'}
                </ButtonBase>
              </Box>
            )}
          </Box>
        </Box>

        {photo ? (
          <Box
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '120ms' }}
            sx={{
              gridArea: 'photo',
              alignSelf: 'center',
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              borderRadius: { xs: '24px', md: '32px' },
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 28px 56px rgba(0,0,0,0.3)',
            }}
          >
            <Image
              src={photo}
              alt={`Capa do evento ${title}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 480px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Box
            aria-hidden
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '120ms' }}
            sx={{
              gridArea: 'photo',
              alignSelf: 'center',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 260, sm: 340, md: 460 },
                height: { xs: 260, sm: 340, md: 460 },
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 68%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              className="animate-float-image motion-reduce:animate-none"
              sx={{
                position: 'relative',
                width: { xs: 280, sm: 380, md: '100%' },
                maxWidth: 520,
                aspectRatio: '6 / 5',
                filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.28))',
              }}
            >
              <Image
                src="/images/certificadoVariacao2.png"
                alt=""
                fill
                priority
                sizes="(max-width: 600px) 280px, (max-width: 900px) 380px, 520px"
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
