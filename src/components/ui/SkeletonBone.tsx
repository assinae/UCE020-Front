import { Box, alpha, type SxProps, type Theme } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface SkeletonBoneProps {
  sx?: SxProps<Theme>;
  /** Para fundos escuros (barras de navegação, cabeçalho do destaque). */
  dark?: boolean;
}

export function SkeletonBone({ sx, dark }: SkeletonBoneProps) {
  const white = colorTokens.neutral.white;
  const base = dark ? alpha(white, 0.08) : colorTokens.surface.hover;
  const shine = dark ? alpha(white, 0.18) : colorTokens.surface.muted;

  return (
    <Box
      aria-hidden
      className="animate-shimmer motion-reduce:animate-none"
      sx={[
        {
          borderRadius: '999px',
          background: `linear-gradient(90deg, ${base} 25%, ${shine} 50%, ${base} 75%)`,
          backgroundSize: '200% 100%',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
