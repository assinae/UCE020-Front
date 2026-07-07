import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { ContentCard } from '@/components/layout/ContentCard';
import { colorTokens } from '@/lib/colors';
import { ManagementSearchBar } from './ManagementSearchBar';

interface ManagementListCardProps {
  title: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchRow?: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export function ManagementListCard({
  title,
  search = '',
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  searchRow,
  isEmpty = false,
  emptyMessage = 'Nenhum registro encontrado',
  children,
}: ManagementListCardProps) {
  return (
    <ContentCard>
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: 20,
          color: colorTokens.navigation.default,
        }}
      >
        {title}
      </Typography>

      {searchRow ??
        (onSearchChange ? (
          <ManagementSearchBar
            search={search}
            onSearchChange={onSearchChange}
            placeholder={searchPlaceholder}
            ariaLabel={searchAriaLabel}
          />
        ) : null)}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isEmpty ? (
          <Typography
            sx={{ fontSize: 14, color: colorTokens.neutral.gray500, py: 2, textAlign: 'center' }}
          >
            {emptyMessage}
          </Typography>
        ) : (
          children
        )}
      </Box>
    </ContentCard>
  );
}
