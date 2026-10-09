import type { ActivityFormState } from '@/features/activities/components/ActivityForm';
import { getBahiaDateInput, toBahiaIso } from '@/utils/date';

export type EventFormMode = 'create' | 'edit';

export type ActivityItem = ActivityFormState & { id: string };

export type FormState = {
  nome: string;
  localizacao: string;
  responsavel: string;
  descricao: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  cargaHoraria: string;
  status: 'pendente' | 'iniciada' | 'andamento' | 'finalizada';
  foto: string | null;
  certificadoTemplate: string | null;
};

export type CertificateCustomizationState = {
  template: string | null;
  titulo: string;
  subtitulo: string;
  descricaoInicio: string;
  descricaoEvento: string;
  descricaoCargaHoraria: string;
};

export type TouchedState = Record<keyof FormState, boolean>;

export const STATUS_OPTIONS: { value: FormState['status']; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'iniciada', label: 'Iniciado' },
  { value: 'andamento', label: 'Em andamento' },
  { value: 'finalizada', label: 'Finalizado' },
];

export const DEFAULT_FORM: FormState = {
  nome: '',
  localizacao: '',
  responsavel: '',
  descricao: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  cargaHoraria: '',
  status: 'pendente',
  foto: null,
  certificadoTemplate: null,
};

export const DEFAULT_CERTIFICATE_CUSTOMIZATION: CertificateCustomizationState = {
  template: null,
  titulo: '',
  subtitulo: '',
  descricaoInicio: '',
  descricaoEvento: '',
  descricaoCargaHoraria: '',
};

export function createTouchedState(): TouchedState {
  return {
    nome: false,
    localizacao: false,
    responsavel: false,
    descricao: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    cargaHoraria: false,
    status: false,
    foto: false,
    certificadoTemplate: false,
  };
}

export function getErrors(form: FormState, touched: TouchedState, isEdit: boolean) {
  return {
    nome:
      (touched.nome || form.nome.length > 0) && form.nome.trim().length < 3
        ? 'Informe um nome com pelo menos 3 caracteres.'
        : '',
    localizacao:
      (touched.localizacao || form.localizacao.length > 0) && form.localizacao.trim().length < 3
        ? 'Informe o local do evento.'
        : '',
    responsavel:
      (touched.responsavel || form.responsavel.length > 0) && form.responsavel.trim().length < 3
        ? 'Informe o responsável.'
        : '',
    descricao:
      (touched.descricao || form.descricao.length > 0) && form.descricao.trim().length < 10
        ? 'Descreva melhor o evento (mínimo 10 caracteres).'
        : '',
    startDate: (() => {
      if (touched.startDate && !form.startDate) return 'Selecione a data de início.';
      if (
        !isEdit &&
        (touched.startDate || Boolean(form.startDate)) &&
        form.startDate &&
        form.startDate < getTodayString()
      )
        return 'A data de início não pode ser no passado.';
      return '';
    })(),
    endDate: (() => {
      if (touched.endDate && !form.endDate) return 'Selecione a data de término.';
      if (!isEdit) {
        const todayStr = getTodayString();
        const minEndDate = form.startDate && form.startDate > todayStr ? form.startDate : todayStr;
        if ((touched.endDate || Boolean(form.endDate)) && form.endDate && form.endDate < minEndDate)
          return 'A data de término inválida.';
      }
      return '';
    })(),
    startTime: touched.startTime && !form.startTime ? 'Selecione o horário de início.' : '',
    endTime: touched.endTime && !form.endTime ? 'Selecione o horário de término.' : '',
    cargaHoraria:
      touched.cargaHoraria && (!form.cargaHoraria || Number(form.cargaHoraria) < 0)
        ? 'Informe a carga horária.'
        : '',
    status: '',
    foto: '',
  };
}

export function toISODateTime(date: string, time: string): string {
  return toBahiaIso(date, time);
}

export function getTodayString(): string {
  return getBahiaDateInput(new Date());
}

export function formatDateBR(iso: string): string {
  if (!iso) return '--/--/----';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
