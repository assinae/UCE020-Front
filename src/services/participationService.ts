import { api } from './api';
import type { Participant } from '@/types/participant';

export type TipoParticipante = 'participante' | 'monitor' | 'organizador';

interface ParticipationResponse {
  message: string;
  data: {
    tipo?: TipoParticipante;
    eventoId?: number;
    userId?: number;
  };
}

interface ActivitySubscribeResponse {
  message?: string;
  data?: {
    success?: boolean;
    data?: {
      activityId: number;
      userId: number;
      participationId: number;
    };
  };
}

interface BackendParticipant {
  participacaoId: number;
  atividadeId: number;
  presente: boolean;
  dataPresenca: string | null;
  usuarioId: number;
  tipo: string;
  nome: string;
  email: string;
}

interface ParticipantsResponse {
  message: string;
  data: BackendParticipant[];
}

function unwrapPayload<T>(responseData: unknown): T | null {
  if (!responseData || typeof responseData !== 'object') return null;

  const payload = responseData as { data?: unknown; statusCode?: number; message?: string };
  const nested = payload.data;

  if (nested && typeof nested === 'object' && 'data' in (nested as Record<string, unknown>)) {
    return (nested as { data: T }).data;
  }

  return (payload.data as T) ?? null;
}

class ParticipationService {
  async subscribe(eventoId: number): Promise<ParticipationResponse> {
    const { data } = await api.post<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );

    const payload = unwrapPayload<{ tipo?: TipoParticipante; eventoId?: number; userId?: number }>(data);

    return {
      message: data?.message ?? 'Inscrição realizada com sucesso',
      data: {
        tipo: payload?.tipo,
        eventoId: payload?.eventoId,
        userId: payload?.userId,
      },
    };
  }

  async unsubscribe(eventoId: number): Promise<ParticipationResponse> {
    const { data } = await api.delete<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );

    const payload = unwrapPayload<{ tipo?: TipoParticipante; eventoId?: number; userId?: number }>(data);

    return {
      message: data?.message ?? 'Inscrição cancelada com sucesso',
      data: {
        tipo: payload?.tipo,
        eventoId: payload?.eventoId,
        userId: payload?.userId,
      },
    };
  }

  //Traz o tipo de participação do usuário autenticado naquele evento
  //Ex: 'participante', 'monitor' ou 'organizador'
  async getTipoParticipante(eventoId: number): Promise<TipoParticipante> {
    const { data } = await api.get<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );

    const payload = unwrapPayload<{ tipo?: TipoParticipante }>(data);
    return payload?.tipo ?? 'participante';
  }

  async subscribeToActivity(atividadeId: number, userId: number): Promise<{
    activityId: number;
    userId: number;
    participationId: number;
  }> {
    const { data } = await api.post<ActivitySubscribeResponse>(
      `/activity/${atividadeId}/subscribe`,
      { userId },
    );

    const payload = unwrapPayload<{
      activityId: number;
      userId: number;
      participationId: number;
    }>(data);

    return payload ?? { activityId: atividadeId, userId, participationId: 0 };
  }

  async unsubscribeFromActivity(atividadeId: number, userId: number): Promise<{
    activityId: number;
    userId: number;
    participationId: number;
  }> {
    const { data } = await api.delete<ActivitySubscribeResponse>(
      `/activity/${atividadeId}/unsubscribe`,
      { data: { userId } },
    );

    const payload = unwrapPayload<{
      activityId: number;
      userId: number;
      participationId: number;
    }>(data);

    return payload ?? { activityId: atividadeId, userId, participationId: 0 };
  }

  async getActivityParticipants(eventoId: number, atividadeId: number): Promise<Participant[]> {
    const { data } = await api.get<ParticipantsResponse>(
      `/event/${eventoId}/subscription/activity/${atividadeId}/participants`,
    );

    const payload = unwrapPayload<BackendParticipant[]>(data);

    return (payload ?? []).map((participant) => ({
      id: String(participant.usuarioId),
      name: participant.nome,
      presenceStatus: participant.presente ? 'confirmed' : 'pending',
    }));
  }
}

export const participationService = new ParticipationService();