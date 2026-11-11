import { Box, IconButton, Typography } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { colorTokens } from '@/lib/colors';

interface EventCodeCardProps {
  code?: string | null;
  copied: boolean;
  onCopy: () => void;
}

export function EventCodeCard({ code, copied, onCopy }: EventCodeCardProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        p: { xs: 2, md: 2.25 },
        background: 'linear-gradient(135deg, #13284D 0%, #0D1E3B 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -50,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: 'rgba(110, 215, 180, 0.12)',
        }}
      />
      <Box sx={{ position: 'relative', minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: copied ? colorTokens.brand.primary : 'rgba(255, 255, 255, 0.62)',
          }}
        >
          {copied ? 'Código copiado!' : 'Código do evento'}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 22, md: 24 },
            fontWeight: 800,
            letterSpacing: '0.08em',
            lineHeight: 1.2,
            overflowWrap: 'anywhere',
          }}
        >
          {code || 'Sem código'}
        </Typography>
      </Box>
      {/* Sem código não há o que copiar: o botão não aparece. */}
      {code ? (
        <IconButton
          onClick={onCopy}
          aria-label="Copiar código do evento"
          sx={{
            position: 'relative',
            flexShrink: 0,
            width: 44,
            height: 44,
            color: '#FFFFFF',
            bgcolor: copied ? 'rgba(118, 227, 188, 0.24)' : 'rgba(255, 255, 255, 0.14)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.24)' },
          }}
        >
          {copied ? (
            <CheckRoundedIcon sx={{ fontSize: 20 }} />
          ) : (
            <ContentCopyRoundedIcon sx={{ fontSize: 19 }} />
          )}
        </IconButton>
      ) : null}
    </Box>
  );
}
