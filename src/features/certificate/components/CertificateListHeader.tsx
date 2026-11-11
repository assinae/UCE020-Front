import { Box, Typography, Tooltip, ButtonBase, alpha } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import type { SortOrder } from '../utils/certificateFilters';
import { colorTokens } from '@/lib/colors';

interface CertificateListHeaderProps {
  groupLabel: string;
  count: number;
  sortOrder: SortOrder;
  onToggleSort: () => void;
}

export function CertificateListHeader({
  groupLabel,
  count,
  sortOrder,
  onToggleSort,
}: CertificateListHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: '11px', bgcolor: colorTokens.surface.mint, display: 'grid', placeItems: 'center' }}>
          <ArticleOutlinedIcon sx={{ fontSize: 18, color: colorTokens.brand.secondary }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2, color: colorTokens.text.heading }}>
            {groupLabel}
          </Typography>
          <Typography sx={{ mt: 0.2, fontSize: 11, color: colorTokens.text.muted, lineHeight: 1.2 }}>
            {count === 1 ? '1 resultado encontrado' : `${count} resultados encontrados`}
          </Typography>
        </Box>
      </Box>
      <Tooltip title={sortOrder === 'asc' ? 'Ordenar Z → A' : 'Ordenar A → Z'}>
        <ButtonBase
          aria-label={sortOrder === 'asc' ? 'Ordenar de Z a A' : 'Ordenar de A a Z'}
          onClick={onToggleSort}
          onKeyDown={(e) => e.key === 'Enter' && onToggleSort()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1.25,
            py: 0.75,
            borderRadius: '12px',
            bgcolor: colorTokens.neutral.white,
            border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
            '&:hover': { bgcolor: colorTokens.surface.mintSubtle, borderColor: alpha(colorTokens.brand.secondary, 0.3) },
            userSelect: 'none',
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: colorTokens.text.muted }}>
            {sortOrder === 'asc' ? 'Nome A–Z' : 'Nome Z–A'}
          </Typography>
          <SwapVertIcon sx={{ fontSize: 18, color: colorTokens.brand.secondary }} />
        </ButtonBase>
      </Tooltip>
    </Box>
  );
}
