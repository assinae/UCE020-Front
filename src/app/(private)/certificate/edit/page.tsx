'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { Button } from '@/components/ui/Button';
import { CertificateForm } from '@/components/certificate/CertificateForm';
import type { EditCertificateFormData } from '@/types/certificate';

// Dados mock do certificado
const MOCK_CERTIFICATE = {
  id: 'cert-001',
  title: 'Certificado de Participação',
  participantName: 'João Silva',
  hours: 20,
  imageUrl: '/certificate-preview.png',
  issueDate: '2024-05-16',
};

export default function EditCertificatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<EditCertificateFormData>({
    title: MOCK_CERTIFICATE.title,
    participantName: MOCK_CERTIFICATE.participantName,
    hours: MOCK_CERTIFICATE.hours,
  });

  const handleInputChange = (field: keyof EditCertificateFormData, value: string | number) => {
    setFormData((prev) => {
      if (field === 'hours') {
        const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
        const validValue = Math.max(0, numValue); // Garante que não seja negativo
        return { ...prev, [field]: validValue };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar chamada à API
      console.log('Salvando certificado:', formData);
      // await api.updateCertificate(MOCK_CERTIFICATE.id, formData);

      // Simular delay da requisição
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/certificados');
    } catch (error) {
      console.error('Erro ao salvar certificado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>

      {/* Conteúdo Principal */}
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Header da página com botão voltar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            onClick={handleCancel}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'background.default' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Editar Certificado
          </Typography>
        </Box>

        {/* Preview do Certificado */}
        <Box sx={{ mb: 4 }}>
          <CertificateForm
            formData={formData}
            onFieldChange={handleInputChange}
            certificateImageUrl={MOCK_CERTIFICATE.imageUrl}
          />
        </Box>

        {/* Rodapé com Botões */}
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
            onClick={handleCancel}
            disabled={isLoading}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            isLoading={isLoading}
            fullWidth
          >
            Salvar Alterações
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
