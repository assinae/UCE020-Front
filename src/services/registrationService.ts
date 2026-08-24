import { AxiosError } from 'axios';
import { api } from './api';

const ACTIVITY_ID_MAP: Record<string, number> = {
  a1: 1,
  a2: 2,
  a3: 3,
};

type RegistrationResponse = {
  success: boolean;
  data: {
    activityId: number;
    userId: number;
    participationId: number;
  };
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

class RegistrationService {
  private normalizeActivityId(activityId: string | number): number {
    if (typeof activityId === 'number') {
      return activityId;
    }

    const mappedId = ACTIVITY_ID_MAP[activityId];
    if (mappedId) {
      return mappedId;
    }

    const normalized = Number(activityId);

    if (Number.isNaN(normalized)) {
      throw new Error(`Atividade mock sem mapeamento para o banco: ${activityId}`);
    }

    return normalized;
  }

  async register(
    _eventId: string,
    activityId: string,
  ): Promise<RegistrationResponse> {
    const normalizedActivityId = this.normalizeActivityId(activityId);

    try {
      const { data } = await api.post<RegistrationResponse>(
        `/activity/${normalizedActivityId}/subscribe`,
      );

      return data;
    } catch (error: unknown) {
      const errorData = (error as AxiosError<ApiErrorResponse>).response?.data;

      throw new Error(
        errorData?.error ||
          errorData?.message ||
          'Erro ao realizar inscrição',
      );
    }
  }

  async unregister(
    _eventId: string,
    activityId: string,
  ): Promise<RegistrationResponse> {
    const normalizedActivityId = this.normalizeActivityId(activityId);

    try {
      const { data } = await api.delete<RegistrationResponse>(
        `/activity/${normalizedActivityId}/unsubscribe`,
      );

      return data;
    } catch (error: unknown) {
      const errorData = (error as AxiosError<ApiErrorResponse>).response?.data;

      throw new Error(
        errorData?.error ||
          errorData?.message ||
          'Erro ao cancelar inscrição',
      );
    }
  }

  canRegister(isRegistered: boolean): boolean {
    return !isRegistered;
  }

  canUnregister(isRegistered: boolean): boolean {
    return isRegistered;
  }
}

export const registrationService = new RegistrationService();