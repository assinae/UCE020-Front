'use client';

import { useState, type ReactNode } from 'react';
import { Box, IconButton, Menu, MenuItem, alpha } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { colorTokens } from '@/lib/colors';

export interface RowAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** `primary` vira o botão verde do topo; `danger` fica vermelho no hover. */
  tone?: 'primary' | 'danger' | 'default';
}

interface RowActionsMenuProps {
  ariaLabel: string;
  actions: RowAction[];
}

const toneSx = {
  primary: {
    bgcolor: colorTokens.brand.secondary,
    color: colorTokens.neutral.white,
    fontWeight: 700,
    '&:hover': { bgcolor: colorTokens.brand.secondaryDark },
  },
  danger: {
    color: colorTokens.text.heading,
    fontWeight: 600,
    '&:hover': { bgcolor: colorTokens.surface.dangerSubtle, color: colorTokens.status.error },
  },
  default: {
    color: colorTokens.text.heading,
    fontWeight: 600,
    '&:hover': { bgcolor: colorTokens.surface.hover },
  },
};

export function RowActionsMenu({ ariaLabel, actions }: RowActionsMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  function close() {
    setAnchor(null);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        sx={{
          width: 38,
          height: 38,
          borderRadius: '12px',
          bgcolor: anchor ? colorTokens.surface.hover : 'transparent',
          color: colorTokens.text.muted,
          '&:hover': { bgcolor: colorTokens.surface.hover, color: colorTokens.text.heading },
        }}
      >
        <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 236,
              borderRadius: '20px',
              border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
              boxShadow: `0 18px 42px ${alpha(colorTokens.shadow.ink, 0.16)}`,
            },
          },
          list: { sx: { p: 1, display: 'flex', flexDirection: 'column', gap: '2px' } },
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            disabled={action.disabled}
            onClick={() => {
              close();
              action.onClick();
            }}
            sx={{
              gap: 1.5,
              py: 1.5,
              px: 1.75,
              borderRadius: '14px',
              fontSize: 14,
              transition: 'background .16s ease, color .16s ease',
              '& svg': { fontSize: 18 },
              '&.Mui-disabled': { opacity: 0.4 },
              ...toneSx[action.tone ?? 'default'],
            }}
          >
            {action.icon}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
