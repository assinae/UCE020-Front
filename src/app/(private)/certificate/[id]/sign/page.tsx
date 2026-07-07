'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack, Draw } from '@mui/icons-material';

import { Button } from '@/components/ui/Button';
import { CertificateSignature } from '@/components/certificate/CertificateSignature';
import { MOCK_CERTIFICATES } from '@/mocks/certificates';

export default function SignCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const cert = MOCK_CERTIFICATES.find((c) => c.id === id);

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 70 });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  if (!cert) {
    router.push('/certificate/list');
    return null;
  }

  const handleSignatureChange = (
    dataUrl: string | null,
    position: { x: number; y: number }
  ) => {
    setSignatureData(dataUrl);
    setSignaturePosition(position);
  };

  const handleSign = async () => {
    if (!signatureData) {
      setSnackbar({
        open: true,
        message: 'Por favor, faça o upload da imagem da assinatura em PNG antes de assinar.',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Chamar API para salvar a assinatura dps
      console.log('Assinando certificados em Lote:', {
        certId: cert.id,
        signaturePosition,
        signatureData: signatureData.slice(0, 50) + '...',
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSnackbar({
        open: true,
        message: 'Certificados assinados com sucesso!',
        severity: 'success',
      });

      setTimeout(() => router.push('/certificate/list'), 1500);
    } catch (error) {
      console.error('Erro ao assinar certificados:', error);
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao assinar os certificados. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 }, pb: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            onClick={() => router.back()}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.2,
              }}
            >
              Assinar Certificados
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {cert.title}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontFamily: "'Poppins', sans-serif",
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Draw sx={{ fontSize: 18, color: '#2EC4A0' }} />
            Posicionamento da Assinatura
          </Typography>

          <CertificateSignature
            certificateImageUrl={cert.imageUrl}
            onSignatureChange={handleSignatureChange}
          />
        </Box>

        <Box
          sx={{
            bgcolor: 'rgba(46, 196, 160, 0.06)',
            border: '1px solid rgba(46, 196, 160, 0.2)',
            borderRadius: 2,
            p: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.8,
              display: 'block',
            }}
          >
            <strong>Como usar:</strong>
            <br />
            1. Faça o upload da imagem da sua assinatura (PNG com fundo transparente é ideal).
            <br />
            2. Arraste a assinatura para a posição desejada nos certificados.
            <br />
            3. Ajuste o tamanho usando os controles de zoom.
            <br />
            4. Clique em <strong>Assinar Certificados em Lote</strong> para confirmar.
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.default',
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.back()}
            disabled={isLoading}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSign}
            isLoading={isLoading}
            disabled={!signatureData}
            fullWidth
            leftIcon={<Draw sx={{ fontSize: 18 }} />}
          >
            Assinar Certificados em Lote
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
