'use client';

import Image from 'next/image';
import { Box, Typography, Container, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const teamMembers = [
  {
    name: 'João Pedro',
    role: 'Desenvolvedor Front-end',
    image: 'https://i.pravatar.cc/300?img=1',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Maria Clara',
    role: 'UX/UI Designer',
    image: 'https://i.pravatar.cc/300?img=32',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Lucas Andrade',
    role: 'Back-end Developer',
    image: 'https://i.pravatar.cc/300?img=10',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Ana Júlia',
    role: 'Product Owner',
    image: 'https://i.pravatar.cc/300?img=47',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Carlos Henrique',
    role: 'DevOps Engineer',
    image: 'https://i.pravatar.cc/300?img=4',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Fernanda Lima',
    role: 'Scrum Master',
    image: 'https://i.pravatar.cc/300?img=25',
    github: '#',
    linkedin: '#',
  },
];

interface TeamMemberCardProps {
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
}

function TeamMemberCard({ name, role, image, github, linkedin }: TeamMemberCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '28px',
        px: 3,
        py: 4,
        boxShadow: '0 4px 16px rgba(15,23,42,0.05)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          boxShadow: '0 16px 40px rgba(15,23,42,0.10)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Avatar */}
      <Box sx={{
        position: 'relative',
        width: 96,
        height: 96,
        borderRadius: '50%',
        overflow: 'hidden',
        mb: 2.5,
        border: '3px solid #E8FFF6',
        boxShadow: '0 0 0 2px #059669',
        flexShrink: 0,
      }}>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Name & role */}
      <Typography sx={{
        fontWeight: 800,
        color: '#13284D',
        fontSize: '1.05rem',
        lineHeight: 1.2,
        mb: 0.5,
      }}>
        {name}
      </Typography>

      <Typography sx={{
        color: '#059669',
        fontSize: '0.85rem',
        fontWeight: 600,
        mb: 2.5,
      }}>
        {role}
      </Typography>

      {/* Social links */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {github && (
          <IconButton
            component="a"
            href={github}
            target="_blank"
            size="small"
            sx={{
              backgroundColor: '#F3F4F6',
              color: '#13284D',
              width: 34,
              height: 34,
              transition: '0.2s ease',
              '&:hover': {
                backgroundColor: '#13284D',
                color: '#fff',
              },
            }}
          >
            <GitHubIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        {linkedin && (
          <IconButton
            component="a"
            href={linkedin}
            target="_blank"
            size="small"
            sx={{
              backgroundColor: '#F3F4F6',
              color: '#13284D',
              width: 34,
              height: 34,
              transition: '0.2s ease',
              '&:hover': {
                backgroundColor: '#0A66C2',
                color: '#fff',
              },
            }}
          >
            <LinkedInIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export function TeamSection() {
  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 8, md: 12 },
        backgroundColor: '#F8FAFC',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2.5, py: 0.8,
            borderRadius: '999px',
            backgroundColor: '#E8FFF6',
            color: '#1C8C6C',
            fontWeight: 700,
            fontSize: '0.85rem',
            mb: 2,
          }}>
            Quem está por trás
          </Typography>

          <Typography sx={{
            fontWeight: 800,
            color: '#13284D',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            mb: 2,
            fontSize: { xs: '1.8rem', md: '3rem' },
          }}>
            Equipe responsável
          </Typography>

          <Typography sx={{
            color: '#5B6470',
            maxWidth: '480px',
            mx: 'auto',
            lineHeight: 1.7,
            fontSize: { xs: '0.97rem', md: '1.05rem' },
          }}>
            Estudantes de Engenharia de Computação da UEFS que transformaram uma ideia acadêmica em produto real.
          </Typography>
        </Box>

        {/* Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 2.5, md: 3.5 },
        }}>
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
              github={member.github}
              linkedin={member.linkedin}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}