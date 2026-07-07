'use client';

import { Box, Container, Typography, IconButton, Divider } from '@mui/material';

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#13284D',
        color: '#FFFFFF',

        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',

            display: 'flex',

            justifyContent: 'center',

            alignItems: 'center',

            flexWrap: 'wrap',

            gap: 1.2,

            mb: 3,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.08)',

              color: '#FFFFFF',

              width: 42,

              height: 42,

              transition: '0.2s ease',

              '&:hover': {
                backgroundColor: '#059669',

                transform: 'translateY(-2px)',
              },
            }}
          >
            <InstagramIcon fontSize="small" />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.08)',

              color: '#FFFFFF',

              width: 42,

              height: 42,

              transition: '0.2s ease',

              '&:hover': {
                backgroundColor: '#059669',

                transform: 'translateY(-2px)',
              },
            }}
          >
            <LinkedInIcon fontSize="small" />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.08)',

              color: '#FFFFFF',

              width: 42,

              height: 42,

              transition: '0.2s ease',

              '&:hover': {
                backgroundColor: '#059669',

                transform: 'translateY(-2px)',
              },
            }}
          >
            <GitHubIcon fontSize="small" />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.08)',

              color: '#FFFFFF',

              width: 42,

              height: 42,

              transition: '0.2s ease',

              '&:hover': {
                backgroundColor: '#059669',

                transform: 'translateY(-2px)',
              },
            }}
          >
            <EmailIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,0.12)',

            my: 2.5,
          }}
        />

        <Box
          sx={{
            display: 'flex',

            flexDirection: {
              xs: 'column',
              md: 'row',
            },

            alignItems: 'center',

            justifyContent: 'center',

            gap: {
              xs: 1,
              md: 3,
            },
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.65)',

              fontSize: {
                xs: '0.85rem',
                md: '0.92rem',
              },

              textAlign: 'center',
            }}
          >
            © {new Date().getFullYear()} Assinaê. Todos os direitos reservados.
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.65)',

              fontSize: {
                xs: '0.85rem',
                md: '0.92rem',
              },

              textAlign: 'center',
            }}
          >
            Desenvolvido por estudantes de Engenharia de Computação - UEFS.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}