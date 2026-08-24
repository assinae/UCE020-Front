import type { Metadata } from 'next';
import { CertificateVerifyView } from '@/features/certificate/components/CertificateVerifyView';

export const metadata: Metadata = {
  title: 'Verificar certificado · Assinaê',
  description: 'Confira a autenticidade de um certificado emitido pela plataforma Assinaê.',
};

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  return <CertificateVerifyView codigo={codigo} />;
}
