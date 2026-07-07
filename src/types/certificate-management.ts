export type CertificateManagementRole = 'Ouvinte' | 'Monitor' | 'Organizador' | 'Palestrante';
export type CertificateManagementStatus = 'Pendente' | 'Assinado' | 'Encaminhado';

export interface CertificateManagementItem {
  id: string;
  title: string;
  participantName: string;
  participantEmail: string;
  role: CertificateManagementRole;
  status: CertificateManagementStatus;
  hours?: number;
  issueDate: string;
  imageUrl?: string;
}