import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { BackButton } from '@/components/ui';
import { ContentCard } from '@/components/layout/ContentCard';
import { colorTokens } from '@/lib/colors';
import { ManagementSearchBar } from './ManagementSearchBar';
import { ListToolbarMenu, type ToolbarFilterGroup } from './ListToolbarMenu';
import type { SortDirection } from '@/utils/sortByName';

interface ManagementListCardProps {
  title: string;
  /** Some quando indefinido. Mostre a contagem do que está na tela, não o total. */
  count?: number;
  countLabel?: string;
  subtitle?: ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchRow?: ReactNode;
  /** O menu aparece com qualquer um dos dois: ordenação, filtro, ou ambos. */
  sortDirection?: SortDirection;
  onSortChange?: (direction: SortDirection) => void;
  filterGroup?: ToolbarFilterGroup;
  backFallbackHref?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export function ManagementListCard({
  title,
  count,
  countLabel = 'itens',
  subtitle,
  search = '',
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  searchRow,
  sortDirection = 'asc',
  onSortChange,
  filterGroup,
  backFallbackHref,
  isEmpty = false,
  emptyMessage = 'Nenhum registro encontrado',
  children,
}: ManagementListCardProps) {
  return (
    <ContentCard sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {backFallbackHref && (
          <BackButton
            fallbackHref={backFallbackHref}
            size="small"
            sx={{ ml: -0.5, color: colorTokens.text.primary }}
          />
        )}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: 20, sm: 22 },
            color: colorTokens.navigation.default,
          }}
        >
          {title}
          {count !== undefined && (
            <Box
              component="span"
              aria-label={`${count} ${countLabel}`}
              // Inline dentro do título: quando o texto quebra no celular, a
              // contagem segue a última palavra em vez de cair sozinha.
              sx={{
                display: 'inline-block',
                verticalAlign: 'middle',
                ml: 1,
                px: 1.25,
                py: 0.1,
                borderRadius: '999px',
                backgroundColor: colorTokens.neutral.gray300,
                color: colorTokens.neutral.gray700,
                fontSize: { xs: 13, sm: 14 },
                fontWeight: 600,
              }}
            >
              {count}
            </Box>
          )}
        </Typography>
      </Box>

      {subtitle}

      {searchRow ??
        (onSearchChange ? (
          <ManagementSearchBar
            search={search}
            onSearchChange={onSearchChange}
            placeholder={searchPlaceholder}
            ariaLabel={searchAriaLabel}
          />
        ) : null)}

      {(onSortChange || filterGroup) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -0.5, mb: 0.5 }}>
          <ListToolbarMenu
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            filterGroup={filterGroup}
          />
        </Box>
      )}

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
