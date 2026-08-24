import type { ReactNode } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
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
  onBack?: () => void;
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
  onBack,
  isEmpty = false,
  emptyMessage = 'Nenhum registro encontrado',
  children,
}: ManagementListCardProps) {
  return (
    <ContentCard sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            aria-label="Voltar"
            size="small"
            sx={{ ml: -0.5, color: colorTokens.text.primary }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        )}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: 20, sm: 22 },
            color: colorTokens.navigation.default,
          }}
        >
          {title}
        </Typography>
      </Box>

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
