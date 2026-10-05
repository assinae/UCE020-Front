import type { ReactNode } from 'react';
import { Box, alpha } from '@mui/material';
import { colorTokens } from '@/lib/colors';
import type { GridColumns } from './PaginatedTable';

const WHITE = colorTokens.neutral.white;

interface DataRowProps {
  gridColumns: GridColumns;
  children: ReactNode;
}

export function DataRow({ gridColumns, children }: DataRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: { xs: 1, md: 2 },
        alignItems: 'center',
        py: 1.5,
        px: 2.5,
        borderBottom: `1px solid ${alpha(colorTokens.navigation.default, 0.05)}`,
        transition: 'background .16s ease',
        '&:hover': { bgcolor: colorTokens.surface.rowHover },
      }}
    >
      {children}
    </Box>
  );
}

function initialsOf(name: string): string {
  const words = name.split(' ').filter((word) => word.length > 2);
  const initials = (words.length > 0 ? words : [name]).slice(0, 2).map((word) => word[0]);
  return initials.join('').toUpperCase();
}

interface RowIdentityProps {
  name: string;
  email?: string;
  avatarBg: string;
  avatarColor: string;
  /** Selo no canto do avatar e linha de status, que substituem a coluna extra no celular. */
  mobileBadge: { bg: string; icon: ReactNode };
  mobileStatus: { label: string; color: string };
}

export function RowIdentity({
  name,
  email,
  avatarBg,
  avatarColor,
  mobileBadge,
  mobileStatus,
}: RowIdentityProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px', minWidth: 0 }}>
      <Box
        aria-hidden
        sx={{
          position: 'relative',
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: '999px',
          bgcolor: avatarBg,
          color: avatarColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12.5,
          fontWeight: 800,
        }}
      >
        {initialsOf(name)}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            right: -3,
            bottom: -3,
            width: 17,
            height: 17,
            borderRadius: '999px',
            border: `2px solid ${WHITE}`,
            bgcolor: mobileBadge.bg,
            color: WHITE,
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': { fontSize: 10 },
          }}
        >
          {mobileBadge.icon}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
        <Box
          component="span"
          sx={{
            fontSize: 14.5,
            fontWeight: 600,
            color: colorTokens.text.heading,
            textWrap: 'pretty',
          }}
        >
          {name}
        </Box>
        {email && (
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: 12,
              fontWeight: 500,
              color: colorTokens.text.placeholder,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {email}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            display: { xs: 'flex', md: 'none' },
            fontSize: 12.5,
            fontWeight: 700,
            color: mobileStatus.color,
          }}
        >
          {mobileStatus.label}
        </Box>
      </Box>
    </Box>
  );
}

interface StatusPillProps {
  label: string;
  bg: string;
  color: string;
}

export function StatusPill({ label, bg, color }: StatusPillProps) {
  return (
    <Box
      component="span"
      sx={{
        display: { xs: 'none', md: 'inline-flex' },
        justifySelf: 'start',
        alignItems: 'center',
        gap: '7px',
        py: '5px',
        px: 1.5,
        borderRadius: '999px',
        bgcolor: bg,
        color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <Box
        sx={{ width: 6, height: 6, flexShrink: 0, borderRadius: '999px', bgcolor: 'currentColor' }}
      />
      {label}
    </Box>
  );
}
