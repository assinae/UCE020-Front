import { AxiosError } from 'axios';
import { api } from './api';
import { Event } from '../types/event';

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
  certificadoPersonalizacao?: CertificateCustomizationPayload | null;
  atividades?: CreateActivityPayload[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;
export type TipoParticipante = 'participante' | 'monitor' | 'organizador';

export interface CertificateCustomizationTexts {
  titulo?: string;
  subtitulo?: string;
  descricaoInicio?: string;
  descricaoEvento?: string;
  descricaoCargaHoraria?: string;
}

export interface CertificateCustomizationPayload {
  template?: string | null;
  templateUrl?: string | null;
  textos?: CertificateCustomizationTexts;
}

export interface CertificateCustomizationDraftPayload extends CertificateCustomizationPayload {
  evento: {
    nome: string;
    descricao: string;
    localizacao: string;
    responsavel: string;
    cargaHoraria: number;
    dataInicio: string;
    dataFim: string;
    status: CreateEventPayload['status'];
  };
}

export interface CertificateCustomizationDefault {
  templateUrl?: string | null;
  textos?: CertificateCustomizationTexts;
  previewPdf?: Blob;
}

interface CertificateDefaultTextsResponse {
  data?: {
    textos?: CertificateCustomizationTexts;
  };
}

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

function hasCustomizationTemplateUpload(value: unknown): boolean {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as CertificateCustomizationPayload).template === 'string' &&
    isDataUrl((value as CertificateCustomizationPayload).template as string)
  );
}

function base64ToBlob(base64: string, type = 'application/pdf'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  return new Blob([new Uint8Array(byteNumbers)], { type });
}

async function parseCertificateCustomizationDefault(
  data: Blob,
  headers?: Record<string, unknown>,
): Promise<CertificateCustomizationDefault> {
  const content = await data.text();
  type ParsedDefault = CertificateCustomizationDefault & {
    pdfBase64?: string;
    previewPdfBase64?: string;
    data?: unknown;
  };

  function findCustomization(value: unknown): CertificateCustomizationDefault | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;

    const record = value as Record<string, unknown>;
    const nestedCustomization = record.certificadoPersonalizacao ?? record.certificateCustomization;
    if (nestedCustomization && typeof nestedCustomization === 'object') {
      const found = findCustomization(nestedCustomization);
      if (found) return found;
    }

    if (record.textos && typeof record.textos === 'object') {
      return {
        templateUrl: typeof record.templateUrl === 'string' ? record.templateUrl : undefined,
        textos: record.textos as CertificateCustomizationTexts,
      };
    }

    if (record.data) return findCustomization(record.data);
    return undefined;
  }

  if (data.type.includes('application/json') || content.trimStart().startsWith('{')) {
    const parsed = JSON.parse(content) as ParsedDefault;
    const customization = findCustomization(parsed);
    const textos = parsed.textos ?? customization?.textos;
    const templateUrl = parsed.templateUrl ?? customization?.templateUrl;
    const pdfBase64 = parsed.previewPdfBase64 ?? parsed.pdfBase64;

    return {
      templateUrl,
      textos,
      previewPdf: pdfBase64 ? base64ToBlob(pdfBase64) : undefined,
    };
  }

  const headerText = Object.entries(headers ?? {}).find(([key]) =>
    ['x-certificate-default-texts', 'x-certificate-texts'].includes(key.toLowerCase()),
  )?.[1];
  if (typeof headerText === 'string') {
    try {
      return { previewPdf: data, textos: JSON.parse(decodeURIComponent(headerText)) };
    } catch {
      // mantém o PDF mesmo quando o header não contém JSON válido
    }
  }

  return { previewPdf: data };
}

function buildEventFormData(
  payload: Record<string, unknown>,
  preserveRemoteTemplate = false,
): FormData {
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

      if (isRemoteAssetUrl(trimmed) && preserveRemoteTemplate && key === 'template') {
        formData.append('templateUrl', trimmed);
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

    if (key === 'certificadoPersonalizacao' && typeof value === 'object') {
      const customization = value as CertificateCustomizationPayload;
      if (typeof customization.template === 'string' && isDataUrl(customization.template)) {
        formData.append('template', dataUrlToFile(customization.template, 'template.png'));
      } else if (
        preserveRemoteTemplate &&
        typeof customization.template === 'string' &&
        isRemoteAssetUrl(customization.template)
      ) {
        formData.append('templateUrl', customization.template);
      }
      formData.append(
        'certificadoPersonalizacao',
        JSON.stringify({
          ...(preserveRemoteTemplate &&
          typeof customization.template === 'string' &&
          isRemoteAssetUrl(customization.template)
            ? { templateUrl: customization.template }
            : {}),
          textos: customization.textos ?? {},
        }),
      );
      return;
    }

    formData.append(key, JSON.stringify(value));
  };

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'templateUrl' || key === 'certificadoTemplate') return;

    if (
      (key === 'template' || key === 'foto') &&
      typeof value === 'string' &&
      !isDataUrl(value) &&
      !(preserveRemoteTemplate && key === 'template')
    ) {
      return;
    }

    appendValue(key, value);
  });

  return formData;
}

class EventService {
  async getDefaultCertificateTexts(nomeEvento: string): Promise<CertificateCustomizationTexts> {
    const { data } = await api.get<CertificateDefaultTextsResponse>(
      '/event/certificate/customization/default-texts',
      { params: { nomeEvento } },
    );
    return data.data?.textos ?? {};
  }

  async create(payload: CreateEventPayload): Promise<Event> {
    const sanitizedPayload = sanitizePayloadForSubmit(payload as unknown as Record<string, unknown>);
    const hasFileUpload = Boolean(
      (typeof sanitizedPayload.foto === 'string' && isDataUrl(sanitizedPayload.foto)) ||
      (typeof sanitizedPayload.template === 'string' && isDataUrl(sanitizedPayload.template)) ||
      hasCustomizationTemplateUpload(sanitizedPayload.certificadoPersonalizacao) ||
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
      hasCustomizationTemplateUpload(sanitizedPayload.certificadoPersonalizacao) ||
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

  async getDefaultCertificateCustomization(
    payload: CertificateCustomizationDraftPayload,
  ): Promise<CertificateCustomizationDefault> {
    const requestPayload = buildEventFormData(
      payload as unknown as Record<string, unknown>,
      true,
    );
    const response = await api.post<Blob>(
      '/event/certificate/customization/default',
      requestPayload,
      { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' },
    );

    const defaultTextsHeader = response.headers['x-certificate-default-texts'];
    const fallback = await parseCertificateCustomizationDefault(response.data, response.headers);

    if (!defaultTextsHeader || typeof defaultTextsHeader !== 'string') {
      return fallback;
    }

    try {
      return {
        ...fallback,
        textos: JSON.parse(decodeURIComponent(defaultTextsHeader)),
      };
    } catch {
      return fallback;
    }
  }

  async previewCertificateCustomization(
    payload: CertificateCustomizationDraftPayload,
  ): Promise<Blob> {
    try {
      const requestPayload = buildEventFormData(
        payload as unknown as Record<string, unknown>,
        true,
      );
      const { data } = await api.post<Blob>(
        '/event/certificate/customization/preview',
        requestPayload,
        { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' },
      );
      return data;
    } catch (error) {
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

