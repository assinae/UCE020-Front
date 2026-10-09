'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCreateEvent } from '@/features/evento/hooks/useCreateEvent';
import { useEditEvent } from '@/features/evento/hooks/useEditEvent';
import type { ActivityFormState } from '@/features/activities/components/ActivityForm';
import { CERTIFICATE_TEXT_LIMITS } from '@/lib/certificateTextLimits';
import { eventService, type CertificateCustomizationDraftPayload } from '@/services/eventService';
import { Activity, ActivityGuest } from '@/types';
import { readGenerateCertificateFlag } from '@/types/activity';
import { resolveCertificateTemplateUrl } from '@/types/event';
import { ToastSeverity } from '@/types/toast';
import { extractApiErrorMessage } from '@/utils/apiError';
import { getBahiaDateInput, getBahiaTimeInput } from '@/utils/date';
import {
  DEFAULT_CERTIFICATE_CUSTOMIZATION,
  DEFAULT_FORM,
  createTouchedState,
  formatDateBR,
  getErrors,
  getTodayString,
  toISODateTime,
  type ActivityItem,
  type CertificateCustomizationState,
  type EventFormMode,
  type FormState,
  type TouchedState,
} from '../utils/eventFormRules';

export function useEventForm(mode: EventFormMode, eventId?: number) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [touched, setTouched] = useState<TouchedState>(createTouchedState);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [showCertificateCustomization, setShowCertificateCustomization] = useState(false);
  const [certificateCustomization, setCertificateCustomization] =
    useState<CertificateCustomizationState>(DEFAULT_CERTIFICATE_CUSTOMIZATION);
  const [certificateCustomizationBeforeEdit, setCertificateCustomizationBeforeEdit] =
    useState<CertificateCustomizationState>(DEFAULT_CERTIFICATE_CUSTOMIZATION);
  const [certificateCustomizationSaved, setCertificateCustomizationSaved] = useState(false);
  const [savedBeforeEdit, setSavedBeforeEdit] = useState(false);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null);
  const [certificateCustomizationLoading, setCertificateCustomizationLoading] = useState(false);
  const [certificatePreviewLoading, setCertificatePreviewLoading] = useState(false);
  const [certificateCustomizationError, setCertificateCustomizationError] = useState('');
  const certificateCustomizationRequestRef = useRef(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  const {
    handleCreate,
    savedActivityId: savedOnCreate,
    removeActivity: removeCreatedActivity,
    loading: createLoading,
    error: createError,
  } = useCreateEvent();
  const {
    event: existingEvent,
    loadingEvent,
    loadError,
    handleUpdate,
    savedActivityId: savedOnEdit,
    removeActivity: removeEditedActivity,
    loading: updateLoading,
    removingActivity,
    error: updateError,
  } = useEditEvent(isEdit && eventId != null ? eventId : null);

  const isSubmitting = createLoading || updateLoading;
  const submitError = createError || updateError;

  // Guarda qual erro já foi dispensado, para o toast não reabrir a cada render
  // sem precisar de um effect só para sincronizar o estado de aberto.
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errorToastOpen = !!submitError && submitError !== dismissedError;
  const toastOpen = errorToastOpen || successMessage !== null;
  const toastMessage = errorToastOpen ? (submitError ?? '') : (successMessage ?? '');
  const toastSeverity = errorToastOpen ? ToastSeverity.Error : ToastSeverity.Success;

  // Atividade já salva aguardando confirmação de exclusão. A exclusão acontece
  // na hora, não no salvamento: o cascade do banco leva as presenças junto e
  // deixar isso pendente na tela esconderia o que o banco realmente tem.
  const [activityToDelete, setActivityToDelete] = useState<ActivityItem | null>(null);

  // O servidor recusa excluir atividade de evento finalizado; esconder a
  // lixeira evita oferecer uma ação que nunca vai passar. Vale o status salvo,
  // não o do formulário, porque é ele que o servidor consulta.
  const eventoFinalizado = existingEvent?.status === 'finalizada';
  const todayStr = getTodayString();
  const startDateMin = todayStr;
  const endDateMin = form.startDate && form.startDate > todayStr ? form.startDate : todayStr;

  useEffect(() => {
    if (!existingEvent) return;

    Promise.resolve().then(() => {
      const startDT = existingEvent.dataInicio ? new Date(existingEvent.dataInicio) : null;
      const endDT = existingEvent.dataFim ? new Date(existingEvent.dataFim) : null;

      const toDate = (dt: Date | null) => (dt ? getBahiaDateInput(dt) : '');
      const toTime = (dt: Date | null) => (dt ? getBahiaTimeInput(dt) : '');

      const savedCustomization =
        existingEvent.certificadoPersonalizacao ?? existingEvent.certificateCustomization;
      const templateUrl =
        savedCustomization?.templateUrl ??
        savedCustomization?.template ??
        resolveCertificateTemplateUrl(existingEvent);
      const savedTexts = savedCustomization?.textos ?? {};

      setForm({
        nome: existingEvent.nome ?? '',
        localizacao: existingEvent.localizacao ?? '',
        responsavel: existingEvent.responsavel ?? '',
        descricao: existingEvent.descricao ?? '',
        startDate: toDate(startDT),
        endDate: toDate(endDT),
        startTime: toTime(startDT),
        endTime: toTime(endDT),
        cargaHoraria: String(existingEvent.cargaHoraria ?? ''),
        status: (existingEvent.status as FormState['status']) ?? 'pendente',
        foto: existingEvent.foto ?? null,
        certificadoTemplate: templateUrl,
      });

      setCertificateCustomization({
        template: savedCustomization?.template ?? savedCustomization?.templateUrl ?? templateUrl,
        titulo: savedTexts.titulo ?? '',
        subtitulo: savedTexts.subtitulo ?? '',
        descricaoInicio: savedTexts.descricaoInicio ?? '',
        descricaoEvento: savedTexts.descricaoEvento ?? '',
        descricaoCargaHoraria: savedTexts.descricaoCargaHoraria ?? '',
      });

      if (Array.isArray(existingEvent.atividades)) {
        setActivities(
          existingEvent.atividades.map((a: Activity) => ({
            id: String(a.id),
            name: a.name ?? '',
            category: a.category ?? '',
            guests: a.guests
              ? a.guests.map((g: ActivityGuest) => ({
                  name: g.name ?? '',
                  email: g.email ?? '',
                  role: g.role ?? '',
                }))
              : [],
            location: a.location ?? '',
            workload: String(a.workload ?? ''),
            description: a.description ?? '',
            startDate: toDate(a.startDate ? new Date(a.startDate) : null),
            endDate: toDate(a.endDate ? new Date(a.endDate) : null),
            startTime: toTime(a.startDate ? new Date(a.startDate) : null),
            endTime: toTime(a.endDate ? new Date(a.endDate) : null),
            generateCertificate: readGenerateCertificateFlag(a),
          }))
        );
      }
    });
  }, [existingEvent]);

  useEffect(() => {
    return () => {
      if (certificatePreviewUrl) URL.revokeObjectURL(certificatePreviewUrl);
    };
  }, [certificatePreviewUrl]);

  const errors = useMemo(() => getErrors(form, touched, isEdit), [form, touched, isEdit]);
  const canSubmit =
    Object.values(errors).every((e) => e === '') &&
    form.nome.length <= CERTIFICATE_TEXT_LIMITS.nomeEvento &&
    certificateCustomization.titulo.length <= CERTIFICATE_TEXT_LIMITS.titulo &&
    certificateCustomization.subtitulo.length <= CERTIFICATE_TEXT_LIMITS.subtitulo &&
    certificateCustomization.descricaoInicio.length +
      certificateCustomization.descricaoEvento.length +
      certificateCustomization.descricaoCargaHoraria.length <=
      CERTIFICATE_TEXT_LIMITS.descricaoTotal &&
    form.nome.trim().length >= 3 &&
    form.localizacao.trim().length >= 3 &&
    form.responsavel.trim().length >= 3 &&
    form.descricao.trim().length >= 10 &&
    form.startDate.length > 0 &&
    form.endDate.length > 0 &&
    (!isEdit ? form.startDate >= getTodayString() : true) &&
    form.endDate >= form.startDate &&
    form.startTime.length > 0 &&
    form.endTime.length > 0 &&
    form.cargaHoraria.trim().length > 0 &&
    Number(form.cargaHoraria) >= 0;

  const activityEventInfo = {
    title: form.nome || 'Novo evento',
    date: form.startDate ? formatDateBR(form.startDate) : 'dd/mm/yyyy',
    location: form.localizacao || 'localização',
  };

  const certificateDescriptionPreview = [
    certificateCustomization.descricaoInicio,
    form.nome,
    certificateCustomization.descricaoEvento,
    form.cargaHoraria ? `${form.cargaHoraria} h` : '',
    certificateCustomization.descricaoCargaHoraria,
  ]
    .filter((part) => part.trim().length > 0)
    .join(' ');

  const certificateDescriptionLength =
    certificateCustomization.descricaoInicio.length +
    certificateCustomization.descricaoEvento.length +
    certificateCustomization.descricaoCargaHoraria.length;
  const certificateTextError =
    form.nome.length > CERTIFICATE_TEXT_LIMITS.nomeEvento
      ? `O nome do evento deve ter no máximo ${CERTIFICATE_TEXT_LIMITS.nomeEvento} caracteres.`
      : certificateCustomization.titulo.length > CERTIFICATE_TEXT_LIMITS.titulo
        ? `O título deve ter no máximo ${CERTIFICATE_TEXT_LIMITS.titulo} caracteres.`
        : certificateCustomization.subtitulo.length > CERTIFICATE_TEXT_LIMITS.subtitulo
          ? `O subtítulo deve ter no máximo ${CERTIFICATE_TEXT_LIMITS.subtitulo} caracteres.`
          : certificateDescriptionLength > CERTIFICATE_TEXT_LIMITS.descricaoTotal
            ? `A descrição deve ter no máximo ${CERTIFICATE_TEXT_LIMITS.descricaoTotal} caracteres no total.`
            : '';

  function buildCertificateCustomizationPayload(
    customization: CertificateCustomizationState = certificateCustomization
  ): CertificateCustomizationDraftPayload {
    return {
      evento: {
        nome: form.nome,
        descricao: form.descricao,
        localizacao: form.localizacao,
        responsavel: form.responsavel,
        cargaHoraria: Number(form.cargaHoraria) || 0,
        dataInicio: toISODateTime(form.startDate, form.startTime),
        dataFim: toISODateTime(form.endDate, form.endTime),
        status: form.status,
      },
      template: customization.template,
      textos: {
        titulo: customization.titulo,
        subtitulo: customization.subtitulo,
        descricaoInicio: customization.descricaoInicio,
        descricaoEvento: customization.descricaoEvento,
        descricaoCargaHoraria: customization.descricaoCargaHoraria,
      },
    };
  }

  function updateCertificateCustomization<K extends keyof CertificateCustomizationState>(
    field: K,
    value: CertificateCustomizationState[K]
  ) {
    setCertificateCustomization((cur) => ({ ...cur, [field]: value }));
    setCertificateCustomizationSaved(false);
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((cur) => {
      const next = { ...cur, [field]: value };
      if (!isEdit && field === 'startDate' && typeof value === 'string') {
        const today = getTodayString();
        next.status = value === today ? 'iniciada' : 'pendente';
      }
      return next;
    });
  }

  function markTouched(field: keyof FormState) {
    setTouched((cur) => ({ ...cur, [field]: true }));
  }

  async function handleOpenCertificateCustomization() {
    const requestId = ++certificateCustomizationRequestRef.current;
    setCertificateCustomizationBeforeEdit(certificateCustomization);
    setSavedBeforeEdit(certificateCustomizationSaved);
    setShowCertificateCustomization(true);
    setCertificateCustomizationError('');
    setCertificateCustomizationLoading(true);

    try {
      let customization = certificateCustomization;

      if (!isEdit) {
        const textos = await eventService.getDefaultCertificateTexts(form.nome);
        if (requestId !== certificateCustomizationRequestRef.current) return;

        customization = {
          ...certificateCustomization,
          titulo: textos.titulo ?? '',
          subtitulo: textos.subtitulo ?? form.nome,
          descricaoInicio: textos.descricaoInicio ?? '',
          descricaoEvento: textos.descricaoEvento ?? '',
          descricaoCargaHoraria: textos.descricaoCargaHoraria ?? '',
        };
        setCertificateCustomization(customization);
      } else if (!existingEvent?.certificadoPersonalizacao) {
        const defaultCustomization = await eventService.getDefaultCertificateCustomization(
          buildCertificateCustomizationPayload()
        );
        if (requestId !== certificateCustomizationRequestRef.current) return;

        const textos = defaultCustomization.textos ?? {};
        customization = {
          ...certificateCustomization,
          template: defaultCustomization.templateUrl ?? certificateCustomization.template,
          titulo: certificateCustomization.titulo || textos.titulo || '',
          subtitulo: certificateCustomization.subtitulo || textos.subtitulo || '',
          descricaoInicio: certificateCustomization.descricaoInicio || textos.descricaoInicio || '',
          descricaoEvento: certificateCustomization.descricaoEvento || textos.descricaoEvento || '',
          descricaoCargaHoraria:
            certificateCustomization.descricaoCargaHoraria || textos.descricaoCargaHoraria || '',
        };
        setCertificateCustomization(() => customization);
      }

      const previewPdf = await eventService.previewCertificateCustomization(
        buildCertificateCustomizationPayload(customization)
      );
      if (requestId !== certificateCustomizationRequestRef.current) return;

      setCertificatePreviewUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return URL.createObjectURL(previewPdf);
      });
    } catch (error) {
      if (requestId !== certificateCustomizationRequestRef.current) return;

      setCertificateCustomizationError(
        extractApiErrorMessage(error, 'Não foi possível carregar o certificado padrão.')
      );
    } finally {
      if (requestId === certificateCustomizationRequestRef.current) {
        setCertificateCustomizationLoading(false);
      }
    }
  }

  async function handlePreviewCertificateCustomization() {
    const requestId = ++certificateCustomizationRequestRef.current;
    setCertificateCustomizationError('');
    setCertificatePreviewLoading(true);

    try {
      const previewPdf = await eventService.previewCertificateCustomization(
        buildCertificateCustomizationPayload()
      );
      if (requestId !== certificateCustomizationRequestRef.current) return;

      setCertificatePreviewUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return URL.createObjectURL(previewPdf);
      });
    } catch (error) {
      if (requestId !== certificateCustomizationRequestRef.current) return;

      setCertificateCustomizationError(
        extractApiErrorMessage(error, 'Não foi possível gerar a pré-visualização.')
      );
    } finally {
      if (requestId === certificateCustomizationRequestRef.current) {
        setCertificatePreviewLoading(false);
      }
    }
  }

  function handleSaveCertificateCustomization() {
    setCertificateCustomizationSaved(true);
    setCertificateCustomizationError('');
  }

  // Reabrir a edição já aberta (folha do celular) sem recarregar os textos padrão.
  function handleResumeCertificateCustomization() {
    setCertificateCustomizationBeforeEdit(certificateCustomization);
    setSavedBeforeEdit(certificateCustomizationSaved);
    setCertificateCustomizationError('');
  }

  // Desfaz só o que mudou desde a última abertura; uma personalização já salva continua valendo.
  function handleDiscardCertificateChanges() {
    if (!savedBeforeEdit) {
      handleCancelCertificateCustomization();
      return;
    }
    certificateCustomizationRequestRef.current += 1;
    setCertificateCustomization(certificateCustomizationBeforeEdit);
    setCertificateCustomizationSaved(true);
    setCertificateCustomizationError('');
  }

  function handleCancelCertificateCustomization() {
    certificateCustomizationRequestRef.current += 1;
    setCertificateCustomization(certificateCustomizationBeforeEdit);
    setCertificateCustomizationSaved(false);
    setCertificateCustomizationError('');
    setShowCertificateCustomization(false);
    setCertificatePreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return null;
    });
  }

  async function handleSubmit() {
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true])) as TouchedState;
    setTouched(allTouched);

    const currentErrors = getErrors(form, allTouched, isEdit);
    const isValid =
      Object.values(currentErrors).every((e) => e === '') &&
      form.nome.trim().length >= 3 &&
      form.localizacao.trim().length >= 3 &&
      form.responsavel.trim().length >= 3 &&
      form.descricao.trim().length >= 10 &&
      form.startDate.length > 0 &&
      form.endDate.length > 0 &&
      form.endDate >= form.startDate &&
      form.startTime.length > 0 &&
      form.endTime.length > 0 &&
      form.cargaHoraria.trim().length > 0 &&
      Number(form.cargaHoraria) >= 0;

    if (!isValid) return;
    if (certificateTextError) return;

    await submitForm();
  }

  async function submitForm() {
    const payload = {
      nome: form.nome,
      localizacao: form.localizacao,
      responsavel: form.responsavel,
      descricao: form.descricao,
      dataInicio: toISODateTime(form.startDate, form.startTime),
      dataFim: toISODateTime(form.endDate, form.endTime),
      cargaHoraria: Number(form.cargaHoraria),
      status: form.status,
      foto: form.foto === null ? null : form.foto.startsWith('data:') ? form.foto : undefined,
      ...(certificateCustomizationSaved
        ? {
            certificadoPersonalizacao: {
              template: certificateCustomization.template,
              textos: {
                titulo: certificateCustomization.titulo,
                subtitulo: certificateCustomization.subtitulo,
                descricaoInicio: certificateCustomization.descricaoInicio,
                descricaoEvento: certificateCustomization.descricaoEvento,
                descricaoCargaHoraria: certificateCustomization.descricaoCargaHoraria,
              },
            },
          }
        : {}),
      atividades: activities.map(({ id, ...activity }) => {
        const backendId = Number(id);
        const isExistingActivity = isEdit && !Number.isNaN(backendId);

        return {
          id: isExistingActivity ? backendId : undefined,
          clientKey: id,
          name: activity.name,
          category: activity.category,
          guests: activity.guests,
          location: activity.location,
          workload: Number(activity.workload) || 0,
          description: activity.description,
          eventId: isEdit && existingEvent ? existingEvent.id : undefined,
          startDate: toISODateTime(activity.startDate, activity.startTime),
          endDate: toISODateTime(activity.endDate, activity.endTime),
          generateCertificate: activity.generateCertificate,
        };
      }),
    };

    if (isEdit) {
      await handleUpdate(payload);
    } else {
      await handleCreate(payload);
    }
  }

  // ── Handlers do drawer de atividade ──

  function handleOpenNewActivity() {
    setEditingActivity(null);
    setDrawerOpen(true);
  }

  function handleOpenEditActivity(activity: ActivityItem) {
    setEditingActivity(activity);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setEditingActivity(null);
  }

  function handleActivitySubmit(data: ActivityFormState) {
    if (editingActivity) {
      setActivities((cur) =>
        cur.map((a) => (a.id === editingActivity.id ? { ...data, id: a.id } : a))
      );
    } else {
      setActivities((cur) => [...cur, { ...data, id: crypto.randomUUID() }]);
    }
    handleCloseDrawer();
  }

  // Id no servidor: o da atividade carregada na edição ou o de uma atividade
  // nova que já foi gravada num envio que falhou em outra.
  function backendIdOf(item: ActivityItem): number | undefined {
    const numericId = Number(item.id);
    if (isEdit && !Number.isNaN(numericId)) return numericId;
    return isEdit ? savedOnEdit(item.id) : savedOnCreate(item.id);
  }

  function handleRemoveActivity(id: string) {
    const item = activities.find((a) => a.id === id);
    // Atividade que só existe no formulário sai da lista sem servidor e sem confirmação.
    if (!item || backendIdOf(item) === undefined) {
      setActivities((cur) => cur.filter((a) => a.id !== id));
      return;
    }
    setActivityToDelete(item);
  }

  async function handleConfirmDeleteActivity() {
    if (!activityToDelete) return;
    const backendId = backendIdOf(activityToDelete);
    const { id, name } = activityToDelete;
    setActivityToDelete(null);
    if (backendId === undefined) return;

    const removed = isEdit
      ? await removeEditedActivity(backendId)
      : await removeCreatedActivity(backendId);
    if (removed) {
      setActivities((cur) => cur.filter((a) => a.id !== id));
      setSuccessMessage(`Atividade "${name}" excluída.`);
    }
  }

  return {
    isEdit,
    form,
    errors,
    canSubmit,
    updateField,
    markTouched,
    todayStr,
    startDateMin,
    endDateMin,
    existingEvent,
    loadingEvent,
    loadError,
    eventoFinalizado,
    isSubmitting,
    handleSubmit,
    toast: {
      open: toastOpen,
      message: toastMessage,
      severity: toastSeverity,
      isError: errorToastOpen,
      close: () => (errorToastOpen ? setDismissedError(submitError) : setSuccessMessage(null)),
      showSuccess: setSuccessMessage,
    },
    activities,
    activityEventInfo,
    drawerOpen,
    editingActivity,
    handleOpenNewActivity,
    handleOpenEditActivity,
    handleCloseDrawer,
    handleActivitySubmit,
    handleRemoveActivity,
    activityToDelete,
    setActivityToDelete,
    handleConfirmDeleteActivity,
    removingActivity,
    certificate: {
      open: showCertificateCustomization,
      values: certificateCustomization,
      update: updateCertificateCustomization,
      saved: certificateCustomizationSaved,
      previewUrl: certificatePreviewUrl,
      loading: certificateCustomizationLoading,
      previewLoading: certificatePreviewLoading,
      error: certificateCustomizationError,
      textError: certificateTextError,
      descriptionPreview: certificateDescriptionPreview,
      descriptionLength: certificateDescriptionLength,
      openEditor: handleOpenCertificateCustomization,
      refreshPreview: handlePreviewCertificateCustomization,
      save: handleSaveCertificateCustomization,
      cancel: handleCancelCertificateCustomization,
      resume: handleResumeCertificateCustomization,
      discard: handleDiscardCertificateChanges,
    },
  };
}

export type EventFormCertificate = ReturnType<typeof useEventForm>['certificate'];
