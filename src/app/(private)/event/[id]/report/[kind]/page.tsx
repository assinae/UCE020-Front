'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { BackButton, Button } from '@/components/ui';
import { reportService } from '@/services/reportService';
import { extractApiErrorMessage } from '@/utils/apiError';

type ReportKind = 'attendance' | 'monitors';

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Não foi possível preparar o PDF.'));
    reader.readAsDataURL(blob);
  });
}

export default function EventReportPage({ params }: { params: Promise<{ id: string; kind: string }> }) {
  const { id, kind: rawKind } = use(params);
  const kind = rawKind === 'monitors' ? 'monitors' : 'attendance' as ReportKind;
  const activityId = useSearchParams().get('activityId');
  const [isDownloading, setIsDownloading] = useState(false);
  const title = kind === 'monitors' ? 'Relatório de Monitores' : activityId ? 'Relatório da Atividade' : 'Relatório de Presenças';

  const report = useQuery({
    queryKey: ['event-report', id, kind, activityId],
    queryFn: async () => {
      const blob = kind === 'monitors'
        ? await reportService.getMonitorPdf(id)
        : activityId
          ? await reportService.getActivityAttendancePdf(id, activityId)
          : await reportService.getEventAttendancePdf(id);
      return { blob, url: await blobToDataUrl(blob) };
    },
    retry: false,
  });

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BackButton fallbackHref={`/event/${id}`} size="small" />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">Documento de auditoria do evento</Typography>
          </Box>
        </Box>

        <Box sx={{ height: { xs: '68dvh', md: '72dvh' }, bgcolor: '#f5f5f5', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
          {report.isLoading ? <CircularProgress size={28} /> : report.data?.url ? (
            <Box component="iframe" src={report.data.url} title={title} sx={{ width: '100%', height: '100%', border: 0, bgcolor: '#fff' }} />
          ) : (
            <Box sx={{ textAlign: 'center', color: '#64748b', px: 3 }}>
              <PictureAsPdf sx={{ fontSize: 42, mb: 1 }} />
              <Typography>{report.error ? extractApiErrorMessage(report.error, 'Não foi possível carregar o relatório') : 'PDF indisponível'}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button leftIcon={<Download />} variant="outlined" color="secondary" disabled={!report.data || isDownloading} onClick={() => {
            if (!report.data) return;
            setIsDownloading(true);
            download(report.data.blob, title);
            setIsDownloading(false);
          }}>
            Baixar PDF
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
