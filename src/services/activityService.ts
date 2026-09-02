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
  /** Se a atividade está configurada para emitir certificado individual de participante. */
  gerarCertificado: boolean;
};

export interface CreateActivityPayload {
  name: string;
  category: string;
  location: string;
  workload: number;
  description: string;
  startDate: string;
  endDate: string;
  eventId?: number;
  generateCertificate?: boolean;
  guests?: {
    name: string;
    email: string;
    role: string;
  }[];
}

export type UpdateActivityPayload = Partial<CreateActivityPayload>;

type ActivityDetailsApiResponse = {
  statusCode?: number;
  message?: string;
  data?:
    | {
        success?: boolean;
        data?: ActivityDetails | Record<string, unknown>;
      }
    | ActivityDetails
    | Record<string, unknown>;
};

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's', 'yes', 'y', 'ativo', 'inscrito'].includes(normalized)) {
      return true;
    }
    if (
      ['false', '0', 'nao', 'não', 'n', 'no', 'inativo', 'nao inscrito', 'não inscrito'].includes(
        normalized
      )
    ) {
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

    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object' ||
      visited.has(current)
    ) {
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
        record.hasSubscription
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
  private normalizeActivityData(
    value: ActivityDetails | Record<string, unknown> | undefined,
    fallback: Partial<CreateActivityPayload> & { id?: number } = {}
  ): ActivityDetails {
    const normalizedActivityData = (value ?? {}) as ActivityDetails & Record<string, unknown>;

    return {
      id: Number(normalizedActivityData.id ?? fallback.id ?? 0),
      nome: String(normalizedActivityData.nome ?? fallback.name ?? ''),
      descricao: String(normalizedActivityData.descricao ?? fallback.description ?? ''),
      localizacao: String(normalizedActivityData.localizacao ?? fallback.location ?? ''),
      dataInicio: String(normalizedActivityData.dataInicio ?? fallback.startDate ?? ''),
      dataFim: String(normalizedActivityData.dataFim ?? fallback.endDate ?? ''),
      categoria: String(normalizedActivityData.categoria ?? fallback.category ?? ''),
      cargaHoraria: Number(normalizedActivityData.cargaHoraria ?? fallback.workload ?? 0),
      status: String(normalizedActivityData.status ?? ''),
      foto: normalizedActivityData.foto ?? null,
      eventoId: Number(normalizedActivityData.eventoId ?? fallback.eventId ?? 0),
      gerarCertificado:
        toBoolean(normalizedActivityData.gerarCertificado) ??
        toBoolean(normalizedActivityData.generateCertificate) ??
        Boolean(fallback.generateCertificate),
      isRegistered: toBoolean(normalizedActivityData.isRegistered) ?? false,
    };
  }

  async create(payload: CreateActivityPayload): Promise<ActivityDetails> {
    const { data } = await api.post<{
      message?: string;
      data?: ActivityDetails | Record<string, unknown>;
    }>('/activity', payload);

    const activityData =
      typeof data?.data === 'object' && data.data !== null && !Array.isArray(data.data)
        ? (data.data as ActivityDetails | Record<string, unknown>)
        : data;

    return this.normalizeActivityData(activityData, payload);
  }

  async update(
    activityId: string | number,
    payload: UpdateActivityPayload
  ): Promise<ActivityDetails> {
    const normalizedActivityId = Number(activityId);
    if (Number.isNaN(normalizedActivityId)) {
      throw new Error(`ID de atividade inválido: ${activityId}`);
    }

    const { data } = await api.patch<ActivityDetailsApiResponse>(
      `/activity/${normalizedActivityId}`,
      payload
    );
    const responseData = data?.data;
    const activityData =
      typeof responseData === 'object' && responseData !== null && 'data' in responseData
        ? (responseData as { data?: ActivityDetails | Record<string, unknown> }).data
        : responseData;

    return this.normalizeActivityData(activityData, { ...payload, id: normalizedActivityId });
  }

  async remove(activityId: string | number): Promise<void> {
    const normalizedActivityId = Number(activityId);
    if (Number.isNaN(normalizedActivityId)) {
      throw new Error(`ID de atividade inválido: ${activityId}`);
    }
    await api.delete(`/activity/${normalizedActivityId}`);
  }

  async findOne(activityId: string | number): Promise<ActivityDetails> {
    const normalizedActivityId = Number(activityId);

    if (Number.isNaN(normalizedActivityId)) {
      throw new Error(`ID de atividade inválido: ${activityId}`);
    }

    try {
      const { data } = await api.get<ActivityDetailsApiResponse>(
        `/activity/${normalizedActivityId}`
      );

      const payload = data?.data;
      const nestedData =
        typeof payload === 'object' && payload !== null && 'data' in payload
          ? (payload as { data?: ActivityDetails | Record<string, unknown> }).data
          : payload;

      const activityData = typeof nestedData === 'object' && nestedData !== null ? nestedData : {};

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
        gerarCertificado:
          toBoolean(normalizedActivityData.gerarCertificado) ??
          toBoolean(normalizedActivityData.generateCertificate) ??
          false,
        isRegistered:
          toBoolean(normalizedActivityData.isRegistered) ??
          toBoolean(normalizedActivityData.inscrito) ??
          toBoolean(normalizedActivityData.registered) ??
          fallbackRegistrationFlag,
      };
    } catch (error: unknown) {
      const errorData = (error as AxiosError<ApiErrorResponse>).response?.data;

      throw new Error(
        errorData?.error || errorData?.message || 'Erro ao buscar detalhes da atividade'
      );
    }
  }
}

export const activityService = new ActivityService();