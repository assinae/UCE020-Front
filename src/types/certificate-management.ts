export type CertificateManagementRole =
  | 'Ouvinte'
  | 'Monitor'
  | 'Organizador'
  | 'Palestrante'
  | 'Ministrante'
  | 'Moderador';
export type CertificateManagementStatus = 'Pendente' | 'Assinado';

export interface CertificateManagementItem {
  id: string;
  title: string;
  participantName: string;
  participantEmail: string;
  role: CertificateManagementRole;
  status: CertificateManagementStatus;
  hours?: number;
  location?: string;
  issueDate: string;
  imageUrl?: string;
}

export interface CertificatePageResponse {
  items: CertificateManagementItem[];
  hasMore: boolean;
}

export interface CertificateRoleStat {
  role:  CertificateManagementRole;
  count: number;
}

export type CertificateSignatureType = 'evento' | 'atividade' | 'convidado';

export interface SignedCertificateSummary {
  tipo: CertificateSignatureType;
  certificadoId: number;
  titular: string;
  codigoVerificacao: string;
}

export interface CertificateBatchSignResult {
  assinados: number;
  semArquivo: number;
  assinante: string;
  certificados: SignedCertificateSummary[];
}

// Resultado da verificação pública de autenticidade de um certificado
// (rota GET /certificate/verify/:codigo). Só retorna quando o certificado é válido.
export interface CertificateVerification {
  tipo: string;
  titular: string;
  referente: string;
  emitidoEm: string;
  assinadoEm: string | null;
  assinadoPor: string;
  hash: string;
}

export interface CertificateVerificationResult {
  message: string;
  data: CertificateVerification;
}
