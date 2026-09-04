'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { TutorialRoleContent } from '../data';

interface RoleCardProps {
  content: TutorialRoleContent;
  onSelect: () => void;
}

export function RoleCard({ content, onSelect }: RoleCardProps) {
  const Icon = content.icon;

  return (
    <Box
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      sx={{
        flex: 1,
        minWidth: { xs: '100%', sm: 280 },
        cursor: 'pointer',
        textAlign: 'left',
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: { xs: '18px', sm: '24px' },
        backgroundColor: '#fff',
        border: '1.5px solid #E5E9F0',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        outline: 'none',
        '&:hover, &:focus-visible': {
          transform: 'translateY(-6px)',
          boxShadow: `0 20px 40px ${content.accentBorder}`,
          borderColor: content.accent,
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 46, sm: 56 },
          height: { xs: 46, sm: 56 },
          borderRadius: { xs: '13px', sm: '16px' },
          backgroundColor: content.accentBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: { xs: 1.75, sm: 2.5 },
        }}
      >
        <Icon sx={{ fontSize: { xs: 22, sm: 28 }, color: content.accent }} />
      </Box>

      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.3rem' }, color: '#13284D', mb: 1 }}>
        {content.label}
      </Typography>

      <Typography sx={{ color: '#5B6470', fontSize: { xs: '0.88rem', sm: '0.95rem' }, lineHeight: 1.6, mb: { xs: 2, sm: 3 } }}>
        {content.pitch}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: content.accent,
          fontWeight: 700,
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
        }}
      >
        Ver tutorial <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  );
}
