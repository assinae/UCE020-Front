import { AppPageContainer } from '@/components/layout/AppPageContainer';

export default function EventPage() {
  return (
    <AppPageContainer
      sx={{
        borderRadius: '28px',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <p>Evento não encontrado</p>
    </AppPageContainer>
  );
}
