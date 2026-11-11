import { Box } from '@mui/material';
import { colorTokens } from '@/lib/colors';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

interface UserAvatarProps {
  name: string;
  size?: number;
}

export function UserAvatar({ name, size = 32 }: UserAvatarProps) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '999px',
        bgcolor: colorTokens.brand.primary,
        color: colorTokens.navigation.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.35),
        fontWeight: 800,
      }}
    >
      {getInitials(name)}
    </Box>
  );
}
