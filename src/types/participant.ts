export type PresenceStatus = 'confirmed' | 'pending';

export type Participant = {
  id: string;
  name: string;
  email?: string;
  presenceStatus: PresenceStatus;
};

export type PresenceFilter = 'all' | PresenceStatus;

export type EventProgress = {
  tipo: 'participante' | 'monitor' | 'organizador';
  cargaHorariaCumprida: number;
  cargaHorariaTotal: number;
  atividadesConcluidas: number;
  totalAtividades: number;
};
