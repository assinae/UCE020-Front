'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate.service';
import { extractApiErrorMessage } from '@/utils/apiError';

interface CertificatePdfPreview {
  /** Object URL para usar no iframe, ou undefined enquanto carrega/falha. */
  url?: string;
  isLoading: boolean;
  error?: string;
}

/**
 * Carrega o PDF do certificado para pré-visualização.
 *
 * A rota é autenticada, então o iframe não pode apontar direto para ela: o
 * conteúdo vem pelo axios e é exposto como object URL.
 *
 * Usa React Query pelo dedupe. Em desenvolvimento o StrictMode monta o
 * componente duas vezes e, sem cache, isso baixaria os ~120 kB do PDF duas
 * vezes; com a queryKey a segunda montagem reaproveita a mesma requisição.
 * Voltar para o mesmo certificado também não rebaixa nada dentro do staleTime.
 *
 * `retry: false` porque as falhas possíveis aqui são 401, 403 e 404 — repetir
 * não muda o resultado.
 */
export function useCertificatePdfPreview(id?: string): CertificatePdfPreview {
  const {
    data: blob,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['certificate-pdf', id],
    queryFn: () => certificateService.getCertificatePdf(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  // O blob fica no cache do React Query; o object URL é derivado dele e
  // revogado ao trocar de certificado ou desmontar. Sem revogar, o blob fica
  // retido em memória enquanto a aba estiver aberta.
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return {
    url,
    isLoading,
    error: error
      ? extractApiErrorMessage(error, 'Não foi possível carregar o certificado.')
      : undefined,
  };
}
