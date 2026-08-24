import { api } from '@/services/api';
import type { Participant } from '@/types/participant';

type ParticipantApiItem = {
  id: string | number;
  name?: string;
  nome?: string;
  email?: string;
  role?: 'participant' | 'monitor' | 'organizer' | string;
  tipo?: 'participant' | 'monitor' | 'organizer' | string;
  presenceStatus?: 'pending' | 'confirmed';
};

type ParticipantsApiResponse =
  | {
      success?: boolean;
      data?: ParticipantApiItem[] | { data?: ParticipantApiItem[] };
    }
  | ParticipantApiItem[];

export async function getParticipantsForActivity(
  eventId: string,
  activityId: string,
): Promise<Participant[]> {
  void eventId;

  const response = await api.get<ParticipantsApiResponse>(
    `/activity/${activityId}/participants`,
  );

  const payload = response.data;

  const rawParticipants = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];

  return rawParticipants.map((participant) => ({
    id: String(participant.id),
    name: participant.name ?? participant.nome ?? '',
    email: participant.email ?? '',
    role:
      participant.role === 'monitor' || participant.tipo === 'monitor'
        ? 'monitor'
        : participant.role === 'organizer' || participant.tipo === 'organizer'
          ? 'organizer'
          : 'participant',
    presenceStatus: participant.presenceStatus ?? 'pending',
  }));
}