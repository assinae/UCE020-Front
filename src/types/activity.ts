export type ActivityModalVariant = 'signup' | 'manage' | 'monitor' | 'organizer';
export type DateLike = string | Date;
export type AsyncVoidHandler = () => void | Promise<void>;

export interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  startDate: DateLike;
  endDate?: DateLike;
  location: string;
  hours: number;
  participantsCount: number;
  status: string;
  description: string;
  variant: ActivityModalVariant;
  /** Quando o participante já teve a presença confirmada nesta atividade. */
  presenceConfirmed?: boolean;
  /** Quando a atividade está configurada para emitir certificado individual (campo `gerarCertificado`). */
  generateCertificate?: boolean;
  onSignup?: AsyncVoidHandler;
  onCancelParticipation?: AsyncVoidHandler;
  onMarkPresence?: AsyncVoidHandler;
  onValidatePresences?: AsyncVoidHandler;
  onListParticipants?: AsyncVoidHandler;
  onGenerateCertificates?: AsyncVoidHandler;
  isLoading?: boolean;
  isGeneratingCertificates?: boolean;
}

export interface ActivityDetailProps {
  title: string;
  location: string;
  date: DateLike;
}

export type Activity = {
  id: string;
  name: string;
  category: string;
  location: string;
  workload: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  guests?: ActivityGuest[];
  createdAt?: string;
  updatedAt?: string;
  photo?: string | null;
  /** Define se a atividade emite certificado individual de participante. */
  generateCertificate?: boolean;
}

export type ActivityGuest = {
  name: string;
  email: string;
  role: string;
}

/**
 * Lê a flag de "gerar certificado da atividade" de um objeto vindo da API, aceitando
 * tanto o nome do DTO de entrada (`generateCertificate`) quanto o nome da coluna que
 * volta nas respostas de leitura (`gerarCertificado`). Ver relatório do backend em
 * feature/certificado-por-atividade.
 */
export function readGenerateCertificateFlag(source: unknown): boolean {
  if (!source || typeof source !== 'object') return false;
  const record = source as Record<string, unknown>;
  const raw = record.gerarCertificado ?? record.generateCertificate;

  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw !== 0;
  if (typeof raw === 'string') return ['true', '1'].includes(raw.trim().toLowerCase());

  return false;
};
