'use client';

import { useEffect, useMemo, useState } from 'react';
import { certificateService } from '@/services/certificate.service';
import type { CertificateManagementItem, CertificateManagementRole } from '@/types/certificate-management';
import type { CertificateGroupStat } from '@/types/certificate-management';
import {
  STATUS_FILTER_OPTIONS,
  filterCertificates,
  sortCertificatesByParticipantName,
  type CertificateRoleTab,
  type SortOrder,
} from '../utils/certificateFilters';

const ROLE_LABEL: Record<CertificateManagementRole, string> = {
  Ouvinte:     'Ouvintes',
  Monitor:     'Monitores',
  Organizador: 'Organizadores',
  Palestrante: 'Palestrantes',
  Ministrante: 'Ministrantes',
  Moderador:   'Moderadores',
};

const CERTIFICATE_ROLES: CertificateManagementRole[] = [
  'Ouvinte',
  'Monitor',
  'Organizador',
  'Palestrante',
  'Ministrante',
  'Moderador',
];

export function useCertificatesGenerated(eventoId: number) {
  const [certificates, setCertificates] = useState<CertificateManagementItem[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isError, setIsError]           = useState(false);
  const [page, setPage]   = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [groupStats, setGroupStats] = useState<CertificateGroupStat[]>([]);

  const [roleTab, setRoleTab]                     = useState<CertificateRoleTab>('Todos');
  const [search, setSearch]                       = useState('');
  const [sourceDraft, setSourceDraft]             = useState('event');
  const [statusDraft, setStatusDraft]             = useState('Todos');
  const [sourceApplied, setSourceApplied]         = useState('event');
  const [statusApplied, setStatusApplied]         = useState('Todos');
  const [sortOrder, setSortOrder]                 = useState<SortOrder>('asc');
  const [reloadToken, setReloadToken]             = useState(0);

  useEffect(() => {
    if (!eventoId) return;

    let cancelled = false;

    // na primeira página limpa a lista, nas demais acumula
    const load = async () => {
      if (page === 1) {
        setIsLoading(true);
        setIsError(false);
      }

      try {
        const { items, hasMore } = await certificateService.getCertificatesByEvent(eventoId, page);
        if (cancelled) return;
        setCertificates(prev => page === 1 ? items : [...prev, ...items]);
        setHasMore(hasMore);
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [eventoId, page, reloadToken]);

  const loadMore = () => setPage(prev => prev + 1);

  // Recarrega a lista (volta pra página 1) e as estatísticas — usado após assinar em lote.
  const refresh = () => {
    setPage(1);
    setReloadToken(token => token + 1);
  };

  const markAsSigned = (certificateIds: number[], signer?: string) => {
    const signedAt = new Date().toISOString();
    const ids = new Set(certificateIds.map(String));
    setCertificates(current =>
      current.map(certificate =>
        ids.has(String(certificate.id))
          ? {
              ...certificate,
              status: 'Assinado',
              assinadoEm: certificate.assinadoEm ?? signedAt,
              assinadoPor: certificate.assinadoPor ?? signer ?? null,
            }
          : certificate,
      ),
    );
  };

  useEffect(() => {
    if (!eventoId) return;

    certificateService
      .getCertificateStatsByEvent(eventoId)
      .then((groups) => {
        setGroupStats(groups);
      })
      .catch(() => {
        // mantém os totais zerados se a busca de estatísticas falhar
      });
  }, [eventoId, reloadToken]);

  const selectedGroup = groupStats.find((group) => group.key === sourceApplied);
  const selectedRoleCounts = new Map(
    (selectedGroup?.roles ?? []).map((stat) => [stat.role, stat.count]),
  );
  const scopedRoleStats = CERTIFICATE_ROLES.map((role) => ({
    role,
    label: ROLE_LABEL[role],
    value: selectedRoleCounts.get(role) ?? 0,
  }));

  const filteredCertificates = useMemo(() => {
    const filtered = filterCertificates({
      certificates,
      roleTab,
      search,
      sourceFilter: sourceApplied,
      statusFilter:   statusApplied,
    });
    return sortCertificatesByParticipantName(filtered, sortOrder);
  }, [certificates, roleTab, search, sourceApplied, statusApplied, sortOrder]);

  const statusTotals = {
    pendente: selectedGroup?.pending ?? 0,
    assinado: selectedGroup?.signed ?? 0,
  };

  const totalIssued = selectedGroup?.total ?? 0;
  const groupLabel = selectedGroup?.label ?? 'Certificados do evento';
  const totalCertificatesForEvent = groupStats.reduce((sum, group) => sum + group.total, 0);
  const sourceOptions = [
    { value: 'event', label: 'Evento' },
    ...groupStats
      .filter((group) => group.source === 'activity' && group.activityId !== null)
      .map((group) => ({ value: group.key, label: group.label })),
  ];

  const applyFilters = () => {
    setSourceApplied(sourceDraft);
    setStatusApplied(statusDraft);
    setRoleTab('Todos');
  };

  const toggleSortOrder = () =>
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  return {
    filteredCertificates,
    roleStats: scopedRoleStats,
    groupStats,
    statusTotals,
    totalIssued,
    groupLabel,
    totalCertificatesForEvent,
    isLoading,
    isError,
    roleTab,
    setRoleTab,
    search,
    setSearch,
    sourceDraft,
    setSourceDraft,
    statusDraft,
    setStatusDraft,
    applyFilters,
    sourceOptions,
    statusOptions:   STATUS_FILTER_OPTIONS,
    sortOrder,
    toggleSortOrder,
    hasMore,
    loadMore,
    refresh,
    markAsSigned,
  };
}
