import { Box, ButtonBase, Typography, alpha } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface CertificateStatCardProps {
  label: string;
  value: number;
  isTotal?: boolean;
  selected?: boolean;
  onClick: () => void;
}

export function CertificateStatCard({
  label,
  value,
  isTotal = false,
  selected = false,
  onClick,
}: CertificateStatCardProps) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${label}: ${value} certificados`}
      sx={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        height: isTotal ? { xs: 56, md: '100%' } : { xs: 44, sm: 48 },
        alignSelf: 'stretch',
        overflow: 'hidden',
        gridColumn: isTotal ? { xs: '1', md: '2' } : 'auto',
        display: 'flex',
        flexDirection: isTotal ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isTotal ? 'center' : 'space-between',
        gap: 1,
        py: 1.1,
        px: { xs: 1.5, sm: 2 },
        borderRadius: '16px',
        bgcolor: colorTokens.neutral.white,
        border: `1px solid ${alpha(colorTokens.navigation.default, selected ? 0.16 : 0.08)}`,
        boxShadow: `0 3px 10px ${alpha(colorTokens.shadow.ink, selected ? 0.07 : 0.035)}`,
        transition: 'transform .18s ease, box-shadow .18s ease, background-color .18s ease',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: selected ? '100%' : 0,
          height: 3,
          borderRadius: '0 0 16px 16px',
          bgcolor: colorTokens.brand.secondary,
          transition: 'opacity .18s ease',
          opacity: selected ? 1 : 0,
        },
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: `0 10px 24px ${alpha(colorTokens.navigation.default, selected ? 0.22 : 0.1)}`,
          bgcolor: colorTokens.surface.rowHover,
        },
        '&.Mui-focusVisible': {
          outline: `2px solid ${colorTokens.brand.secondary}`,
          outlineOffset: -3,
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: isTotal ? 'column' : 'row', alignItems: 'center', gap: isTotal ? 0.5 : 0, textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: isTotal ? { xs: 13, sm: 14 } : { xs: 11, sm: 12 },
            color: selected ? colorTokens.brand.secondary : colorTokens.text.label,
            textAlign: isTotal ? 'center' : 'left',
            fontWeight: 700,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          flexShrink: 0,
          minWidth: 28,
          textAlign: isTotal ? 'center' : 'right',
          fontSize: isTotal ? { xs: 18, sm: 20 } : { xs: 15, sm: 16 },
          fontWeight: 800,
          color: selected ? colorTokens.brand.secondary : colorTokens.text.heading,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </ButtonBase>
  );
}
