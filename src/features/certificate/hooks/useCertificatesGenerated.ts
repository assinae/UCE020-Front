'use client';

import { useEffect, useMemo, useState } from 'react';
import { certificateService } from '@/services/certificate.service';
import type { CertificateManagementItem, CertificateManagementRole } from '@/types/certificate-management';
import {
  ACTIVITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  countCertificatesByStatus,
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

export function useCertificatesGenerated(eventoId: number) {
  const [certificates, setCertificates] = useState<CertificateManagementItem[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isError, setIsError]           = useState(false);
  const [page, setPage]   = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [roleStats, setRoleStats] = useState<
    { role: CertificateManagementRole; label: string; value: number }[]
  >(() =>
    (['Ouvinte', 'Monitor', 'Organizador', 'Palestrante'] as CertificateManagementRole[]).map(
      role => ({ role, label: ROLE_LABEL[role], value: 0 }),
    ),
  );

  const [roleTab, setRoleTab]                     = useState<CertificateRoleTab>('Todos');
  const [search, setSearch]                       = useState('');
  const [activityDraft, setActivityDraft]         = useState('Todas');
  const [statusDraft, setStatusDraft]             = useState('Todos');
  const [activityApplied, setActivityApplied]     = useState('Todas');
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

  useEffect(() => {
    if (!eventoId) return;

    certificateService
      .getCertificateStatsByEvent(eventoId)
      .then(stats => {
        setRoleStats(
          stats.map(stat => ({
            role:  stat.role,
            label: ROLE_LABEL[stat.role],
            value: stat.count,
          })),
        );
      })
      .catch(() => {
        // mantém os totais zerados se a busca de estatísticas falhar
      });
  }, [eventoId, reloadToken]);

  const filteredCertificates = useMemo(() => {
    const filtered = filterCertificates({
      certificates,
      roleTab,
      search,
      activityFilter: activityApplied,
      statusFilter:   statusApplied,
    });
    return sortCertificatesByParticipantName(filtered, sortOrder);
  }, [certificates, roleTab, search, activityApplied, statusApplied, sortOrder]);

  const statusTotals = useMemo(
    () => countCertificatesByStatus(certificates),
    [certificates],
  );

  const totalIssued = certificates.length;

  const applyFilters = () => {
    setActivityApplied(activityDraft);
    setStatusApplied(statusDraft);
  };

  const toggleSortOrder = () =>
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  return {
    filteredCertificates,
    roleStats,
    statusTotals,
    totalIssued,
    isLoading,
    isError,
    roleTab,
    setRoleTab,
    search,
    setSearch,
    activityDraft,
    setActivityDraft,
    statusDraft,
    setStatusDraft,
    applyFilters,
    activityOptions: ACTIVITY_FILTER_OPTIONS,
    statusOptions:   STATUS_FILTER_OPTIONS,
    sortOrder,
    toggleSortOrder,
    hasMore,
    loadMore,
    refresh,
  };
}
