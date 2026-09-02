// services/certificate.service.ts
import { AxiosError } from 'axios';
import { api } from './api';
import type {
  CertificateBatchSignResult,
  CertificateManagementItem,
  CertificatePageResponse,
  CertificateRoleStat,
  CertificateVerification,
  CertificateVerificationResult,
  GenerateActivityCertificatesResult,
} from '@/types/certificate-management';

// Erro de verificação com a mensagem retornada pelo backend (ex.: código inexistente
// ou certificado não assinado). Permite à tela mostrar o motivo exato ao usuário.
export class CertificateVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CertificateVerificationError';
  }
}

interface CertificateListResponse {
  message?: string;
  data: CertificateManagementItem[];
}

interface CertificateResponse {
  message?: string;
  data: CertificateManagementItem;
}

interface CertificateStatsResponse {
  message?: string;
  data: CertificateRoleStat[];
}

const DEFAULT_STATUS = 'Pendente' as const;

function normalizeCertificateStatus(status?: string | null): CertificateManagementItem['status'] {
  const normalized = status?.trim().toLowerCase();
  if (normalized === 'assinado' || normalized === 'signed' || normalized === 'assinada') {
    return 'Assinado';
  }
  return DEFAULT_STATUS;
}

function normalizeCertificateItem(item: Partial<CertificateManagementItem>): CertificateManagementItem {
  const raw = item as Partial<CertificateManagementItem> & Record<string, unknown>;
  const signature =
    raw.assinatura && typeof raw.assinatura === 'object'
      ? (raw.assinatura as Record<string, unknown>)
      : undefined;
  const isSigned =
    raw.assinado === true ||
    raw.signed === true ||
    raw.assinaturaDigital === true ||
    Boolean(
      raw.assinadoEm ||
        raw.signedAt ||
        raw.signature ||
        signature?.assinadoEm ||
        signature?.signedAt ||
        signature?.hash,
    );

  return {
    ...item,
    status:
      isSigned
        ? 'Assinado'
        : normalizeCertificateStatus(
            String(raw.status ?? raw.statusAssinatura ?? raw.situacao ?? ''),
          ),
    assinadoEm: String(
      raw.assinadoEm ?? raw.signedAt ?? signature?.assinadoEm ?? signature?.signedAt ?? '',
    ),
    assinadoPor: String(
      raw.assinadoPor ?? raw.signedBy ?? signature?.assinadoPor ?? signature?.signedBy ?? '',
    ),
  } as CertificateManagementItem;
}

function unwrapData(value: unknown): unknown {
  let current = value;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return current;
    const record = current as Record<string, unknown>;
    if (!('data' in record)) return current;
    current = record.data;
  }
  return current;
}

class CertificateService {
  async getCertificatesByEvent(
    eventoId: number,
    page = 1,
    limit = 20,
  ): Promise<CertificatePageResponse> {
    try {
      const { data } = await api.get<CertificateListResponse>(
        `/event/${eventoId}/certificate`,
        { params: { page, limit } },
      );
      const unwrapped = unwrapData(data) as
        | CertificateManagementItem[]
        | { items?: CertificateManagementItem[]; certificados?: CertificateManagementItem[] }
        | undefined;
      const rawItems = Array.isArray(unwrapped)
        ? unwrapped
        : unwrapped?.items ?? unwrapped?.certificados ?? [];
      const items = (Array.isArray(rawItems) ? rawItems : []).map(normalizeCertificateItem);
      return { items, hasMore: items.length === limit };
    } catch (error) {
      // O backend responde 404 quando o evento ainda não tem nenhum certificado —
      // isso é um resultado vazio válido, não uma falha de carregamento.
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { items: [], hasMore: false };
      }
      throw error;
    }
  }

  async getCertificateById(id: string): Promise<CertificateManagementItem> {
    const { data } = await api.get<CertificateResponse>(`/certificate/${id}`);
    return normalizeCertificateItem(data.data);
  }

  async getCertificatePdf(id: string): Promise<Blob> {
    try {
      const { data } = await api.get<Blob>(`/certificate/${encodeURIComponent(id)}/pdf`, {
        responseType: 'blob',
      });
      return data;
    } catch (error) {
      // Com responseType 'blob' o corpo de ERRO também vem como Blob, e chegaria
      // ilegível em extractApiErrorMessage.
      if (error instanceof AxiosError && error.response?.data instanceof Blob) {
        try {
          error.response.data = JSON.parse(await error.response.data.text());
        } catch {
          // corpo não era JSON: deixa como está e cai na mensagem genérica
        }
      }
      throw error;
    }
  }

  async getCertificateStatsByEvent(eventoId: number): Promise<CertificateRoleStat[]> {
    const { data } = await api.get<CertificateStatsResponse>(
      `/event/${eventoId}/certificate/stats`,
    );
    const stats = unwrapData(data);
    return Array.isArray(stats) ? stats : [];
  }

  // Assina em lote todos os certificados ainda não assinados do evento (só organizador).
  // Idempotente: rodar de novo só assina os que faltam.
  async signCertificatesBatch(eventoId: number): Promise<CertificateBatchSignResult> {
    const { data } = await api.post(`/event/${eventoId}/certificate/sign`);
    // O backend pode envelopar o resultado em quantidades diferentes de camadas
    // ({ statusCode, message, data } ou { data: { message, data } }). Desembrulha
    // as camadas de `data` até encontrar o objeto que realmente tem `assinados`.
    let payload: unknown = data;
    for (let depth = 0; depth < 4 && payload && typeof payload === 'object'; depth++) {
      const record = payload as Record<string, unknown>;
      const signedCount = record.assinados ?? record.signedCount ?? record.signed;
      if (signedCount !== undefined || 'assinante' in record || 'signer' in record) {
        return {
          assinados: Number(signedCount ?? 0),
          assinante: String(record.assinante ?? record.signer ?? ''),
          certificados: Array.isArray(record.certificados)
            ? (record.certificados as CertificateBatchSignResult['certificados'])
            : [],
        };
      }
      payload = record.data;
    }
    // Assinatura concluída no backend, mas sem corpo reconhecível: não quebra a UI.
    return { assinados: 0, assinante: '', certificados: [] };
  }

  // Emite os certificados de participante/monitor/organizador do evento (evento precisa
  // estar finalizado). Pula quem já tem certificado — seguro chamar mais de uma vez.
  async generateParticipantCertificates(eventoId: number): Promise<void> {
    await api.post(`/event/${eventoId}/certificate/participants`);
  }

  // Emite os certificados dos convidados (palestrante/ministrante/moderador) de uma
  // atividade (atividade precisa estar finalizada). Também seguro chamar mais de uma vez.
  async generateGuestCertificates(atividadeId: number | string): Promise<void> {
    await api.post(`/activity/${atividadeId}/certificate/guests`);
  }

  // Emite os certificados de participante de uma atividade específica, para quem tem
  // presença confirmada nela. Só funciona se a atividade tiver `gerarCertificado: true`
  // e estiver com status "finalizada" — senão o backend responde 403. Idempotente: quem
  // já tem certificado entra em `alreadyIssued` e não gera arquivo duplicado.
  async generateActivityCertificates(
    atividadeId: number | string,
  ): Promise<GenerateActivityCertificatesResult> {
    const { data } = await api.post<{ message?: string; data: GenerateActivityCertificatesResult }>(
      `/activity/${atividadeId}/certificate/participants`,
    );
    return data.data;
  }

  // Verifica publicamente a autenticidade de um certificado pelo código de verificação.
  // Rota pública (não exige login). Lança CertificateVerificationError quando o
  // certificado não é válido, com a mensagem que o backend devolveu.
  async verifyCertificate(codigo: string): Promise<CertificateVerificationResult> {
    try {
      const { data } = await api.get<{ message?: string; data: CertificateVerification }>(
        `/certificate/verify/${encodeURIComponent(codigo)}`,
      );
      return {
        message: data.message ?? 'Certificado autêntico.',
        data: data.data,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const backendMessage =
          (error.response.data as { message?: string } | undefined)?.message;
        throw new CertificateVerificationError(
          backendMessage ?? 'Não foi possível confirmar a autenticidade deste certificado.',
        );
      }
      throw error;
    }
  }

  // Lista todos os certificados do usuário logado, de todos os eventos
  async getMyCertificates(page = 1, limit = 100): Promise<CertificatePageResponse> {
    try {
      const { data } = await api.get<CertificateListResponse>('/certificate/me', {
        params: { page, limit },
      });
      const items = data.data.map(normalizeCertificateItem);
      return { items, hasMore: items.length === limit };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { items: [], hasMore: false };
      }
      throw error;
    }
  }
}

export const certificateService = new CertificateService();
