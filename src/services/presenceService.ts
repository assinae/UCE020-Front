import axios from 'axios';
import { api } from './api';
import type { ConfirmPresenceRequest, ConfirmPresenceResponse } from '@/types/presence';

interface BackendAttendanceResponse {
  message: string;
  data: {
    eventoId: number;
    atividadeId: number;
    userId: number;
    participacaoId: number;
    presente: boolean;
    dataPresenca: string;
  };
}

function unwrapAttendancePayload(responseData: unknown): BackendAttendanceResponse['data'] | null {
  if (!responseData || typeof responseData !== 'object') return null;

  const payload = responseData as { data?: unknown; message?: string };
  const nested = payload.data;

  if (nested && typeof nested === 'object' && 'data' in (nested as Record<string, unknown>)) {
    return (nested as { data: BackendAttendanceResponse['data'] }).data;
  }

  return (payload.data as BackendAttendanceResponse['data']) ?? null;
}

class PresenceService {
  async confirmPresence(request: ConfirmPresenceRequest): Promise<ConfirmPresenceResponse> {
    const { participantId, activityId, eventId } = request;
    const userId = Number(participantId);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('ID do participante inválido.');
    }

    try {
      const { data } = await api.post<BackendAttendanceResponse>(
        `/event/${eventId}/subscription/activity/${activityId}/attendance`,
        { userId },
      );

      const attendance = unwrapAttendancePayload(data);

      return {
        ok: true,
        participant: {
          id: String(attendance?.userId ?? participantId),
          name: '',
        },
        eventId: String(attendance?.eventoId ?? eventId),
        activityId: String(attendance?.atividadeId ?? activityId),
        confirmedAt: attendance?.dataPresenca ?? new Date().toISOString(),
        message: data?.message,
      };
    } catch (error: unknown) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async removePresence(request: ConfirmPresenceRequest): Promise<ConfirmPresenceResponse> {
    const { participantId, activityId, eventId } = request;
    const userId = Number(participantId);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('ID do participante inválido.');
    }

    try {
      const { data } = await api.delete<BackendAttendanceResponse>(
        `/event/${eventId}/subscription/activity/${activityId}/attendance`,
        { data: { userId } },
      );

      const attendance = unwrapAttendancePayload(data);

      return {
        ok: true,
        participant: {
          id: String(attendance?.userId ?? participantId),
          name: '',
        },
        eventId: String(attendance?.eventoId ?? eventId),
        activityId: String(attendance?.atividadeId ?? activityId),
        confirmedAt: attendance?.dataPresenca ?? '',
        message: data?.message,
      };
    } catch (error: unknown) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message || error.response?.data?.error;

      if (typeof serverMessage === 'string' && serverMessage.trim()) {
        return serverMessage;
      }

      if (error.response?.status === 404) {
        return 'Participante não inscrito nesta atividade';
      }

      if (error.response?.status === 409) {
        return 'Presença já registrada';
      }

      if (error.response?.status === 400) {
        return 'Não foi possível confirmar a presença neste momento';
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Erro ao confirmar presença';
  }
}

export const presenceService = new PresenceService();
