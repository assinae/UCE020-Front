import { Box, Typography } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { colorTokens } from '@/lib/colors';

// Pilha decorativa: a API não devolve fotos dos inscritos, então os avatares
// são genéricos e só o número é dado real.
const AVATAR_TONES = [
  { bg: colorTokens.brand.primary, color: colorTokens.surface.ink },
  { bg: colorTokens.text.heading, color: '#FFFFFF' },
  { bg: colorTokens.surface.mintStrong, color: colorTokens.text.mint },
];

export function EventAttendeesSummary({ total }: { total: number }) {
  const visible = total === 0 ? 0 : Math.min(total, AVATAR_TONES.length);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.75,
        borderRadius: '20px',
        bgcolor: colorTokens.surface.panel,
        border: '1px solid rgba(13, 30, 59, 0.05)',
      }}
    >
      {visible > 0 ? (
        <Box sx={{ display: 'flex', flexShrink: 0 }} aria-hidden>
          {AVATAR_TONES.slice(0, visible).map((tone, index) => (
            <Box
              key={tone.bg}
              sx={{
                width: 34,
                height: 34,
                ml: index === 0 ? 0 : '-10px',
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
                bgcolor: tone.bg,
                color: tone.color,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          ))}
        </Box>
      ) : null}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: colorTokens.text.heading, fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>
          {total === 1 ? '1 inscrito' : `${total} inscritos`}
        </Typography>
        <Typography sx={{ color: colorTokens.text.label, fontSize: 12.5, fontWeight: 500 }}>
          {total === 0 ? 'Seja o primeiro a se inscrever' : 'já garantiram presença'}
        </Typography>
      </Box>
    </Box>
  );
}
