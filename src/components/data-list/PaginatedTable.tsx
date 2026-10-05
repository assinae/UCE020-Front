'use client';

import type { ReactNode } from 'react';
import { Box, IconButton, alpha, useMediaQuery, useTheme } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;
const PER_PAGE_MOBILE = 6;
const PER_PAGE_DESKTOP = 8;

export type GridColumns = Record<'xs' | 'md', string>;

const columnLabelSx = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colorTokens.text.label,
} as const;

const pagerButtonSx = {
  width: 38,
  height: 38,
  border: `1.5px solid ${alpha(INK, 0.12)}`,
  bgcolor: WHITE,
  color: colorTokens.text.heading,
  transition: 'border-color .18s ease, color .18s ease',
  '&:hover': {
    bgcolor: WHITE,
    borderColor: colorTokens.brand.secondary,
    color: colorTokens.brand.secondary,
  },
  '&.Mui-disabled': { bgcolor: WHITE, opacity: 0.4 },
};

interface PaginatedTableProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderRow: (item: T) => ReactNode;
  /** Cabeçalho das colunas, só no desktop. */
  columns: { label: string; alignRight?: boolean }[];
  gridColumns: GridColumns;
  page: number;
  onPageChange: (page: number) => void;
  paginationLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function PaginatedTable<T>({
  items,
  getKey,
  renderRow,
  columns,
  gridColumns,
  page,
  onPageChange,
  paginationLabel,
  emptyTitle,
  emptyDescription,
}: PaginatedTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const perPage = isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  const rangeLabel =
    items.length === 0
      ? 'Nenhum resultado'
      : `${start + 1}–${Math.min(start + perPage, items.length)} de ${items.length}`;

  return (
    <Box
      component="section"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: '0.12s' }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: WHITE,
        border: `1px solid ${alpha(INK, 0.06)}`,
        borderRadius: '28px',
        boxShadow: `0 8px 24px ${alpha(colorTokens.shadow.ink, 0.07)}`,
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: gridColumns.md,
          gap: 2,
          py: 1.75,
          px: 2.5,
          bgcolor: colorTokens.surface.muted,
          borderBottom: `1px solid ${alpha(INK, 0.07)}`,
          borderRadius: '28px 28px 0 0',
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.label}
            component="span"
            sx={{ ...columnLabelSx, textAlign: column.alignRight ? 'right' : 'left' }}
          >
            {column.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {pageItems.map((item) => (
          <Box key={getKey(item)} sx={{ display: 'contents' }}>
            {renderRow(item)}
          </Box>
        ))}

        {items.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              py: 6,
              px: 2.5,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '999px',
                bgcolor: colorTokens.surface.muted,
                color: colorTokens.text.placeholder,
                border: `1px solid ${alpha(INK, 0.08)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box
              component="span"
              sx={{ fontSize: 14.5, fontWeight: 700, color: colorTokens.text.heading }}
            >
              {emptyTitle}
            </Box>
            <Box
              component="span"
              sx={{ fontSize: 13, fontWeight: 500, color: colorTokens.text.label }}
            >
              {emptyDescription}
            </Box>
          </Box>
        )}
      </Box>

      <Box
        component="nav"
        aria-label={paginationLabel}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexWrap: 'wrap',
          py: 1.75,
          px: 2.5,
          bgcolor: colorTokens.surface.muted,
          borderTop: `1px solid ${alpha(INK, 0.07)}`,
          borderRadius: '0 0 28px 28px',
        }}
      >
        <Box
          component="span"
          sx={{ fontSize: 12.5, fontWeight: 600, color: colorTokens.text.label }}
        >
          {rangeLabel}
        </Box>
        <Box sx={{ flex: 1, minWidth: 10 }} />
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          sx={pagerButtonSx}
        >
          <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.75 }}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const active = pageNumber === currentPage;
            return (
              <Box
                key={pageNumber}
                component="button"
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={active ? 'page' : undefined}
                sx={{
                  minWidth: 38,
                  height: 38,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${active ? INK : alpha(INK, 0.12)}`,
                  borderRadius: '999px',
                  bgcolor: active ? INK : WHITE,
                  color: active ? WHITE : colorTokens.text.heading,
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background .18s ease, border-color .18s ease, color .18s ease',
                  '&:hover': active
                    ? undefined
                    : {
                        borderColor: colorTokens.brand.secondary,
                        color: colorTokens.brand.secondary,
                      },
                }}
              >
                {pageNumber}
              </Box>
            );
          })}
        </Box>
        <Box
          component="span"
          sx={{
            display: { xs: 'block', md: 'none' },
            fontSize: 13,
            fontWeight: 700,
            color: colorTokens.text.heading,
          }}
        >
          {currentPage} de {totalPages}
        </Box>
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Próxima página"
          sx={pagerButtonSx}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
