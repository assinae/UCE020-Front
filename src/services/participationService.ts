import { api } from './api';

export type TipoParticipante = 'participante' | 'monitor' | 'organizador';
interface ParticipationResponse {
  message: string;
  data: {
    tipo: TipoParticipante;
  };
}

class ParticipationService {
  async subscribe(eventoId: number): Promise<ParticipationResponse> {
    const { data } = await api.post<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );
    return data;
  }

  async unsubscribe(eventoId: number): Promise<ParticipationResponse> {
    const { data } = await api.delete<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );
    return data;
  }

  //Traz o tipo de participação do usuário autenticado naquele evento
  //Ex: 'participante', 'monitor' ou 'organizador'
  async getTipoParticipante(eventoId: number): Promise<TipoParticipante> {
    const { data } = await api.get<ParticipationResponse>(
      `/event/${eventoId}/subscription`,
    );
    //console.log('[debug] data:', data);
    //console.log('[debug] tipo, message,:', data.message, data.tipo);

    return data.data.tipo;
  }
}

export const participationService = new ParticipationService();