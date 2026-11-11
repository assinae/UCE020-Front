'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Typography, alpha } from '@mui/material';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { ListPageHeader } from '@/components/data-list';
import { ContentCard } from '@/components/layout/ContentCard';
import { Button } from '@/components/ui/Button';
import { SkeletonBone } from '@/components/ui/SkeletonBone';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/modals';
import { CertificateManagementCard } from '@/components/certificate/CertificateManagementCard';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { ToastSeverity } from '@/types/toast';
import { certificateService } from '@/services/certificate.service';
import { eventService } from '@/services/eventService';
import { extractApiErrorMessage } from '@/utils/apiError';
import { colorTokens } from '@/lib/colors';
import { useCertificatesGenerated } from '../hooks/useCertificatesGenerated';
import { baixarCertificadoPdf } from '../utils/certificatePdf';
import { CertificateStatsRow } from './CertificateStatsRow';
import { CertificateSummaryCard } from './CertificateSummaryCard';
import { CertificateFilters } from './CertificateFilters';
import { CertificateListHeader } from './CertificateListHeader';

interface CertificatesGeneratedViewProps {
  eventoId: number;
}

function CertificateListSkeleton() {
  return (
    <Box role="status" aria-label="Carregando certificados" sx={{ display: 'grid', gap: 1.5 }}>
      {Array.from({ length: 4 }, (_, index) => (
        <ContentCard key={index} sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.75, p: 2 }}>
          <SkeletonBone sx={{ width: 48, height: 48, borderRadius: '16px', flexShrink: 0 }} />
          <Box sx={{ flex: 1, display: 'grid', gap: 1 }}>
            <SkeletonBone sx={{ width: '42%', height: 15 }} />
            <SkeletonBone sx={{ width: '68%', height: 12 }} />
            <SkeletonBone sx={{ width: '34%', height: 11 }} />
          </Box>
          <SkeletonBone sx={{ width: 72, height: 34, display: { xs: 'none', sm: 'block' } }} />
        </ContentCard>
      ))}
    </Box>
  );
}

export function CertificatesGeneratedView({ eventoId }: CertificatesGeneratedViewProps) {
  const router = useRouter();
  const {
    filteredCertificates,
    roleStats,
    statusTotals,
    totalIssued,
    totalCertificatesForEvent,
    groupLabel,
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
    statusOptions,
    sortOrder,
    toggleSortOrder,
    isLoading,
    isError,
    loadMore,
    hasMore,
    refresh,
    markAsSigned,
  } = useCertificatesGenerated(eventoId);

  const { data: event } = useQuery({
    queryKey: ['event', eventoId],
    queryFn: () => eventService.findOne(eventoId),
    enabled: Number.isFinite(eventoId) && eventoId > 0,
  });

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });

  const handleView = (certificate: CertificateManagementItem) =>
    router.push(`/certificate/${certificate.id}`);

  const handleDownload = async (certificate: CertificateManagementItem) => {
    try {
      await baixarCertificadoPdf(certificate);
    } catch (error) {
      setToast({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível baixar o certificado.'),
        severity: ToastSeverity.Error,
      });
    }
  };

  const confirmSignBatch = async () => {
    setIsSigning(true);
    try {
      const result = await certificateService.signCertificatesBatch(eventoId);
      markAsSigned(
        result.certificados.map((certificate) => certificate.certificadoId),
        result.assinante,
      );
      setToast({
        open: true,
        message:
          result.assinados > 0
            ? `${result.assinados} certificado(s) assinado(s) por ${result.assinante}.`
            : 'Nenhum certificado pendente para assinar.',
        severity: result.assinados > 0 ? ToastSeverity.Success : ToastSeverity.Info,
      });
      setIsSignModalOpen(false);
      refresh();
    } catch (error) {
      setToast({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível assinar os certificados.'),
        severity: ToastSeverity.Error,
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Box sx={{
        maxWidth: 1180, mx: 'auto', px: { xs: 2, md: 3 },
        pt: { xs: 2.5, md: 4 }, pb: { xs: 4, md: 8 },
        display: 'flex', flexDirection: 'column', gap: { xs: 2.25, md: 3 },
      }}>
      <ListPageHeader
        title="Certificados gerados"
        subtitle={event?.nome ?? `Evento ${eventoId}`}
        stats={[]}
        backHref={`/event/${eventoId}`}
      />

      <CertificateSummaryCard
        groupLabel={groupLabel}
        totalIssued={totalIssued}
        statusTotals={statusTotals}
        action={{
          label: isSigning ? 'Assinando...' : 'Assinar todos os certificados',
          icon: <DrawOutlinedIcon />,
          onClick: () => setIsSignModalOpen(true),
          disabled: isSigning || isLoading || totalCertificatesForEvent === 0,
        }}
      />

      <ContentCard sx={{ gap: 1.75, p: { xs: 1.5, sm: 2.25 }, borderRadius: '24px', boxShadow: `0 8px 24px ${alpha(colorTokens.shadow.ink, 0.045)}` }}>
        <CertificateFilters
          search={search}
          onSearchChange={setSearch}
          sourceDraft={sourceDraft}
          statusDraft={statusDraft}
          sourceOptions={sourceOptions}
          statusOptions={statusOptions}
          onSourceChange={setSourceDraft}
          onStatusChange={setStatusDraft}
          onApply={applyFilters}
        />
      </ContentCard>

      <CertificateStatsRow
        stats={roleStats}
        total={totalIssued}
        activeTab={roleTab}
        onSelect={setRoleTab}
      />

      <CertificateListHeader
        groupLabel={groupLabel}
        count={filteredCertificates.length}
        sortOrder={sortOrder}
        onToggleSort={toggleSortOrder}
      />

      {isError ? (
        <Alert
          severity="error"
          action={
            <Button variant="outlined" leftIcon={<RefreshRoundedIcon />} onClick={refresh}>
              Tentar novamente
            </Button>
          }
          sx={{ borderRadius: '18px', alignItems: 'center' }}
        >
          Não foi possível carregar os certificados.
        </Alert>
      ) : isLoading ? (
        <CertificateListSkeleton />
      ) : filteredCertificates.length === 0 ? (
        <ContentCard sx={{ alignItems: 'center', textAlign: 'center', py: { xs: 5, sm: 7 }, gap: 1.25 }}>
          <Box
            sx={{
              width: 66,
              height: 66,
              borderRadius: '22px',
              bgcolor: colorTokens.surface.mintSubtle,
              color: colorTokens.brand.secondary,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: colorTokens.text.heading }}>
            Nenhum certificado encontrado
          </Typography>
          <Typography sx={{ maxWidth: 360, fontSize: 13.5, color: colorTokens.text.muted }}>
            Não há certificados neste grupo com os filtros atuais. Escolha outro evento ou atividade, ajuste os filtros ou tente outra busca.
          </Typography>
        </ContentCard>
      ) : (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {filteredCertificates.map((certificate, index) => (
            <Box
              key={certificate.id}
              className="animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
            >
              <CertificateManagementCard
                certificate={certificate}
                onView={handleView}
                onDownload={handleDownload}
              />
            </Box>
          ))}
        </Box>
      )}

      {hasMore && !isLoading && (
        <Button
          variant="outlined"
          fullWidth
          leftIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={loadMore}
          sx={{
            minHeight: 48,
            borderRadius: '999px',
            borderColor: colorTokens.neutral.border,
            color: colorTokens.brand.secondary,
            '&:hover': {
              borderColor: colorTokens.brand.secondary,
              bgcolor: colorTokens.surface.mintSubtle,
            },
          }}
        >
          Carregar mais certificados
        </Button>
      )}

      <ConfirmModal
        open={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        message="Deseja assinar em lote todos os certificados pendentes deste evento?"
        emphasisEndText="Os certificados já assinados não serão afetados."
        confirmText="Assinar"
        cancelText="Cancelar"
        onConfirm={confirmSignBatch}
        isLoading={isSigning}
        type="default"
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      </Box>
    </Box>
  );
}
