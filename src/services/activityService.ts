import { AxiosError } from 'axios';
import { api } from './api';

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export type ActivityDetails = {
  id: number;
  nome: string;
  descricao: string;
  localizacao: string;
  dataInicio: string;
  dataFim: string;
  categoria: string;
  cargaHoraria: number;
  status: string;
  foto?: string | null;
  eventoId: number;
  isRegistered?: boolean;
};

type ActivityDetailsApiResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    success?: boolean;
    data?: ActivityDetails | Record<string, unknown>;
  } | ActivityDetails | Record<string, unknown>;
};

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's', 'yes', 'y', 'ativo', 'inscrito'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'nao', 'não', 'n', 'no', 'inativo', 'nao inscrito', 'não inscrito'].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}

function extractRegistrationFlag(value: unknown): boolean {
  const visited = new Set<unknown>();
  const stack: unknown[] = [value];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current === null || current === undefined || typeof current !== 'object' || visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (Array.isArray(current)) {
      stack.push(...current);
      continue;
    }

    const record = current as Record<string, unknown>;
    const directMatch = toBoolean(
      record.isRegistered ??
        record.isSubscribed ??
        record.subscribed ??
        record.registered ??
        record.inscrito ??
        record.isParticipating ??
        record.participating ??
        record.hasParticipation ??
        record.hasSubscription,
    );

    if (directMatch !== undefined) {
      return directMatch;
    }

    for (const nestedValue of Object.values(record)) {
      if (nestedValue !== null && typeof nestedValue === 'object') {
        stack.push(nestedValue);
      }
    }
  }

  return false;
}

class ActivityService {
  async findOne(activityId: string | number): Promise<ActivityDetails> {
    const normalizedActivityId = Number(activityId);

    if (Number.isNaN(normalizedActivityId)) {
      throw new Error(`ID de atividade inválido: ${activityId}`);
    }

    try {
      const { data } = await api.get<ActivityDetailsApiResponse>(
        `/activity/${normalizedActivityId}`,
      );

      const payload = data?.data;
      const nestedData =
        typeof payload === 'object' && payload !== null && 'data' in payload
          ? (payload as { data?: ActivityDetails | Record<string, unknown> }).data
          : payload;

      const activityData =
        typeof nestedData === 'object' && nestedData !== null ? nestedData : {};

      const normalizedActivityData = activityData as ActivityDetails & Record<string, unknown>;
      const fallbackRegistrationFlag = extractRegistrationFlag(data);

      return {
        id: Number(normalizedActivityData.id ?? normalizedActivityId),
        nome: String(normalizedActivityData.nome ?? ''),
        descricao: String(normalizedActivityData.descricao ?? ''),
        localizacao: String(normalizedActivityData.localizacao ?? ''),
        dataInicio: String(normalizedActivityData.dataInicio ?? ''),
        dataFim: String(normalizedActivityData.dataFim ?? ''),
        categoria: String(normalizedActivityData.categoria ?? ''),
        cargaHoraria: Number(normalizedActivityData.cargaHoraria ?? 0),
        status: String(normalizedActivityData.status ?? ''),
        foto: normalizedActivityData.foto ?? null,
        eventoId: Number(normalizedActivityData.eventoId ?? 0),
        isRegistered:
          toBoolean(normalizedActivityData.isRegistered) ??
          toBoolean(normalizedActivityData.inscrito) ??
          toBoolean(normalizedActivityData.registered) ??
          fallbackRegistrationFlag,
      };
    } catch (error: unknown) {
      const errorData = (error as AxiosError<ApiErrorResponse>).response?.data;

      throw new Error(
        errorData?.error ||
          errorData?.message ||
          'Erro ao buscar detalhes da atividade',
      );
    }
  }
}

export const activityService = new ActivityService();