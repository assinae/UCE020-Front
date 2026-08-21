'use client';

import { useEffect, useState } from 'react';
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

  const [url, setUrl] = useState<string>();

  // O blob fica no cache do React Query; o object URL é criado a partir dele e
  // revogado ao trocar de certificado ou desmontar — sem isso o blob fica retido
  // em memória enquanto a aba estiver aberta.
  //
  // A criação precisa acontecer DENTRO do efeito, não num useMemo: o StrictMode
  // roda efeito -> cleanup -> efeito, e o cleanup revoga a URL. Com useMemo o
  // segundo ciclo não recriaria nada (o blob não mudou) e sobraria uma URL
  // revogada no src do iframe — a miniatura quebrava ao revisitar um
  // certificado já em cache.
  useEffect(() => {
    if (!blob) return;

    const objectUrl = URL.createObjectURL(blob);
    // A regra set-state-in-effect existe para evitar render em cascata, mas aqui
    // é um render extra por blob, não um ciclo. Criar o object URL é sincronizar
    // com um sistema externo (a API de Blob do navegador) e tem cleanup
    // obrigatório — por isso não dá para derivar em tempo de render.
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
