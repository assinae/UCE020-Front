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

// O backend ainda não tem um fluxo de assinatura — todo certificado real vem
// como "Pendente de assinatura" até esse fluxo existir de fato.
const DEFAULT_STATUS = 'Pendente' as const;

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
      const items = data.data.map((item) => ({ ...item, status: DEFAULT_STATUS }));
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
    return { ...data.data, status: DEFAULT_STATUS };
  }

  async getCertificateStatsByEvent(eventoId: number): Promise<CertificateRoleStat[]> {
    const { data } = await api.get<CertificateStatsResponse>(
      `/event/${eventoId}/certificate/stats`,
    );
    return data.data;
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
      if ('assinados' in (payload as Record<string, unknown>)) {
        return payload as CertificateBatchSignResult;
      }
      payload = (payload as { data?: unknown }).data;
    }
    // Assinatura concluída no backend, mas sem corpo reconhecível: não quebra a UI.
    return { assinados: 0, semArquivo: 0, assinante: '', certificados: [] };
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
      const items = data.data.map((item) => ({ ...item, status: DEFAULT_STATUS }));
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
