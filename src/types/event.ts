import type { Activity } from '@/types/activity';

export interface CertificateCustomization {
  template?: string | null;
  templateUrl?: string | null;
  textos?: {
    titulo?: string;
    subtitulo?: string;
    descricaoInicio?: string;
    descricaoEvento?: string;
    descricaoCargaHoraria?: string;
  };
}

export interface Event {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  localizacao: string;
  responsavel: string;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  foto: string | null;
  templateUrl?: string | null;
  certificadoTemplate?: string | null;
  template?: string | null;
  certificadoPersonalizacao?: CertificateCustomization | null;
  certificateCustomization?: CertificateCustomization | null;
  atividades?: Activity[];
  createdAt: string;
  updatedAt: string;
  totalInscritos?: number;
}

export function resolveCertificateTemplateUrl(
  event?: Partial<Pick<Event, 'templateUrl' | 'certificadoTemplate' | 'template'>> & {
    template_url?: string | null;
    urlTemplate?: string | null;
    templateFileUrl?: string | null;
    imageUrl?: string | null;
  } | null,
): string | null {
  if (!event) return null;

  const templateUrl =
    event.templateUrl ??
    event.certificadoTemplate ??
    event.template ??
    event.template_url ??
    event.urlTemplate ??
    event.templateFileUrl ??
    event.imageUrl ??
    null;

  if (typeof templateUrl !== 'string') return null;

  const normalized = templateUrl.trim();
  return normalized.length > 0 ? normalized : null;
}

export interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}
