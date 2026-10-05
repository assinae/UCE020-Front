import Link from 'next/link';
import { Box, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;

const TITLE = 'Nenhum evento ativo neste período';
const SUBTITLE = 'Veja como participar de um evento.';

const STEPS = [
  {
    title: 'Peça o código ao organizador',
    description: 'Cada evento tem um código, como SEM4821.',
  },
  { title: 'Pesquise e inscreva-se', description: 'Digite o código na busca acima.' },
  {
    title: 'Marque presença e receba o certificado',
    description: 'Valide o QR Code nas atividades.',
  },
];

const cardSx = {
  bgcolor: WHITE,
  border: `1px solid ${alpha(INK, 0.06)}`,
  borderRadius: '28px',
  boxShadow: `0 8px 24px ${alpha(colorTokens.shadow.ink, 0.07)}`,
};

function DesktopState() {
  return (
    <Box
      sx={{
        ...cardSx,
        display: { xs: 'none', md: 'grid' },
        gridTemplateColumns: 'minmax(0, .9fr) minmax(0, 1.6fr)',
        gap: 3.5,
        alignItems: 'center',
        p: 3.5,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '18px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.brand.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box
            component="h3"
            sx={{
              m: 0,
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: colorTokens.text.heading,
            }}
          >
            {TITLE}
          </Box>
          <Box
            component="p"
            sx={{ m: 0, fontSize: 13.5, lineHeight: 1.5, color: colorTokens.text.muted }}
          >
            {SUBTITLE}
          </Box>
        </Box>
      </Box>

      <Box
        component="ol"
        sx={{
          m: 0,
          p: 0,
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1.5,
        }}
      >
        {STEPS.map((step, index) => {
          const highlighted = index === STEPS.length - 1;
          return (
            <Box
              component="li"
              key={step.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                p: '18px',
                minHeight: 170,
                borderRadius: '22px',
                bgcolor: highlighted ? INK : colorTokens.surface.muted,
                border: highlighted ? 'none' : `1px solid ${alpha(INK, 0.05)}`,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: highlighted ? colorTokens.brand.primary : colorTokens.brand.secondary,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: highlighted ? WHITE : colorTokens.text.heading,
                }}
              >
                {step.title}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: highlighted ? alpha(WHITE, 0.72) : colorTokens.text.muted,
                }}
              >
                {step.description}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function MobileState() {
  return (
    <Box
      sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, maxWidth: 560 }}
    >
      <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 1.75, p: '22px 20px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box
            component="h3"
            sx={{ m: 0, fontSize: 15, fontWeight: 800, color: colorTokens.text.heading }}
          >
            {TITLE}
          </Box>
          <Box
            component="p"
            sx={{ m: 0, fontSize: 13, lineHeight: 1.5, color: colorTokens.text.muted }}
          >
            {SUBTITLE}
          </Box>
        </Box>

        <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {STEPS.map((step, index) => {
            const last = index === STEPS.length - 1;
            return (
              <Box
                component="li"
                key={step.title}
                sx={{
                  display: 'flex',
                  gap: 1.75,
                  pt: 1.5,
                  pb: last ? '2px' : 1.5,
                  borderBottom: last ? 'none' : `1px solid ${alpha(INK, 0.06)}`,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    borderRadius: '999px',
                    bgcolor: INK,
                    color: colorTokens.brand.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Box
                    component="span"
                    sx={{ fontSize: 14, fontWeight: 700, color: colorTokens.text.heading }}
                  >
                    {step.title}
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontSize: 12.5, lineHeight: 1.45, color: colorTokens.text.muted }}
                  >
                    {step.description}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2, p: '22px' }}>
        <Box
          component="span"
          sx={{
            alignSelf: 'flex-start',
            px: 1.5,
            py: 0.5,
            borderRadius: '999px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.text.mint,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Quer organizar?
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box
            component="h3"
            sx={{
              m: 0,
              fontSize: 19,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: colorTokens.text.heading,
            }}
          >
            Crie seu evento e emita certificados
          </Box>
          <Box
            component="p"
            sx={{ m: 0, fontSize: 13, lineHeight: 1.5, color: colorTokens.text.muted }}
          >
            Cadastre atividades, valide presenças por QR Code e gere os certificados no final.
          </Box>
        </Box>
        <Box
          component={Link}
          href="/event/register"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '9px',
            width: '100%',
            py: 1.75,
            px: 2.5,
            border: `1.5px solid ${alpha(INK, 0.14)}`,
            borderRadius: '999px',
            bgcolor: WHITE,
            color: colorTokens.text.heading,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'border-color .18s ease, color .18s ease, background .18s ease',
            '&:hover': {
              borderColor: colorTokens.brand.secondary,
              color: colorTokens.brand.secondary,
              bgcolor: colorTokens.surface.mintSubtle,
            },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          Criar novo evento
        </Box>
      </Box>
    </Box>
  );
}

export function NoEventsState() {
  return (
    <>
      <DesktopState />
      <MobileState />
    </>
  );
}
