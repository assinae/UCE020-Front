import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

interface CertificateCardProps {
  id: string;
  title: string;
  issuedDate: string;
  location?: string;
  hours?: number;
  imageUrl?: string;
}

export function CertificateCard({ id, title, issuedDate, location, hours }: CertificateCardProps) {
  return (
    <Box
      component={Link}
      href={`/certificate/${id}`}
      sx={{
        width: '100%',
        minHeight: { xs: 148, lg: 132 },
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: '#FFF',
        border: '1px solid rgba(15, 29, 53, 0.08)',
        boxShadow: '0 1px 2px rgba(15, 29, 53, 0.08)',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 30px rgba(15, 29, 53, 0.14)',
          borderColor: 'rgba(46, 196, 160, 0.35)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 10,
          border: '1px solid rgba(46, 196, 160, 0.22)',
          borderRadius: 1.5,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 88, sm: 96, lg: 82 },
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#F0FAF7',
          borderRight: '1px solid rgba(46, 196, 160, 0.16)',
        }}
      >
        <Box
          sx={{
            width: { xs: 58, lg: 50 },
            height: { xs: 58, lg: 50 },
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#FFF',
            color: '#2EC4A0',
            boxShadow: 'inset 0 0 0 2px rgba(46, 196, 160, 0.18)',
          }}
        >
          <WorkspacePremiumOutlinedIcon sx={{ fontSize: { xs: 34, lg: 30 } }} />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          py: { xs: 2.5, lg: 2 },
          pl: { xs: 2, sm: 2.25, lg: 2 },
          pr: { xs: 2, sm: 2.25, lg: 2 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 1.25, lg: 1 },
        }}
      >
        <Typography
          sx={{
            color: '#2EC4A0',
            fontSize: { xs: 11, lg: 10 },
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Certificado emitido
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 15, sm: 16, lg: 14.5 },
            lineHeight: 1.25,
            color: '#0F1D35',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, lg: 1 } }}>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.65, color: '#667085', fontSize: 12.5 }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 15, color: '#9AA4B2' }} />
            {new Date(issuedDate).toLocaleDateString('pt-BR')}
          </Box>
          {location ? (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.65, minWidth: 0, maxWidth: '100%', color: '#667085', fontSize: 12.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 15, color: '#9AA4B2', flexShrink: 0 }} />
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {location}
              </Box>
            </Box>
          ) : null}
          {typeof hours === 'number' ? (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.65, color: '#667085', fontSize: 12.5 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: '#9AA4B2' }} />
              {hours}h
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
