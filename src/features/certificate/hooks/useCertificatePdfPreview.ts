'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate.service';
import { extractApiErrorMessage } from '@/utils/apiError';

interface CertificatePdfPreview {
  url?: string;
  isLoading: boolean;
  error?: string;
}

/**
 * A rota é autenticada, então o iframe não pode apontar direto para ela: o
 * conteúdo vem pelo axios e vira object URL. React Query dedupa as duas
 * montagens do StrictMode, que sem cache baixariam os ~120 kB duas vezes.
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

  const [url, setUrl] = useState<string>();

  // Criar a URL DENTRO do efeito é obrigatório: o StrictMode roda efeito ->
  // cleanup -> efeito, e o cleanup revoga. Num useMemo o segundo ciclo não
  // recriaria nada e sobraria uma URL revogada no src do iframe.
  useEffect(() => {
    if (!blob) return;

    const objectUrl = URL.createObjectURL(blob);
    // Um render extra por blob, não um ciclo: criar object URL é sincronizar com
    // sistema externo e tem cleanup, então não dá para derivar em render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(undefined);
    };
  }, [blob]);

  return {
    url,
    isLoading,
    error: error
      ? extractApiErrorMessage(error, 'Não foi possível carregar o certificado.')
      : undefined,
  };
}
