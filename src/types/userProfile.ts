export type UserProfile = {
  id: number;
  name: string;
  email: string;
  password?: string; 
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
};

export type UpdateProfilePayload = Partial<{
  name: string;
  email: string;
  avatarUrl?: string;
}>;

export type ParticipationRole = 'participante' | 'organizador' | 'monitor';

export type UserEventHistoryItem = {
  participacaoId: number;
  eventoId: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  cargaHoraria: number;
  papel: ParticipationRole;
  possuiCertificado: boolean;
};

export type UserActivity = {
  eventosOrganizados: number;
  certificadosRecebidos: number;
  cargaHorariaTotal: number;
  historico: UserEventHistoryItem[];
};

export type UserProfileResponse = {
  data: UserProfile;
  statusCode: number;
};