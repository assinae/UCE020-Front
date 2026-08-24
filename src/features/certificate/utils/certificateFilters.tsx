import type {
  CertificateManagementItem,
  CertificateManagementRole,
} from '@/types/certificate-management';

export type CertificateRoleTab =
  | 'Todos'
  | 'Ouvintes'
  | 'Monitores'
  | 'Organizadores'
  | 'Palestrantes';
export type SortOrder = 'asc' | 'desc';

export const ROLE_TAB_OPTIONS: CertificateRoleTab[] = [
  'Todos',
  'Ouvintes',
  'Monitores',
  'Organizadores',
  'Palestrantes',
];

const TAB_TO_ROLE: Partial<Record<CertificateRoleTab, CertificateManagementRole>> = {
  Ouvintes: 'Ouvinte',
  Monitores: 'Monitor',
  Organizadores: 'Organizador',
  Palestrantes: 'Palestrante',
};

export const ACTIVITY_FILTER_OPTIONS = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Palestra', label: 'Palestra' },
  { value: 'Minicurso', label: 'Minicurso' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Pendente', label: 'Pendente de assinatura' },
  { value: 'Assinado', label: 'Assinado' },
];

interface FilterParams {
  certificates: CertificateManagementItem[];
  roleTab: CertificateRoleTab;
  search: string;
  activityFilter: string;
  statusFilter: string;
}

export function filterCertificates({
  certificates,
  roleTab,
  search,
  activityFilter,
  statusFilter,
}: FilterParams): CertificateManagementItem[] {
  const targetRole = TAB_TO_ROLE[roleTab];
  const normalizedSearch = search.trim().toLowerCase();

  return certificates.filter((certificate) => {
    const matchesRole = !targetRole || certificate.role === targetRole;

    const matchesSearch =
      !normalizedSearch ||
      certificate.participantName.toLowerCase().includes(normalizedSearch) ||
      certificate.participantEmail.toLowerCase().includes(normalizedSearch);

    const matchesActivity =
      activityFilter === 'Todas' ||
      certificate.title.toLowerCase().includes(activityFilter.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || certificate.status === statusFilter;

    return matchesRole && matchesSearch && matchesActivity && matchesStatus;
  });
}

export function sortCertificatesByParticipantName(
  certificates: CertificateManagementItem[],
  order: SortOrder
): CertificateManagementItem[] {
  return [...certificates].sort((a, b) =>
    order === 'asc'
      ? a.participantName.localeCompare(b.participantName, 'pt-BR')
      : b.participantName.localeCompare(a.participantName, 'pt-BR')
  );
}

export function countCertificatesByStatus(certificates: CertificateManagementItem[]) {
  return {
    pendente: certificates.filter((c) => c.status === 'Pendente').length,
    assinado: certificates.filter((c) => c.status === 'Assinado').length,
  };
}
