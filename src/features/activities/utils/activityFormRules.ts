import { getBahiaDateInput, getBahiaTimeInput, toBahiaIso } from '@/utils/date';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActivityFormMode = 'create' | 'edit';

export type ActivityFormVariant = 'page' | 'embedded';

export type ActivityGuest = {
  name: string;
  email: string;
  role: string;
};

export type ActivityFormState = {
  name: string;
  category: string;
  location: string;
  workload: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  guests: ActivityGuest[];
  /** Se marcado, a atividade emitirá certificado individual de participante ao ser finalizada. */
  generateCertificate: boolean;
};

export type TouchedState = Record<
  Exclude<keyof ActivityFormState, 'guests' | 'generateCertificate'>,
  boolean
>;

export type ActivityEventInfo = {
  title: string;
  date: string;
  location: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

// Espelha o enum `categoria_atividade` do back; valor fora dele volta 400.
export const CATEGORY_OPTIONS = [
  { value: 'palestra', label: 'Palestra' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'mesa_redonda', label: 'Mesa Redonda' },
  { value: 'minicurso', label: 'Minicurso' },
  { value: 'curso', label: 'Curso' },
  { value: 'outro', label: 'Outro' },
];

export const GUEST_ROLE_OPTIONS = [
  { value: 'palestrante', label: 'Palestrante' },
  { value: 'ministrante', label: 'Ministrante' },
  { value: 'moderador', label: 'Moderador' },
];

export const EMPTY_FORM: ActivityFormState = {
  name: '',
  category: '',
  location: '',
  workload: '',
  description: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  guests: [],
  generateCertificate: false,
};

export const FALLBACK_EVENT_INFO: ActivityEventInfo = {
  title: 'Título do Evento',
  date: 'dd/mm/yyyy',
  location: 'localização',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function createTouchedState(): TouchedState {
  return {
    name: false,
    category: false,
    location: false,
    workload: false,
    description: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
  };
}

export function getTodayString(): string {
  return getBahiaDateInput(new Date());
}

export function toDateTime(date: string, time: string): string {
  return toBahiaIso(date, time);
}

export function formatDateBR(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function getErrors(
  form: ActivityFormState,
  touched: TouchedState,
  eventDateRange?: { start: string; end: string },
  maxWorkload?: number
) {
  const minDate = eventDateRange ? getBahiaDateInput(eventDateRange.start) : getTodayString();
  const maxDate = eventDateRange ? getBahiaDateInput(eventDateRange.end) : undefined;

  const startDT = toDateTime(form.startDate, form.startTime);
  const endDT = toDateTime(form.endDate, form.endTime);
  return {
    name:
      (touched.name || form.name.length > 0) && form.name.trim().length < 3
        ? 'Informe um nome com pelo menos 3 caracteres.'
        : '',
    category: touched.category && !form.category ? 'Selecione uma categoria.' : '',
    location:
      (touched.location || form.location.length > 0) && form.location.trim().length < 1
        ? 'Informe a localização da atividade.'
        : '',
    workload: (() => {
      if (!touched.workload && !form.workload) return '';
      if (!form.workload.trim()) return 'Informe a carga horária.';
      const num = Number(form.workload);
      if (isNaN(num) || num <= 0) return 'Informe um número válido de horas.';
      if (maxWorkload != null && num > maxWorkload)
        return `A carga horária não pode ultrapassar ${maxWorkload}h (carga do evento).`;
      return '';
    })(),
    description:
      (touched.description || form.description.length > 0) && form.description.trim().length < 10
        ? 'Descreva melhor a atividade (mínimo 10 caracteres).'
        : '',
    startDate: (() => {
      if (touched.startDate && !form.startDate) return 'Selecione a data de início.';
      if (
        (touched.startDate || Boolean(form.startDate)) &&
        form.startDate &&
        form.startDate < minDate
      )
        return `A data de início deve ser a partir de ${formatDateBR(minDate)}.`;
      if (
        (touched.startDate || Boolean(form.startDate)) &&
        form.startDate &&
        maxDate &&
        form.startDate > maxDate
      )
        return `A data de início deve ser até ${formatDateBR(maxDate)}.`;
      return '';
    })(),
    endDate: (() => {
      if (touched.endDate && !form.endDate) return 'Selecione a data de término.';
      const effectiveMin = form.startDate && form.startDate > minDate ? form.startDate : minDate;
      if ((touched.endDate || Boolean(form.endDate)) && form.endDate && form.endDate < effectiveMin)
        return 'A data de término inválida.';
      if (
        (touched.endDate || Boolean(form.endDate)) &&
        form.endDate &&
        maxDate &&
        form.endDate > maxDate
      )
        return `A data de término deve ser até ${formatDateBR(maxDate)}.`;
      return '';
    })(),
    startTime: (() => {
      if (touched.startTime && !form.startTime) return 'Selecione o horário de início.';
      if (
        (touched.startTime || Boolean(form.startTime)) &&
        eventDateRange &&
        startDT &&
        new Date(startDT) < new Date(eventDateRange.start)
      ) {
        const hora = getBahiaTimeInput(eventDateRange.start);
        return `A atividade não pode começar antes das ${hora} (início do evento).`;
      }
      if (
        (touched.startTime || Boolean(form.startTime)) &&
        eventDateRange &&
        startDT &&
        new Date(startDT) > new Date(eventDateRange.end)
      ) {
        return 'O horário de início ultrapassa o término do evento.';
      }
      return '';
    })(),
    endTime: (() => {
      if (touched.endTime && !form.endTime) return 'Selecione o horário de término.';
      if (
        (touched.endTime || Boolean(form.endTime)) &&
        eventDateRange &&
        endDT &&
        new Date(endDT) > new Date(eventDateRange.end)
      ) {
        const hora = getBahiaTimeInput(eventDateRange.end);
        return `A atividade não pode terminar depois das ${hora} (término do evento).`;
      }
      if (
        (touched.endTime || Boolean(form.endTime)) &&
        startDT &&
        endDT &&
        new Date(endDT) < new Date(startDT)
      ) {
        return 'O término não pode ser antes do início.';
      }
      return '';
    })(),
  };
}

export function isFormValid(
  form: ActivityFormState,
  errors: ReturnType<typeof getErrors>,
  eventDateRange?: { start: string; end: string },
  maxWorkload?: number
) {
  const minDate = eventDateRange ? getBahiaDateInput(eventDateRange.start) : getTodayString();
  const maxDate = eventDateRange ? getBahiaDateInput(eventDateRange.end) : undefined;
  const workloadNum = Number(form.workload);

  const startDT = toDateTime(form.startDate, form.startTime);
  const endDT = toDateTime(form.endDate, form.endTime);

  const withinEventRange =
    !eventDateRange ||
    (Boolean(startDT) &&
      Boolean(endDT) &&
      new Date(startDT) >= new Date(eventDateRange.start) &&
      new Date(endDT) <= new Date(eventDateRange.end));
  return (
    Object.values(errors).every((e) => e === '') &&
    form.name.trim().length >= 3 &&
    Boolean(form.category) &&
    form.location.trim().length >= 1 &&
    form.description.trim().length >= 10 &&
    form.startDate.length > 0 &&
    form.endDate.length > 0 &&
    form.startDate >= minDate &&
    (!maxDate || form.startDate <= maxDate) &&
    form.endDate >= form.startDate &&
    (!maxDate || form.endDate <= maxDate) &&
    Boolean(form.startTime) &&
    Boolean(form.endTime) &&
    new Date(endDT) >= new Date(startDT) &&
    withinEventRange &&
    form.workload.trim().length > 0 &&
    !isNaN(workloadNum) &&
    workloadNum > 0 &&
    (maxWorkload == null || workloadNum <= maxWorkload)
  );
}
