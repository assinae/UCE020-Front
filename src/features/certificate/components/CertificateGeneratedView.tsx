'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Typography } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Searchbar } from '@/components/ui/Searchbar';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/modals';
import { ContentCard } from '@/components/layout/ContentCard';
import { CertificateManagementCard } from '@/components/certificate/CertificateManagementCard';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { ToastSeverity } from '@/types/toast';
import { certificateService } from '@/services/certificate.service';
import { extractApiErrorMessage } from '@/utils/apiError';
import { useCertificatesGenerated } from '../hooks/useCertificatesGenerated';
import { CertificateStatsRow } from './CertificateStatsRow';
import { CertificateSummaryCard } from './CertificateSummaryCard';
import { CertificateBatchActions } from './CertificateBatchActions';
import { CertificateFilterTabs } from './CertificateFilterTabs';
import { CertificateFilters } from './CertificateFilters';
import { CertificateListHeader } from './CertificateListHeader';
import { ArrowBack } from '@mui/icons-material';

interface CertificatesGeneratedViewProps {
  eventoId: number;
}

export function CertificatesGeneratedView({eventoId}: CertificatesGeneratedViewProps) {
  const router = useRouter();
  const {
    filteredCertificates,
    roleStats,
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
    activityOptions,
    statusOptions,
    sortOrder,
    toggleSortOrder,
    isLoading,
    isError,
    loadMore,
    hasMore,
    refresh,
  } = useCertificatesGenerated(eventoId);

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });

  const handleView = (certificate: CertificateManagementItem) =>
    router.push(`/certificate/${certificate.id}`);
  const handleDownload = (certificate: CertificateManagementItem) => {
    if (!certificate.imageUrl) return;
    window.open(certificate.imageUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSignBatch = () => setIsSignModalOpen(true);

  const confirmSignBatch = async () => {
    setIsSigning(true);
    try {
      const result = await certificateService.signCertificatesBatch(eventoId);
      setToast({
        open: true,
        message:
          result.assinados > 0
            ? `${result.assinados} certificado(s) assinado(s) por ${result.assinante}.`
            : 'Nenhum certificado pendente para assinar.',
        severity: result.assinados > 0 ? ToastSeverity.Success : ToastSeverity.Info,
      });
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

  const handleSendBatch = () => console.log('TODO: encaminhar certificados');
  const handleLoadMore = () => loadMore();
  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography sx={{ color: '#64748B', fontSize: 14 }}>
          Carregando certificados...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography sx={{ color: '#EF4444', fontSize: 14 }}>
          Não foi possível carregar os certificados. Tente novamente.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        {/* LADO ESQUERDO: Botão de voltar, Linha e Textos */}
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: { xs: 1.5, sm: 2 } }}>
          <IconButton
            onClick={() => router.back()}
            size="small"
            sx={{ 
              color: "text.secondary", 
              "&:hover": { bgcolor: "background.default" }, 
            }}
          >
            <ArrowBack />
          </IconButton>
          {/* Bloco de Textos */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            
            {/* LINHA SUPERIOR: Apenas Linha Verde e Título */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 4, height: 26, borderRadius: 4, bgcolor: "#2EC4A0" }} />
              <Typography
                sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', sm: '1.5rem' }, color: '#0F1D35', lineHeight: 1.2 }}
              >
                Certificados{' '}
                <Box component="span" sx={{ color: '#2EC4A0' }}>Gerados</Box>
              </Typography>
            </Box>
          

          </Box>
        </Box>
      
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <CertificateStatsRow stats={roleStats} />
        <CertificateSummaryCard totalIssued={totalIssued} statusTotals={statusTotals} />
      </Box>

      <CertificateBatchActions
        onSignBatch={handleSignBatch}
        onSendBatch={handleSendBatch}
        isSigning={isSigning}
        signDisabled={isSigning}
      />

      {/* Painel de filtros e busca */}
      <ContentCard sx={{ gap: 1.5 }}>
        <CertificateFilterTabs activeTab={roleTab} onChange={setRoleTab} />
        <Searchbar
          value={search}
          onChange={setSearch}
          placeholder="Buscar participante"
          sx={{ mt: 0 }}
        />
        <CertificateFilters
          activityDraft={activityDraft}
          statusDraft={statusDraft}
          activityOptions={activityOptions}
          statusOptions={statusOptions}
          onActivityChange={setActivityDraft}
          onStatusChange={setStatusDraft}
          onApply={applyFilters}
        />
      </ContentCard>

      <CertificateListHeader
        count={filteredCertificates.length}
        sortOrder={sortOrder}
        onToggleSort={toggleSortOrder}
      />

      {filteredCertificates.length === 0 ? (
        <ContentCard sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
            <Box
              sx={{
                width: 72, height: 72, borderRadius: '20px', bgcolor: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArticleOutlinedIcon sx={{ fontSize: 34, color: '#94A3B8' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0F1D35' }}>
              Nenhum certificado gerado ainda
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B', textAlign: 'center', maxWidth: 280 }}>
              Os certificados aparecerão aqui após serem gerados para os participantes do evento.
            </Typography>
          </Box>
        </ContentCard>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {filteredCertificates.map((certificate) => (
            <CertificateManagementCard
              key={certificate.id}
              certificate={certificate}
              onView={handleView}
              onDownload={handleDownload}
            />
          ))}
        </Box>
      )}

      {hasMore && (
        <Button
          variant="outlined"
          fullWidth
          leftIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
          onClick={loadMore}
          sx={{
            borderColor: '#E2E8F0', color: '#2EC4A0',
            '&:hover': { borderColor: '#2EC4A0', bgcolor: 'transparent' },
          }}
        >
          Carregar mais
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
    </>
  );
}
