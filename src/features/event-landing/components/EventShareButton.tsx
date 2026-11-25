'use client';

import { useId, useState, type MouseEvent } from 'react';
import { ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { colorTokens } from '@/lib/colors';

interface EventShareButtonProps {
  whatsappHref: string;
  onCopyLink: () => void;
  onNativeShare?: () => void;
  sx?: SxProps<Theme>;
}

export function EventShareButton({
  whatsappHref,
  onCopyLink,
  onNativeShare,
  sx,
}: EventShareButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const baseId = useId();
  const buttonId = `${baseId}-button`;
  const menuId = `${baseId}-menu`;
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  const options = [
    {
      key: 'copy',
      icon: <LinkRoundedIcon />,
      label: 'Copiar link',
      hint: 'Para colar onde quiser',
      onClick: onCopyLink,
    },
    {
      key: 'whatsapp',
      icon: <WhatsAppIcon />,
      label: 'Enviar pelo WhatsApp',
      hint: 'Abre em nova aba',
      onClick: () => window.open(whatsappHref, '_blank', 'noopener,noreferrer'),
    },
    ...(onNativeShare
      ? [
          {
            key: 'native',
            icon: <MoreHorizRoundedIcon />,
            label: 'Mais opções',
            hint: 'Outros apps do aparelho',
            onClick: onNativeShare,
          },
        ]
      : []),
  ];

  return (
    <>
      <ButtonBase
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open}
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        sx={sx}
      >
        <IosShareRoundedIcon sx={{ fontSize: 19 }} />
        Compartilhar
        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 18,
            ml: -0.25,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s ease',
          }}
        />
      </ButtonBase>

      <Menu
        id={menuId}
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          list: { 'aria-labelledby': buttonId },
          paper: {
            sx: {
              mt: 1,
              minWidth: 250,
              p: 0.75,
              borderRadius: '20px',
              border: '1px solid rgba(13,30,59,0.08)',
              boxShadow: '0 18px 42px rgba(15,29,53,0.16)',
            },
          },
        }}
      >
        {options.map(({ key, icon, label, hint, onClick }) => (
          <MenuItem
            key={key}
            onClick={() => {
              close();
              onClick();
            }}
            sx={{
              gap: 0.5,
              py: 1.25,
              borderRadius: '14px',
              '&:hover': { backgroundColor: colorTokens.surface.mintSubtle },
            }}
          >
            <ListItemIcon sx={{ color: colorTokens.brand.secondary, minWidth: 36 }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              secondary={hint}
              slotProps={{
                primary: {
                  sx: { fontSize: 14.5, fontWeight: 700, color: colorTokens.text.heading },
                },
                secondary: { sx: { fontSize: 12.5, color: colorTokens.text.muted } },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
