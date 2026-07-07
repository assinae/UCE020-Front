import type { Activity } from '@/types/activity';

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
  atividades?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}
