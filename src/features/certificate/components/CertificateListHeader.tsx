import { Box, Typography, Tooltip } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import type { SortOrder } from '../utils/certificateFilters';

interface CertificateListHeaderProps {
  count: number;
  sortOrder: SortOrder;
  onToggleSort: () => void;
}

export function CertificateListHeader({
  count,
  sortOrder,
  onToggleSort,
}: CertificateListHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ArticleOutlinedIcon sx={{ fontSize: 18, color: '#0F1D35' }} />
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F1D35' }}>
          Certificados
        </Typography>
        <Box
          sx={{
            minWidth: 22,
            height: 20,
            px: 0.75,
            borderRadius: '999px',
            bgcolor: '#E8F5F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#1a6e5a' }}>{count}</Typography>
        </Box>
      </Box>
      <Tooltip title={sortOrder === 'asc' ? 'Ordenar Z → A' : 'Ordenar A → Z'}>
        <Box
          role="button"
          tabIndex={0}
          onClick={onToggleSort}
          onKeyDown={(e) => e.key === 'Enter' && onToggleSort()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            bgcolor: '#F1F5F9',
            '&:hover': { bgcolor: '#E2E8F0' },
            userSelect: 'none',
          }}
        >
          <Typography sx={{ fontSize: 12, color: '#64748B' }}>
            {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </Typography>
          <SwapVertIcon sx={{ fontSize: 18, color: '#64748B' }} />
        </Box>
      </Tooltip>
    </Box>
  );
}
