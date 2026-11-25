'use client';

import { useState, useSyncExternalStore } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { EventShareButton } from '@/features/event-landing';
import { colorTokens } from '@/lib/colors';

interface EventPublicPageCardProps {
  href: string;
  eventName: string;
}

const subscribeNoop = () => () => {};

const actionSx = {
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  px: 1.5,
  borderRadius: 999,
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  transition: 'transform .18s ease, background-color .18s ease, border-color .18s ease',
  '&:hover': { transform: 'translateY(-2px)' },
  '&:focus-visible': { outline: `2px solid ${colorTokens.brand.secondary}`, outlineOffset: 2 },
  '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
} as const;

export function EventPublicPageCard({ href, eventName }: EventPublicPageCardProps) {
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => ''
  );
  const fullUrl = `${origin}${href}`;
  const displayUrl = fullUrl.replace(/^https?:\/\//, '');
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${eventName}: veja a programação e participe ${fullUrl}`
  )}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Box
      className="animate-fade-up motion-reduce:animate-none"
      sx={{
        borderRadius: '24px',
        p: { xs: 2, md: 2.25 },
        bgcolor: colorTokens.surface.mintSubtle,
        border: `1px solid ${colorTokens.surface.mintStrong}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.75,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: '12px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.brand.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PublicRoundedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 14.5, fontWeight: 800, color: colorTokens.text.heading, lineHeight: 1.25 }}
          >
            Página pública do evento
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: colorTokens.text.muted, lineHeight: 1.4 }}>
            Divulgue este link para quem ainda não está no Assinaê.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: 44,
          pl: 1.75,
          pr: 0.5,
          borderRadius: 999,
          bgcolor: colorTokens.neutral.white,
          border: '1px solid rgba(13, 30, 59, 0.1)',
        }}
      >
        <Typography
          title={fullUrl}
          sx={{
            flex: 1,
            minWidth: 0,
            color: colorTokens.text.heading,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayUrl || href}
        </Typography>
        <ButtonBase
          onClick={handleCopy}
          aria-label="Copiar link da página pública"
          sx={{
            flexShrink: 0,
            gap: 0.5,
            height: 34,
            px: 1.5,
            borderRadius: 999,
            fontFamily: 'inherit',
            fontSize: 12.5,
            fontWeight: 700,
            color: copied ? colorTokens.brand.secondary : colorTokens.text.heading,
            bgcolor: copied ? colorTokens.surface.mint : colorTokens.surface.hover,
            transition: 'background-color .18s ease',
            '&:hover': { bgcolor: colorTokens.surface.mint },
          }}
        >
          {copied ? (
            <CheckRoundedIcon sx={{ fontSize: 16 }} />
          ) : (
            <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />
          )}
          {copied ? 'Copiado' : 'Copiar'}
        </ButtonBase>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <ButtonBase
          component="a"
          href={href}
          target="_blank"
          rel="noopener"
          sx={{
            ...actionSx,
            bgcolor: colorTokens.brand.secondary,
            color: colorTokens.text.inverse,
            '&:hover': { ...actionSx['&:hover'], bgcolor: colorTokens.brand.secondaryDark },
          }}
        >
          Abrir página
          <OpenInNewRoundedIcon sx={{ fontSize: 17 }} />
        </ButtonBase>
        <EventShareButton
          whatsappHref={whatsappHref}
          onCopyLink={handleCopy}
          sx={{
            ...actionSx,
            bgcolor: colorTokens.neutral.white,
            color: colorTokens.text.heading,
            border: '1.5px solid rgba(13, 30, 59, 0.14)',
            '&:hover': { ...actionSx['&:hover'], borderColor: colorTokens.brand.secondary },
          }}
        />
      </Box>
    </Box>
  );
}
