import { certificateService } from '@/services/certificate.service';
import type { CertificateManagementItem } from '@/types/certificate-management';

type DadosNome = Pick<CertificateManagementItem, 'title' | 'participantName'>;

/** Remove o que o sistema de arquivos não aceita em nome de arquivo. */
function limpar(texto: string): string {
  return texto.replace(/[/\?%*:|"<>]/g, '').trim();
}

/**
 * Nome com que o navegador salva o arquivo.
 *
 * O back manda o nome no header Content-Disposition, mas o CORS da API não
 * expõe esse header ao JavaScript, então ele é remontado aqui a partir dos
 * dados que a tela já tem.
 */
export function nomeArquivoCertificado(cert: DadosNome): string {
  return `Certificado - ${limpar(cert.participantName)} - ${limpar(cert.title)}.pdf`;
}

/**
 * Baixa o PDF e dispara o "salvar arquivo" do navegador.
 *
 * Como a rota é autenticada, não dá para apontar um href direto para ela: o
 * conteúdo vem por axios (que injeta o token) e vira um object URL temporário.
 */
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

  // Revogar na mesma tarefa cancelaria o download em alguns navegadores, que
  // ainda não leram a URL quando o click retorna.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
