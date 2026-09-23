'use client';

import { useState } from 'react';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Button } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import type { SortDirection } from '@/utils/sortByName';

export interface ToolbarFilterGroup {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface ListToolbarMenuProps {
  sortDirection?: SortDirection;
  /** Sem isto a seção de ordenação não aparece. */
  onSortChange?: (direction: SortDirection) => void;
  /** Grupo de filtro específico da tela. Independe da ordenação. */
  filterGroup?: ToolbarFilterGroup;
}

const SORT_OPTIONS: { value: SortDirection; label: string }[] = [
  { value: 'asc', label: 'A–Z' },
  { value: 'desc', label: 'Z–A' },
];

export function ListToolbarMenu({
  sortDirection = 'asc',
  onSortChange,
  filterGroup,
}: ListToolbarMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const filterLabel = filterGroup?.options.find(
    (option) => option.value === filterGroup.value
  )?.label;
  // O filtro só entra no rótulo quando sai do padrão, senão o botão fica longo
  // à toa no celular.
  const isFiltering = !!filterGroup && filterGroup.value !== filterGroup.options[0]?.value;

  const rotulo = [
    onSortChange ? (sortDirection === 'asc' ? 'A–Z' : 'Z–A') : null,
    isFiltering ? filterLabel : null,
  ]
    .filter(Boolean)
    .join(' · ');

  function close() {
    setAnchor(null);
  }

  // Cada seção é opcional, então sem nenhuma das duas não há o que mostrar.
  if (!onSortChange && !filterGroup) return null;

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        size="small"
        onClick={(event) => setAnchor(event.currentTarget)}
        leftIcon={<TuneRoundedIcon sx={{ fontSize: 18 }} />}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        aria-label={onSortChange ? 'Ordenar e filtrar a lista' : 'Filtrar a lista'}
        sx={{ fontSize: 13, fontWeight: 600, px: 1 }}
      >
        {rotulo || 'Filtrar'}
      </Button>

      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 210 } } }}
      >
        {onSortChange && <SectionLabel>Ordenar por</SectionLabel>}
        {onSortChange &&
          SORT_OPTIONS.map((option) => (
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

        {onSortChange && filterGroup && <Divider sx={{ my: 0.5 }} />}
        {filterGroup && <SectionLabel>{filterGroup.label}</SectionLabel>}
        {filterGroup?.options.map((option) => (
          <Option
            key={option.value}
            label={option.label}
            selected={filterGroup.value === option.value}
            onClick={() => {
              filterGroup.onChange(option.value);
              close();
            }}
          />
        ))}
      </Menu>
    </>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        px: 2,
        pt: 1,
        pb: 0.5,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        color: colorTokens.neutral.gray500,
      }}
    >
      {children}
    </Typography>
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
      sx={{ fontSize: 14, py: 0.9, display: 'flex', justifyContent: 'space-between', gap: 2 }}
    >
      {label}
      <Box sx={{ display: 'flex', width: 18 }}>
        {selected && (
          <CheckRoundedIcon sx={{ fontSize: 18, color: colorTokens.brand.secondary }} />
        )}
      </Box>
    </MenuItem>
  );
}
