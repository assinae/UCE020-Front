'use client';

import { useState } from 'react';
import { Box, ButtonBase, InputBase, Menu, MenuItem, alpha } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { colorTokens } from '@/lib/colors';
import type { SortDirection } from '@/utils/sortByName';

const INK = colorTokens.navigation.default;

const SORT_OPTIONS: { value: SortDirection; label: string }[] = [
  { value: 'asc', label: 'A–Z' },
  { value: 'desc', label: 'Z–A' },
];

// A barra superior fixa do desktop tem 72px; a busca gruda logo abaixo dela.
const STICKY_TOP = { xs: '12px', md: '84px' };

export interface ListToolbarFilter<T extends string> {
  label: string;
  value: T;
  /** A primeira opção é o "sem filtro"; o botão só fica destacado fora dela. */
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

interface ListToolbarProps<T extends string> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  sortDirection: SortDirection;
  onSortChange: (direction: SortDirection) => void;
  filter: ListToolbarFilter<T>;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Box
      component="li"
      role="presentation"
      sx={{
        px: 2,
        pt: 1,
        pb: 0.75,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colorTokens.text.label,
      }}
    >
      {children}
    </Box>
  );
}

function Option({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <MenuItem
      onClick={onClick}
      selected={selected}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1.5,
        py: 1.5,
        px: 2,
        fontSize: 14,
        fontWeight: selected ? 700 : 500,
        color: colorTokens.text.heading,
        '&.Mui-selected, &.Mui-selected:hover, &:hover': { bgcolor: colorTokens.surface.hover },
      }}
    >
      {label}
      <Box sx={{ display: 'flex', width: 18, color: colorTokens.brand.secondary }}>
        {selected && <CheckRoundedIcon sx={{ fontSize: 18 }} />}
      </Box>
    </MenuItem>
  );
}

export function ListToolbar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder,
  sortDirection,
  onSortChange,
  filter,
}: ListToolbarProps<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isActive = filter.value !== filter.options[0]?.value || !!anchor;

  function close() {
    setAnchor(null);
  }

  return (
    <Box
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: '0.06s' }}
      sx={{
        position: 'sticky',
        top: STICKY_TOP,
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        flexWrap: 'wrap',
        p: 1.5,
        border: `1px solid ${alpha(INK, 0.07)}`,
        borderRadius: '22px',
        bgcolor: alpha(colorTokens.neutral.white, 0.93),
        backdropFilter: 'blur(8px)',
        boxShadow: `0 6px 18px ${alpha(colorTokens.shadow.ink, 0.06)}`,
      }}
    >
      <Box
        component="label"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flex: 1,
          minWidth: 190,
          py: '11px',
          px: '18px',
          border: `1px solid ${alpha(INK, 0.08)}`,
          borderRadius: '999px',
          bgcolor: colorTokens.surface.muted,
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 19, color: colorTokens.brand.secondary }} />
        <InputBase
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          inputProps={{ 'aria-label': searchPlaceholder }}
          sx={{ flex: 1, minWidth: 0, fontSize: 14, p: 0, '& input': { p: 0 } }}
        />
      </Box>

      <ButtonBase
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        aria-label="Ordenar e filtrar"
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 1.25,
          px: 1.75,
          border: `1.5px solid ${isActive ? colorTokens.brand.secondary : alpha(INK, 0.12)}`,
          borderRadius: '999px',
          bgcolor: isActive ? colorTokens.surface.mint : colorTokens.neutral.white,
          color: colorTokens.brand.secondary,
          fontSize: 13,
          fontWeight: 800,
          transition: 'border-color .18s ease, background .18s ease',
          '&:hover': { borderColor: colorTokens.brand.secondary },
        }}
      >
        <TuneRoundedIcon sx={{ fontSize: 18 }} />
        {sortDirection === 'desc' ? 'Z–A' : 'A–Z'}
      </ButtonBase>

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
              width: 228,
              borderRadius: '18px',
              border: `1px solid ${alpha(INK, 0.08)}`,
              boxShadow: `0 18px 42px ${alpha(colorTokens.shadow.ink, 0.16)}`,
            },
          },
        }}
      >
        <SectionLabel>Ordenar por</SectionLabel>
        {SORT_OPTIONS.map((option) => (
          <Option
            key={option.value}
            label={option.label}
            selected={sortDirection === option.value}
            onClick={() => {
              onSortChange(option.value);
              close();
            }}
          />
        ))}
        <Box
          component="li"
          role="separator"
          sx={{ height: '1px', my: 0.75, bgcolor: alpha(INK, 0.08) }}
        />
        <SectionLabel>{filter.label}</SectionLabel>
        {filter.options.map((option) => (
          <Option
            key={option.value}
            label={option.label}
            selected={filter.value === option.value}
            onClick={() => {
              filter.onChange(option.value);
              close();
            }}
          />
        ))}
      </Menu>
    </Box>
  );
}
