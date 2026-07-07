import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { colorTokens } from '@/lib/colors';
import type { PresenceStatus } from '@/types/participant';

interface PresenceStatusIconProps {
  status: PresenceStatus;
}

export function PresenceStatusIcon({ status }: PresenceStatusIconProps) {
  const iconProps = { sx: { fontSize: 20, color: colorTokens.navigation.default } };

  if (status === 'confirmed') {
    return <CheckRoundedIcon {...iconProps} />;
  }

  return <RemoveRoundedIcon {...iconProps} />;
}
