import type {
  CertificateManagementItem,
  CertificateManagementRole,
} from '@/types/certificate-management';

export type CertificateRoleTab =
  | 'Todos'
  | 'Ouvintes'
  | 'Monitores'
  | 'Organizadores'
  | 'Palestrantes'
  | 'Ministrantes'
  | 'Moderadores';
export type SortOrder = 'asc' | 'desc';

export const ROLE_TAB_OPTIONS: CertificateRoleTab[] = [
  'Todos',
  'Ouvintes',
  'Monitores',
  'Organizadores',
  'Palestrantes',
  'Ministrantes',
  'Moderadores',
];

const TAB_TO_ROLE: Partial<Record<CertificateRoleTab, CertificateManagementRole>> = {
  Ouvintes: 'Ouvinte',
  Monitores: 'Monitor',
  Organizadores: 'Organizador',
  Palestrantes: 'Palestrante',
  Ministrantes: 'Ministrante',
  Moderadores: 'Moderador',
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Pendente', label: 'Pendente de assinatura' },
  { value: 'Assinado', label: 'Assinado' },
];

interface FilterParams {
  certificates: CertificateManagementItem[];
  roleTab: CertificateRoleTab;
  search: string;
  sourceFilter: string;
  statusFilter: string;
}

export function filterCertificates({
  certificates,
  roleTab,
  search,
  sourceFilter,
  statusFilter,
}: FilterParams): CertificateManagementItem[] {
  const targetRole = TAB_TO_ROLE[roleTab];
  const normalizedSearch = search.trim().toLowerCase();

  return certificates.filter((certificate) => {
    const matchesRole = !targetRole || certificate.role === targetRole;

    const matchesSearch =
      !normalizedSearch ||
      certificate.participantName.toLowerCase().includes(normalizedSearch) ||
      certificate.participantEmail.toLowerCase().includes(normalizedSearch) ||
      certificate.title.toLowerCase().includes(normalizedSearch);

    const matchesSource =
      sourceFilter === 'event'
        ? certificate.source === 'event' || (!certificate.source && certificate.id.startsWith('user-'))
        : certificate.source === 'activity' && `activity:${certificate.activityId}` === sourceFilter;

    const matchesStatus = statusFilter === 'Todos' || certificate.status === statusFilter;

    return matchesRole && matchesSearch && matchesSource && matchesStatus;
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
