export type PresenceStatus = 'confirmed' | 'pending';

export type Participant = {
  id: string;
  name: string;
  presenceStatus: PresenceStatus;
};

export type PresenceFilter = 'all' | PresenceStatus;
