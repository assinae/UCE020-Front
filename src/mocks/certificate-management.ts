import type {
  CertificateManagementItem,
  CertificateManagementRole,
  CertificateManagementStatus,
} from '@/types/certificate-management';

export const MOCK_CERTIFICATE_MANAGEMENT_ITEMS: CertificateManagementItem[] = [
  {
    id: 'cm-001',
    title: 'Palestra: Inteligência Artificial no Dia a Dia',
    participantName: 'João Ferreira',
    participantEmail: 'joao.ferreira@email.com',
    role: 'Ouvinte',
    status: 'Pendente',
    hours: 2,
    issueDate: '2026-05-16',
  },
  {
    id: 'cm-002',
    title: 'Minicurso: React na Prática',
    participantName: 'Maria Clara',
    participantEmail: 'maria.clara@email.com',
    role: 'Monitor',
    status: 'Assinado',
    hours: 10,
    issueDate: '2026-05-16',
  },
  {
    id: 'cm-003',
    title: 'Organização Geral do Evento',
    participantName: 'Rafael Pereira',
    participantEmail: 'rafael.pereira@email.com',
    role: 'Organizador',
    status: 'Encaminhado',
    issueDate: '2026-05-16',
  },
  {
    id: 'cm-004',
    title: 'Palestra: UX Design Moderno',
    participantName: 'Ana Souza',
    participantEmail: 'ana.souza@email.com',
    role: 'Palestrante',
    status: 'Pendente',
    hours: 3,
    issueDate: '2026-05-16',
  },
  {
    id: 'cm-005',
    title: 'Palestra: Inteligência Artificial no Dia a Dia',
    participantName: 'Lucas Martins',
    participantEmail: 'lucas.martins@email.com',
    role: 'Ouvinte',
    status: 'Assinado',
    hours: 2,
    issueDate: '2026-05-16',
  },
];

/**
 * Contagens agregadas por papel (mock). No backend real viriam de um
 * endpoint de estatísticas do evento, não de uma contagem local da lista.
 */
export const CERTIFICATE_ROLE_STATS: { role: CertificateManagementRole; label: string; value: number }[] = [
  { role: 'Ouvinte', label: 'Ouvintes', value: 376 },
  { role: 'Monitor', label: 'Monitores', value: 98 },
  { role: 'Organizador', label: 'Organizadores', value: 52 },
  { role: 'Palestrante', label: 'Palestrantes', value: 16 },
];

export const CERTIFICATE_ROLE_COLORS: Record<CertificateManagementRole, { bg: string; color: string }> = {
  Ouvinte: { bg: '#E8F5F2', color: '#1a6e5a' },
  Monitor: { bg: '#EEF2FF', color: '#3730A3' },
  Organizador: { bg: '#F3E8FF', color: '#6D28D9' },
  Palestrante: { bg: '#FFF7ED', color: '#B45309' },
};

export const CERTIFICATE_STATUS_META: Record<
  CertificateManagementStatus,
  { label: string; bg: string; color: string }
> = {
  Pendente: { label: 'Pendente de assinatura', bg: '#FEF9C3', color: '#854D0E' },
  Assinado: { label: 'Assinado', bg: '#DCFCE7', color: '#166534' },
  Encaminhado: { label: 'Encaminhado', bg: '#DBEAFE', color: '#1E40AF' },
};