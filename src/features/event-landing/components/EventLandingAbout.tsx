import { Typography } from '@mui/material';
import { colorTokens } from '@/lib/colors';
import { EventLandingSection } from './EventLandingSection';

interface EventLandingAboutProps {
  id: string;
  eventName: string;
  description: string | null;
}

export function EventLandingAbout({ id, eventName, description }: EventLandingAboutProps) {
  return (
    <EventLandingSection
      id={id}
      badge="Sobre o evento"
      title={`Conheça o ${eventName}`}
      tone="tint"
      maxWidth="md"
    >
      <Typography
        sx={{
          maxWidth: 760,
          mx: 'auto',
          textAlign: 'center',
          color: description ? colorTokens.text.primary : colorTokens.text.muted,
          lineHeight: 1.8,
          fontSize: { xs: '1.05rem', md: '1.15rem' },
          whiteSpace: 'pre-line',
        }}
      >
        {description || 'A organização ainda não publicou uma descrição para este evento.'}
      </Typography>
    </EventLandingSection>
  );
}
