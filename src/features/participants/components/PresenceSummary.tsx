import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { colorTokens } from '@/lib/colors';

interface PresenceSummaryProps {
  confirmed: number;
  pending: number;
}

interface SummaryChipProps {
  icon: ReactNode;
  count: number;
  label: string;
  color: string;
}

function SummaryChip({ icon, count, label, color }: SummaryChipProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        flex: 1,
        minWidth: 0,
        pl: 0.5,
        pr: { xs: 1, sm: 1.25 },
        py: 0.5,
        borderRadius: '999px',
        bgcolor: alpha(color, 0.12),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: '50%',
          bgcolor: color,
          color: colorTokens.neutral.white,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: { xs: 11.5, sm: 13 },
          color: colorTokens.text.primary,
          lineHeight: 1.25,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        <Box component="span" sx={{ fontWeight: 700 }}>
          {count}
        </Box>{' '}
        {label}
      </Typography>
    </Box>
  );
}

export function PresenceSummary({ confirmed, pending }: PresenceSummaryProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, flexWrap: 'nowrap' }}>
      <SummaryChip
        icon={<CheckRoundedIcon sx={{ fontSize: 14 }} />}
        count={confirmed}
        label={confirmed === 1 ? 'marcou' : 'marcaram'}
        color={colorTokens.status.success}
      />
      <SummaryChip
        icon={<RemoveRoundedIcon sx={{ fontSize: 14 }} />}
        count={pending}
        label={pending === 1 ? 'não marcou' : 'não marcaram'}
        color={colorTokens.neutral.gray500}
      />
    </Box>
  );
}
