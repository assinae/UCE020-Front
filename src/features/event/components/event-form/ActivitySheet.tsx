'use client';

import { Box, ButtonBase, Switch, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import RegisterGuestModal from '@/components/modals/register-guest-modal/RegisterGuestModal';
import { useActivityForm } from '@/features/activities/hooks/useActivityForm';
import {
  CATEGORY_OPTIONS,
  GUEST_ROLE_OPTIONS,
  getTodayString,
  type ActivityFormState,
} from '@/features/activities/utils/activityFormRules';
import { colorTokens } from '@/lib/colors';
import { toBahiaIso } from '@/utils/date';
import { Field, SelectControl, TextControl } from './FormControls';
import { FormSheet, SheetActions } from './FormSheet';

interface ActivitySheetProps {
  open: boolean;
  editing: boolean;
  initialValues?: Partial<ActivityFormState>;
  eventDateRange?: { start: string; end: string };
  maxWorkload?: number;
  eventLocation: string;
  onSubmit: (data: ActivityFormState) => void;
  onClose: () => void;
}

export function ActivitySheet({
  open,
  editing,
  initialValues,
  eventDateRange,
  maxWorkload,
  eventLocation,
  onSubmit,
  onClose,
}: ActivitySheetProps) {
  const {
    form,
    errors,
    canSubmit,
    updateField,
    markTouched,
    toggleGenerateCertificate,
    guestModalOpen,
    setGuestModalOpen,
    editingGuestIndex,
    handleGuestSubmit,
    handleRemoveGuest,
    handleOpenNewGuest,
    handleOpenEditGuest,
    handleSubmit,
  } = useActivityForm({ initialValues, eventDateRange, maxWorkload, onSubmit });

  const eventStartDate = eventDateRange?.start.slice(0, 10);
  const eventEndDate = eventDateRange?.end.slice(0, 10);
  const startDateMin = eventStartDate || getTodayString();
  const endDateMin =
    form.startDate && form.startDate > startDateMin ? form.startDate : startDateMin;

  const editingGuest = editingGuestIndex !== null ? form.guests[editingGuestIndex] : undefined;

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      eyebrow="Programação"
      title={editing ? 'Editar atividade' : 'Nova atividade'}
      footer={
        <SheetActions
          submitLabel={editing ? 'Salvar alterações' : 'Salvar atividade'}
          onSubmit={handleSubmit}
          onCancel={onClose}
          disabled={!canSubmit}
        />
      }
    >
      <Field label="Nome da atividade" required error={errors.name}>
        {(id) => (
          <TextControl
            id={id}
            value={form.name}
            onChange={(value) => updateField('name', value)}
            onBlur={() => markTouched('name')}
            placeholder="Ex.: Palestra de abertura"
            error={!!errors.name}
          />
        )}
      </Field>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.75 }}>
        <Field label="Categoria" required error={errors.category}>
          {(id) => (
            <SelectControl
              id={id}
              value={form.category}
              options={CATEGORY_OPTIONS}
              onChange={(value) => updateField('category', value)}
              onBlur={() => markTouched('category')}
              placeholder="Selecione"
              error={!!errors.category}
            />
          )}
        </Field>
        <Field label="Local" required error={errors.location}>
          {(id) => (
            <TextControl
              id={id}
              value={form.location}
              onChange={(value) => updateField('location', value)}
              onBlur={() => markTouched('location')}
              placeholder="Auditório Central"
              error={!!errors.location}
            />
          )}
        </Field>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <Field label="Data de início" required error={errors.startDate}>
          {(id) => (
            <TextControl
              id={id}
              type="date"
              value={form.startDate}
              onChange={(value) => updateField('startDate', value)}
              onBlur={() => markTouched('startDate')}
              error={!!errors.startDate}
              inputProps={{ min: startDateMin, max: eventEndDate }}
            />
          )}
        </Field>
        <Field label="Data de término" required error={errors.endDate}>
          {(id) => (
            <TextControl
              id={id}
              type="date"
              value={form.endDate}
              onChange={(value) => updateField('endDate', value)}
              onBlur={() => markTouched('endDate')}
              error={!!errors.endDate}
              inputProps={{ min: endDateMin, max: eventEndDate }}
            />
          )}
        </Field>
        <Field label="Início" required error={errors.startTime}>
          {(id) => (
            <TextControl
              id={id}
              type="time"
              value={form.startTime}
              onChange={(value) => updateField('startTime', value)}
              onBlur={() => markTouched('startTime')}
              error={!!errors.startTime}
            />
          )}
        </Field>
        <Field label="Término" required error={errors.endTime}>
          {(id) => (
            <TextControl
              id={id}
              type="time"
              value={form.endTime}
              onChange={(value) => updateField('endTime', value)}
              onBlur={() => markTouched('endTime')}
              error={!!errors.endTime}
            />
          )}
        </Field>
      </Box>

      <Field
        label="Carga horária (h)"
        required
        error={errors.workload}
        hint={maxWorkload != null ? `Máximo: ${maxWorkload}h (carga horária do evento)` : undefined}
      >
        {(id) => (
          <TextControl
            id={id}
            type="number"
            value={form.workload}
            onChange={(value) => updateField('workload', value)}
            onBlur={() => markTouched('workload')}
            placeholder="2"
            error={!!errors.workload}
            inputProps={{ min: 0, inputMode: 'numeric' }}
          />
        )}
      </Field>

      <Field label="Descrição" required error={errors.description}>
        {(id) => (
          <TextControl
            id={id}
            multiline
            rows={3}
            value={form.description}
            onChange={(value) => updateField('description', value)}
            onBlur={() => markTouched('description')}
            placeholder="Resumo da atividade"
            error={!!errors.description}
          />
        )}
      </Field>

      <Box
        component="label"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          p: '14px 16px',
          borderRadius: '18px',
          bgcolor: colorTokens.surface.panel,
          border: `1px solid ${alpha(colorTokens.navigation.default, 0.05)}`,
          cursor: 'pointer',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontSize: 14,
              fontWeight: 700,
              color: colorTokens.text.heading,
            }}
          >
            Gerar certificado da atividade
          </Box>
          <Box
            component="span"
            sx={{ display: 'block', mt: '3px', fontSize: 12.5, color: colorTokens.text.muted }}
          >
            Emite certificado para quem tiver presença confirmada, depois que a atividade for
            finalizada.
          </Box>
        </Box>
        <Switch
          checked={form.generateCertificate}
          onChange={(event) => toggleGenerateCertificate(event.target.checked)}
          sx={{
            flexShrink: 0,
            '& .MuiSwitch-switchBase.Mui-checked': { color: colorTokens.brand.secondary },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              bgcolor: colorTokens.brand.secondary,
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Box
            component="span"
            sx={{ fontSize: 12.5, fontWeight: 700, color: colorTokens.text.primary }}
          >
            Convidados
            <Box component="span" sx={{ fontWeight: 500, color: colorTokens.text.label }}>
              {' '}
              · opcional
            </Box>
          </Box>
          <ButtonBase
            onClick={handleOpenNewGuest}
            sx={{
              gap: 0.5,
              px: 1.25,
              py: 0.75,
              mr: -1,
              borderRadius: '999px',
              fontSize: 13,
              fontWeight: 700,
              color: colorTokens.brand.secondary,
              transition: 'background .18s ease',
              '&:hover': { bgcolor: colorTokens.surface.mint },
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Adicionar convidado
          </ButtonBase>
        </Box>
        {form.guests.length === 0 ? (
          <Box component="span" sx={{ fontSize: 12.5, color: colorTokens.text.label }}>
            Palestrantes, ministrantes ou moderadores recebem certificado próprio.
          </Box>
        ) : (
          <Box
            component="ul"
            sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            {form.guests.map((guest, index) => (
              <Box
                component="li"
                key={`${guest.email}-${index}`}
                className="animate-fade-up motion-reduce:animate-none"
                style={{ animationDuration: '0.3s' }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pl: 0.5,
                  borderRadius: '14px',
                  border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
                }}
              >
                <ButtonBase
                  onClick={() => handleOpenEditGuest(index)}
                  aria-label={`Editar convidado ${guest.name}`}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'flex-start',
                    gap: 1.25,
                    p: 1,
                    borderRadius: '12px',
                    textAlign: 'left',
                  }}
                >
                  <PersonOutlineRoundedIcon
                    sx={{ fontSize: 20, color: colorTokens.brand.secondary }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: colorTokens.text.heading,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {guest.name}
                    </Box>
                    <Box
                      component="span"
                      sx={{ display: 'block', fontSize: 12, color: colorTokens.text.label }}
                    >
                      {GUEST_ROLE_OPTIONS.find((role) => role.value === guest.role)?.label ??
                        guest.role}
                    </Box>
                  </Box>
                </ButtonBase>
                <ButtonBase
                  onClick={() => handleRemoveGuest(index)}
                  aria-label={`Remover convidado ${guest.name}`}
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 0.5,
                    flexShrink: 0,
                    borderRadius: '999px',
                    color: colorTokens.text.placeholder,
                    transition: 'background .18s ease, color .18s ease',
                    '&:hover': {
                      bgcolor: colorTokens.surface.dangerSubtle,
                      color: colorTokens.status.error,
                    },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </ButtonBase>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <RegisterGuestModal
        key={`${editingGuestIndex ?? 'new'}-${guestModalOpen}`}
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        activityTitle={form.name || 'Nova atividade'}
        activityDate={
          form.startDate && form.startTime
            ? new Date(toBahiaIso(form.startDate, form.startTime))
            : new Date()
        }
        activityLocation={form.location || eventLocation}
        roleOptions={GUEST_ROLE_OPTIONS}
        onSubmit={handleGuestSubmit}
        initialValues={
          editingGuest
            ? { fullName: editingGuest.name, role: editingGuest.role, email: editingGuest.email }
            : undefined
        }
      />
    </FormSheet>
  );
}
