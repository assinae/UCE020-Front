import { CertificatesGeneratedView } from '@/features/certificate';

export default async function CertificadosGeradosPage({
  params,
}: {
  params: Promise<{ eventoID: string }>;
}) {
  const { eventoID } = await params;

  return (
    <CertificatesGeneratedView eventoId={Number(eventoID)} />
  );
}
