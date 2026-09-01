import { api } from './api';
import { Event, resolveCertificateTemplateUrl } from '../types/event';

export interface CreateActivityPayload {
  id?: number;
  name: string;
  category: string;
  location: string;
  workload: number;
  description: string;
  startDate: string;
  endDate: string;
  eventId?: number;
  /** Se a atividade deve emitir certificado individual de participante (default: false). */
  generateCertificate?: boolean;
  guests?: {
    name: string;
    email: string;
    role: string;
  }[];
}

export interface CreateEventPayload {
  nome: string;
  codigo?: string;
  descricao: string;
  localizacao: string;
  responsavel: string;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;
  status: 'pendente' | 'iniciada' | 'andamento' | 'finalizada';
  foto?: string | null;
  templateUrl?: string | null;
  certificadoTemplate?: string | null;
  template?: string | null;
  atividades?: CreateActivityPayload[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;
export type TipoParticipante = 'participante' | 'monitor' | 'organizador';

interface EventResponse {
  message: string;
  data: Event;
}

interface EventsResponse {
  message: string;
  data: Event[];
}

export interface EventMember {
  id: number;
  usuarioId: number;
  tipo: TipoParticipante;
  nome: string;
  email: string;
}

interface EventMembersResponse {
  message: string;
  data: EventMember[];
}

interface EventMemberResponse {
  message: string;
  data: EventMember;
}

function isDataUrl(value: string): boolean {
  return typeof value === 'string' && value.startsWith('data:');
}

function isRemoteAssetUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:');
}

function sanitizePayloadForSubmit(payload: Record<string, unknown>) {
  const sanitized: Record<string, unknown> = { ...payload };

  delete sanitized.templateUrl;
  delete sanitized.certificadoTemplate;

  if (typeof sanitized.foto === 'string' && !isDataUrl(sanitized.foto)) {
    delete sanitized.foto;
  }

  if (typeof sanitized.template === 'string' && !isDataUrl(sanitized.template)) {
    delete sanitized.template;
  }

  return sanitized;
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!matches) {
    return new File([dataUrl], filename, { type: 'application/octet-stream' });
  }

  const [, mimeType, base64] = matches;
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
}

function buildEventFormData(payload: Record<string, unknown>): FormData {
  const formData = new FormData();

  const appendValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return;

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === 'boolean' || typeof value === 'number') {
      formData.append(key, String(value));
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return;

      if (isDataUrl(trimmed)) {
        const file = dataUrlToFile(trimmed, key === 'foto' ? 'foto.png' : `${key}.png`);
        formData.append(key, file);
        return;
      }

      if (isRemoteAssetUrl(trimmed)) {
        return;
      }

      formData.append(key, trimmed);
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, JSON.stringify(value));
  };

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'templateUrl' || key === 'certificadoTemplate') return;

    if ((key === 'template' || key === 'foto') && typeof value === 'string' && !isDataUrl(value)) {
      return;
    }

    appendValue(key, value);
  });

  return formData;
}

class EventService {
  async create(payload: CreateEventPayload): Promise<Event> {
    const sanitizedPayload = sanitizePayloadForSubmit(payload as unknown as Record<string, unknown>);
    const hasFileUpload = Boolean(
      (typeof sanitizedPayload.foto === 'string' && isDataUrl(sanitizedPayload.foto)) ||
      (typeof sanitizedPayload.template === 'string' && isDataUrl(sanitizedPayload.template)) ||
      sanitizedPayload.foto instanceof File ||
      sanitizedPayload.template instanceof File,
    );
    const requestPayload = hasFileUpload
      ? buildEventFormData(sanitizedPayload)
      : sanitizedPayload;
    const { data } = await api.post<EventResponse>(
      '/event',
      requestPayload,
      hasFileUpload ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
    );
    return data.data;
  }

  async findAll(): Promise<Event[]> {
    const { data } = await api.get<EventsResponse>('/event');
    return data.data;
  }

  async findOne(id: number): Promise<Event> {
    const { data } = await api.get<EventResponse>(`/event/${id}`);
    return data.data;
  }

  async update(id: number, payload: UpdateEventPayload): Promise<Event> {
    const sanitizedPayload = sanitizePayloadForSubmit(payload as unknown as Record<string, unknown>);
    const hasFileUpload = Boolean(
      (typeof sanitizedPayload.foto === 'string' && isDataUrl(sanitizedPayload.foto)) ||
      (typeof sanitizedPayload.template === 'string' && isDataUrl(sanitizedPayload.template)) ||
      sanitizedPayload.foto instanceof File ||
      sanitizedPayload.template instanceof File,
    );
    const requestPayload = hasFileUpload
      ? buildEventFormData(sanitizedPayload)
      : sanitizedPayload;
    const { data } = await api.patch<EventResponse>(
      `/event/${id}`,
      requestPayload,
      hasFileUpload ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
    );
    return data.data;
  }

  async remove(id: number): Promise<Event> {
    const { data } = await api.delete<EventResponse>(`/event/${id}`);
    return data.data;
  }

  async deleteEvent(id: number): Promise<Event> {
    const { data } = await api.delete<EventResponse>(`/event/${id}`);
    return data.data;
  }

   async finalize(id: number): Promise<Event> {
    const { data } = await api.patch<EventResponse>(`/event/${id}/finalizar`);
    return data.data;
  }

  async findByCodigo(codigo: string): Promise<Event> {
    const { data } = await api.get<EventResponse>(`/event/codigo/${codigo}`);
    return data.data;
  }

  //Traz todos os eventos pelo tipo de participante dele (participante, monitor ou organizador)
  //Ex: tipo = 'participante' => traz todos os eventos que o usuário participa
  async findParticipatingEvents(tipo?: TipoParticipante): Promise<Event[]> {
    const { data } = await api.get<EventsResponse>('/event/participating', {
      params: tipo ? { tipo } : undefined,
    });
    return data.data;
  }

  async getEventMembers(eventId: number): Promise<EventMember[]> {
    const { data } = await api.get<EventMembersResponse>(`/event/${eventId}/members`);
    return data.data;
  }

  async updateEventMember(eventId: number, userId: number, tipo: TipoParticipante): Promise<EventMember> {
    const { data } = await api.patch<EventMemberResponse>(`/event/${eventId}/members/${userId}`, { tipo });
    return data.data;
  }

  async removeEventMember(eventId: number, userId: number): Promise<EventMember> {
    const { data } = await api.delete<EventMemberResponse>(`/event/${eventId}/members/${userId}`);
    return data.data;
  }
}

export const eventService = new EventService();

