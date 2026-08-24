'use client';

import { Box, Typography, Container } from '@mui/material';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';

const items = [
  {
    icon: ExtensionRoundedIcon,
    eyebrow: 'Como surgiu',
    title: 'Um projeto de extensão real',
    description:
      'O Assinaê nasceu através da UCE020, unidade curricular de extensão do curso de Engenharia de Computação da Universidade Estadual de Feira de Santana (UEFS). O projeto conectou os estudantes a um problema concreto da própria comunidade acadêmica.',
    accent: '#059669',
    accentBg: '#E8FFF6',
  },
  {
    icon: AccountBalanceRoundedIcon,
    eyebrow: 'O que é a UCE',
    title: 'Curricularização da extensão',
    description:
      'As UCEs (Unidades Curriculares de Extensão) fazem parte de uma diretriz do MEC que exige que cursos de graduação dediquem parte da carga horária a atividades que conectem a universidade à sociedade. A UCE020 foi o espaço onde o Assinaê ganhou vida.',
    accent: '#0EA5E9',
    accentBg: '#EFF8FF',
  },
  {
    icon: BuildRoundedIcon,
    eyebrow: 'O problema que resolvemos',
    title: 'Do problema à plataforma',
    description:
      'Eventos universitários enfrentam um gargalo recorrente: confirmar presença manualmente, somar carga horária e emitir certificados individualmente consome horas de trabalho. A UCE020 teve como missão atacar exatamente esse problema — e o resultado foi o Assinaê, uma plataforma completa que automatiza todo esse fluxo.',
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
  },
];

export function ProjectInfoSection() {
  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 6, md: 10 },
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container maxWidth="md">
        {/* Section header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 9 } }}>
          <Typography sx={{
            fontWeight: 800,
            color: '#13284D',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            fontSize: { xs: '1.8rem', md: '2.8rem' },
            mb: 2,
          }}>
            A história por trás do projeto
          </Typography>
          <Typography sx={{
            color: '#5B6470',
            maxWidth: '480px',
            mx: 'auto',
            lineHeight: 1.7,
            fontSize: { xs: '0.97rem', md: '1.05rem' },
          }}>
            Da sala de aula a uma solução usada por eventos reais na universidade.
          </Typography>
        </Box>

        {/* Timeline */}
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Vertical line */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: '27px',
            top: '28px',
            bottom: '28px',
            width: '2px',
            background: 'linear-gradient(180deg, #059669 0%, #0EA5E9 50%, #8B5CF6 100%)',
            opacity: 0.2,
            zIndex: 0,
          }} />

          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.title}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 3, md: 5 },
                  alignItems: { xs: 'flex-start', md: 'flex-start' },
                  position: 'relative',
                  zIndex: 1,
                  pb: index < items.length - 1 ? { xs: 5, md: 8 } : 0,
                }}
              >
                {/* Icon node */}
                <Box sx={{ flexShrink: 0, display: 'flex', alignItems: { xs: 'center', md: 'flex-start' }, pt: { xs: 0, md: 0.5 }, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '18px',
                    backgroundColor: item.accentBg,
                    border: `1.5px solid ${item.accent}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: 26, color: item.accent }} />
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  borderRadius: { xs: '24px', md: '28px' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 3, md: 3.5 },
                  textAlign: { xs: 'center', md: 'left' },
                  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}>
                  <Typography sx={{
                    display: 'inline-block',
                    color: item.accent,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    mb: 1,
                  }}>
                    {item.eyebrow}
                  </Typography>

                  <Typography sx={{
                    fontWeight: 800,
                    color: '#13284D',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.2,
                    mb: 1.5,
                  }}>
                    {item.title}
                  </Typography>

                  <Typography sx={{
                    color: '#5B6470',
                    fontSize: { xs: '0.92rem', md: '1rem' },
                    lineHeight: 1.75,
                  }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}