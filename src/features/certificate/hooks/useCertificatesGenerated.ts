'use client';

import { useMemo, useState } from 'react';
import { MOCK_CERTIFICATE_MANAGEMENT_ITEMS, CERTIFICATE_ROLE_STATS } from '@/mocks/certificate-management';
import {
  ACTIVITY_FILTER_OPTIONS,
  countCertificatesByStatus,
  filterCertificates,
  sortCertificatesByParticipantName,
  STATUS_FILTER_OPTIONS,
  type CertificateRoleTab,
  type SortOrder,
} from '../utils/certificateFilters';

export function useCertificatesGenerated() {
  const certificates = MOCK_CERTIFICATE_MANAGEMENT_ITEMS;

  const [roleTab, setRoleTab] = useState<CertificateRoleTab>('Todos');
  const [search, setSearch] = useState('');

  const [activityDraft, setActivityDraft] = useState('Todas');
  const [statusDraft, setStatusDraft] = useState('Todos');
  const [activityApplied, setActivityApplied] = useState('Todas');
  const [statusApplied, setStatusApplied] = useState('Todos');

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredCertificates = useMemo(() => {
    const filtered = filterCertificates({
      certificates,
      roleTab,
      search,
      activityFilter: activityApplied,
      statusFilter: statusApplied,
    });
    return sortCertificatesByParticipantName(filtered, sortOrder);
  }, [certificates, roleTab, search, activityApplied, statusApplied, sortOrder]);

  const statusTotals = useMemo(() => countCertificatesByStatus(certificates), [certificates]);
  const totalIssued = useMemo(
    () => CERTIFICATE_ROLE_STATS.reduce((acc, stat) => acc + stat.value, 0),
    [],
  );

  const applyFilters = () => {
    setActivityApplied(activityDraft);
    setStatusApplied(statusDraft);
  };

  const toggleSortOrder = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  return {
    filteredCertificates,
    roleStats: CERTIFICATE_ROLE_STATS,
    statusTotals,
    totalIssued,
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
    statusOptions: STATUS_FILTER_OPTIONS,
    sortOrder,
    toggleSortOrder,
  };
}