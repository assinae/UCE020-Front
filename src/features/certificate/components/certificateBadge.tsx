import { Box } from '@mui/material';

interface CertificateBadgeProps {
  label: string;
  bgcolor: string;
  color: string;
}

export function CertificateBadge({ label, bgcolor, color }: CertificateBadgeProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1,
        height: 20,
        borderRadius: '6px',
        bgcolor,
        color,
        fontSize: 10,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  );
}
