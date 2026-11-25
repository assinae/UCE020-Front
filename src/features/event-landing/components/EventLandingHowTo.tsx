import { Box, Typography } from '@mui/material';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { colorTokens } from '@/lib/colors';
import { EventLandingSection } from './EventLandingSection';

interface EventLandingHowToProps {
  id: string;
  code: string | null;
}

export function EventLandingHowTo({ id, code }: EventLandingHowToProps) {
  const steps = [
    {
      icon: PersonAddAlt1RoundedIcon,
      title: 'Inscreva-se',
      text: code
        ? `Entre no Assinaê (ou crie sua conta) e busque o código ${code} na tela inicial.`
        : 'Entre no Assinaê (ou crie sua conta) e encontre o evento.',
    },
    {
      icon: QrCode2RoundedIcon,
      title: 'Registre presença',
      text: 'Em cada atividade, mostre o seu QR Code para a monitoria. Leva poucos segundos.',
    },
    {
      icon: WorkspacePremiumRoundedIcon,
      title: 'Receba o certificado',
      text: 'Ao fim do evento, o certificado fica no seu perfil, com código de verificação.',
    },
  ];

  return (
    <EventLandingSection
      id={id}
      badge="Simples do início ao fim"
      title="Como participar"
      description="Três passos, sem papel nem lista de presença."
    >
      <Box
        component="ol"
        sx={{
          m: 0,
          p: 0,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 5, md: 4 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: 36,
            left: 'calc(16.66% + 36px)',
            right: 'calc(16.66% + 36px)',
            height: '1px',
            backgroundColor: colorTokens.brand.secondary,
            opacity: 0.25,
          }}
        />
        {steps.map(({ icon: Icon, title, text }, index) => (
          <Box
            component="li"
            key={title}
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: `${index * 80}ms` }}
            sx={{
              listStyle: 'none',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: colorTokens.surface.mint,
                border: '1px solid rgba(0,137,99,0.2)',
                color: colorTokens.brand.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <Icon sx={{ fontSize: 32 }} />
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: colorTokens.brand.secondary,
                  color: colorTokens.text.inverse,
                  fontSize: 12,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${colorTokens.neutral.white}`,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Box>
            </Box>
            <Typography
              component="h3"
              sx={{ fontSize: 18, fontWeight: 800, color: colorTokens.text.heading }}
            >
              {title}
            </Typography>
            <Typography
              sx={{ maxWidth: 300, fontSize: 15, lineHeight: 1.65, color: colorTokens.text.muted }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </EventLandingSection>
  );
}
