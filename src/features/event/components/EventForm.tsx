'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, alpha } from '@mui/material';
import { Toast } from '@/components/ui';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { CERTIFICATE_TEXT_LIMITS } from '@/lib/certificateTextLimits';
import { colorTokens } from '@/lib/colors';
import { useNavigationHistory } from '@/providers/navigation-history-provider';
import { useEventForm } from '../hooks/useEventForm';
import { STATUS_OPTIONS, type EventFormMode, type FormState } from '../utils/eventFormRules';
import { ActivitiesSection } from './event-form/ActivitiesSection';
import { ActivitySheet } from './event-form/ActivitySheet';
import { CertificateSection } from './event-form/CertificateSection';
import { BackPill, EventFormShell, EventFormSkeleton } from './event-form/EventFormShell';
import {
  CharCount,
  Field,
  PillButton,
  SectionTitle,
  SelectControl,
  TextControl,
} from './event-form/FormControls';
import { ImagePickerField } from './event-form/ImagePickerField';

interface EventFormProps {
  mode: EventFormMode;
  eventId?: number;
}

export default function EventForm({ mode, eventId }: EventFormProps) {
  const router = useRouter();
  const { canGoBack } = useNavigationHistory();
  const form = useEventForm(mode, eventId);
  const { isEdit, form: values, errors, updateField, markTouched } = form;

  // Cada abertura da folha de atividade recomeça o formulário dela do zero.
  const [activitySession, setActivitySession] = useState(0);

  const fallbackHref = isEdit && eventId != null ? `/event/${eventId}` : '/home';
  const goBack = () => (canGoBack ? router.back() : router.push(fallbackHref));
  const back = <BackPill onClick={goBack} />;

  if (isEdit && form.loadingEvent) return <EventFormSkeleton back={back} />;

  if (isEdit && form.loadError) {
    return (
      <EventFormShell back={back}>
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
        >
          <Box
            component="p"
            role="alert"
            sx={{ m: 0, fontSize: 15, fontWeight: 600, color: colorTokens.status.error }}
          >
            {form.loadError}
          </Box>
          <Link
            href="/home"
            style={{ fontSize: 14, fontWeight: 700, color: colorTokens.brand.secondary }}
          >
            Voltar ao início
          </Link>
        </Box>
      </EventFormShell>
    );
  }

  type TextOptions = {
    type?: 'text' | 'number' | 'date' | 'time';
    multiline?: boolean;
    inputProps?: Record<string, unknown>;
  };

  const text = (field: keyof FormState, options: TextOptions = {}) =>
    function renderTextControl(id: string) {
      return (
        <TextControl
          id={id}
          value={String(values[field] ?? '')}
          onChange={(value) => updateField(field, value as FormState[typeof field])}
          onBlur={() => markTouched(field)}
          error={!!errors[field as keyof typeof errors]}
          {...options}
        />
      );
    };

  const openNewActivity = () => {
    setActivitySession((session) => session + 1);
    form.handleOpenNewActivity();
  };

  const openEditActivity: typeof form.handleOpenEditActivity = (activity) => {
    setActivitySession((session) => session + 1);
    form.handleOpenEditActivity(activity);
  };

  const canAddActivity = Boolean(
    values.startDate && values.endDate && values.startTime && values.endTime && values.cargaHoraria
  );

  return (
    <EventFormShell back={back}>
      <Box>
        <Box
          component="h1"
          sx={{
            m: '0 0 8px',
            fontSize: { xs: 27, md: 34 },
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            color: colorTokens.text.heading,
          }}
        >
          {isEdit ? 'Editar evento' : 'Cadastrar evento'}
        </Box>
        <Box
          component="p"
          sx={{ m: 0, maxWidth: 560, fontSize: 14.5, color: colorTokens.text.muted }}
        >
          {isEdit
            ? 'Atualize os dados do evento e da programação.'
            : 'Preencha os dados do evento. Você poderá adicionar as atividades da programação em seguida.'}
        </Box>
      </Box>

      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SectionTitle>Dados do evento</SectionTitle>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 2.25,
          }}
        >
          <Field
            label="Nome do evento"
            required
            help="Aparece no certificado, nas listagens e na busca por código."
            aside={
              <CharCount value={values.nome.length} max={CERTIFICATE_TEXT_LIMITS.nomeEvento} />
            }
            error={errors.nome}
            sx={{ gridColumn: '1 / -1' }}
          >
            {text('nome', { inputProps: { maxLength: CERTIFICATE_TEXT_LIMITS.nomeEvento } })}
          </Field>
          <Field
            label="Local"
            required
            help="Endereço geral do evento. Cada atividade pode ter uma sala própria."
            error={errors.localizacao}
          >
            {text('localizacao')}
          </Field>
          <Field
            label="Responsável"
            required
            help="Pessoa ou equipe responsável pelo evento."
            error={errors.responsavel}
          >
            {text('responsavel')}
          </Field>
          <Field
            label="Descrição"
            required
            help="É o texto que o participante lê antes de se inscrever."
            error={errors.descricao}
            sx={{ gridColumn: '1 / -1' }}
          >
            {text('descricao', { multiline: true })}
          </Field>
          <Field
            label="Imagem do evento"
            optional
            hint="JPG, PNG ou WEBP até 3 MB. Proporção 16:9."
            sx={{ gridColumn: '1 / -1' }}
          >
            {(id) => (
              <ImagePickerField
                id={id}
                value={values.foto}
                onChange={(value) => updateField('foto', value)}
                emptyLabel="Nenhuma imagem selecionada"
              />
            )}
          </Field>

          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' },
              gap: { xs: 1.5, md: 2.25 },
            }}
          >
            <Field label="Data de início" required error={errors.startDate}>
              {text('startDate', {
                type: 'date',
                inputProps: { min: isEdit ? undefined : form.startDateMin },
              })}
            </Field>
            <Field label="Hora de início" required error={errors.startTime}>
              {text('startTime', { type: 'time' })}
            </Field>
            <Field label="Data de término" required error={errors.endDate}>
              {text('endDate', {
                type: 'date',
                inputProps: { min: isEdit ? values.startDate || undefined : form.endDateMin },
              })}
            </Field>
            <Field label="Hora de término" required error={errors.endTime}>
              {text('endTime', { type: 'time' })}
            </Field>
          </Box>

          <Field
            label="Carga horária (h)"
            required
            help="Total de horas em números inteiros. É o valor impresso no certificado."
            error={errors.cargaHoraria}
          >
            {text('cargaHoraria', {
              type: 'number',
              inputProps: { min: 0, step: 1, inputMode: 'numeric' },
            })}
          </Field>
          <Field
            label={isEdit ? 'Status' : 'Status inicial'}
            help={
              isEdit ? 'Situação atual do evento.' : 'Definido automaticamente pela data de início.'
            }
          >
            {(id) => (
              <SelectControl
                id={id}
                value={values.status}
                options={STATUS_OPTIONS}
                onChange={(value) => updateField('status', value)}
                disabled={!isEdit}
              />
            )}
          </Field>
        </Box>
      </Box>

      <ActivitiesSection
        activities={form.activities}
        canAdd={canAddActivity}
        canRemove={!form.eventoFinalizado}
        removing={form.removingActivity}
        onAdd={openNewActivity}
        onEdit={openEditActivity}
        onRemove={form.handleRemoveActivity}
      />

      <CertificateSection
        certificate={form.certificate}
        eventName={values.nome}
        workload={values.cargaHoraria}
        ready={form.canSubmit}
        onSaved={() => form.toast.showSuccess('Personalização do certificado salva.')}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          pt: 2.75,
          borderTop: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
        }}
      >
        <Box component="span" sx={{ fontSize: 12.5, color: colorTokens.text.label }}>
          Campos marcados com{' '}
          <Box component="span" sx={{ fontWeight: 700, color: colorTokens.status.error }}>
            *
          </Box>{' '}
          são obrigatórios.
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, width: { xs: '100%', sm: 'auto' } }}>
          <PillButton
            tone="ghost"
            onClick={goBack}
            sx={{ flex: { xs: 1, sm: 'none' }, fontSize: 14.5 }}
          >
            Cancelar
          </PillButton>
          <PillButton
            onClick={() => void form.handleSubmit()}
            busy={form.isSubmitting}
            sx={{ flex: { xs: 1, sm: 'none' }, fontSize: 14.5 }}
          >
            {form.isSubmitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar evento'}
          </PillButton>
        </Box>
      </Box>

      <ActivitySheet
        key={activitySession}
        open={form.drawerOpen}
        editing={!!form.editingActivity}
        initialValues={form.editingActivity ?? undefined}
        eventDateRange={
          values.startDate && values.startTime && values.endDate && values.endTime
            ? {
                start: `${values.startDate}T${values.startTime}`,
                end: `${values.endDate}T${values.endTime}`,
              }
            : undefined
        }
        maxWorkload={values.cargaHoraria ? Number(values.cargaHoraria) : undefined}
        eventLocation={form.activityEventInfo.location}
        onSubmit={form.handleActivitySubmit}
        onClose={form.handleCloseDrawer}
      />

      <ConfirmModal
        open={form.activityToDelete !== null}
        onClose={() => form.setActivityToDelete(null)}
        type="error"
        message="Excluir esta atividade apaga também as presenças já registradas nela. Não há como desfazer."
        emphasisEndText={form.activityToDelete?.name ?? ''}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={form.handleConfirmDeleteActivity}
      />

      <Toast
        open={form.toast.open}
        message={form.toast.message}
        severity={form.toast.severity}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        duration={form.toast.isError ? 8000 : 4000}
        onClose={form.toast.close}
      />
    </EventFormShell>
  );
}
