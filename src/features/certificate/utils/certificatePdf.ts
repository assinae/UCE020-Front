import { certificateService } from '@/services/certificate.service';
import type { CertificateManagementItem } from '@/types/certificate-management';

type DadosNome = Pick<CertificateManagementItem, 'title' | 'participantName'>;

function limpar(texto: string): string {
  return texto.replace(/[/\\?%*:|"<>]/g, '').trim();
}

/** O back manda o nome no Content-Disposition, mas o CORS não expõe esse header ao JS. */
export function nomeArquivoCertificado(cert: DadosNome): string {
  return `Certificado - ${limpar(cert.participantName)} - ${limpar(cert.title)}.pdf`;
}

export async function baixarCertificadoPdf(
  cert: DadosNome & { id: string }
): Promise<void> {
  const blob = await certificateService.getCertificatePdf(cert.id);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivoCertificado(cert);
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revogar na mesma tarefa cancelaria o download: alguns navegadores ainda não
  // leram a URL quando o click retorna.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
