import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { CertificatesGeneratedView } from '@/features/certificate';

export default async function CertificadosGeradosPage({
  params,
}: {
  params: Promise<{ eventoID: string }>;
}) {
  const { eventoID } = await params;

  return (
    <AppPageContainer>
      <CertificatesGeneratedView eventoId={Number(eventoID)} />
    </AppPageContainer>
  );
}
