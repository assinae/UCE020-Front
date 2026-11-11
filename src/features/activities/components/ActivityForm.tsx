'use client';

import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { BackButton, Button, TextInput } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import RegisterGuestModal from '@/components/modals/register-guest-modal/RegisterGuestModal';
import { toBahiaIso } from '@/utils/date';

import {
  CATEGORY_OPTIONS,
  FALLBACK_EVENT_INFO,
  GUEST_ROLE_OPTIONS,
  getTodayString,
} from '../utils/activityFormRules';
import { useActivityForm } from '../hooks/useActivityForm';
import type {
  ActivityEventInfo,
  ActivityFormMode,
  ActivityFormState,
  ActivityFormVariant,
} from '../utils/activityFormRules';

export type {
  ActivityEventInfo,
  ActivityFormMode,
  ActivityFormState,
  ActivityFormVariant,
  ActivityGuest,
} from '../utils/activityFormRules';

// ─── Component ───────────────────────────────────────────────────────────────

export interface ActivityFormProps {
  mode: ActivityFormMode;
  /** 'page' (padrão) = tela cheia com botão de voltar. 'embedded' = uso dentro de Drawer/Modal. */
  variant?: ActivityFormVariant;
  /** Dados do evento-pai a exibir no card superior. Se omitido, usa um fallback ilustrativo. */
  eventInfo?: ActivityEventInfo;
  /** Valores iniciais (usado em modo de edição, ou para pré-preencher em variant="embedded"). */
  initialValues?: Partial<ActivityFormState>;
  /** Chamado com os dados válidos do formulário. Quem chama decide o que fazer (converter para o DTO, chamar API, etc). */
  eventDateRange?: { start: string; end: string };
  maxWorkload?: number;
  onSubmit?: (data: ActivityFormState) => void;
  /** Chamado ao cancelar/fechar. Em variant="embedded" deve fechar o Drawer/Modal. */
  onCancel?: () => void;
  /** Rota de retorno usada apenas em variant="page". */
  backHref?: string;
}

export default function ActivityForm({
  mode,
  variant = 'page',
  eventInfo,
  eventDateRange,
  maxWorkload,
  initialValues,
  onSubmit,
  onCancel,
  backHref = '/home',
}: ActivityFormProps) {
  const isEdit = mode === 'edit';
  const isEmbedded = variant === 'embedded';

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
    handleOpenEditGuest,
    handleSubmit,
  } = useActivityForm({ initialValues, eventDateRange, maxWorkload, onSubmit });

  const name = isEdit ? 'Edição de Atividade' : 'Cadastrar Atividade';
  const subtitle = isEdit
    ? 'Edite as informações da atividade abaixo'
    : 'Preencha os dados abaixo para cadastrar uma nova atividade';
  const actionLabel = isEdit ? 'Salvar' : 'Cadastrar';
  const displayedEvent = eventInfo ?? FALLBACK_EVENT_INFO;

  const todayStr = getTodayString();
  const startDateMin = eventDateRange?.start || todayStr;
  const startDateMax = eventDateRange?.end;
  const endDateMin =
    form.startDate && form.startDate > startDateMin ? form.startDate : startDateMin;
  const endDateMax = eventDateRange?.end;

  return (
    <Box
      sx={{
        minHeight: isEmbedded ? '100%' : '100dvh',
        height: isEmbedded ? '100%' : 'auto', // ← adicionado
        background: isEmbedded ? 'transparent' : colorTokens.surface.background,
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          px: isEmbedded ? 0 : 2,
          py: isEmbedded ? 0 : 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: isEmbedded ? '100%' : 520,
            background: colorTokens.neutral.white,
            borderRadius: isEmbedded ? 0 : '28px',
            boxShadow: isEmbedded ? 'none' : '0 18px 40px rgba(25, 44, 72, 0.12)',
            px: { xs: 2, sm: isEmbedded ? 2.5 : 3 },
            py: { xs: 2.5, sm: isEmbedded ? 2.5 : 3 },
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* ── Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            {isEmbedded ? (
              <IconButton
                aria-label="Fechar"
                onClick={onCancel}
                sx={{ p: 0.5, color: colorTokens.text.primary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            ) : (
              <BackButton
                fallbackHref={backHref}
                iconVariant="compact"
                sx={{ p: 0.5, color: colorTokens.text.primary }}
              />
            )}

            <Typography
              sx={{
                fontSize: 'clamp(18px, 5vw, 26px)',
                lineHeight: 1.1,
                fontWeight: 800,
                color: colorTokens.text.primary,
              }}
            >
              {name}
            </Typography>

            <Box
              sx={{
                flex: 1,
                height: 1,
                background: colorTokens.neutral.gray300,
                ml: 1,
              }}
            />
          </Box>

          <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500, mb: 2.5 }}>
            {subtitle}
          </Typography>

          {/* ── Event Info Card ── */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              border: `1px solid ${colorTokens.neutral.gray300}`,
              borderRadius: '10px',
              px: 1.5,
              py: 1.25,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: colorTokens.neutral.gray300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 20, color: colorTokens.neutral.gray500 }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: colorTokens.text.primary }}>
                {displayedEvent.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 12, color: colorTokens.neutral.gray500 }}
                />
                <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                  {displayedEvent.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 12, color: colorTokens.neutral.gray500 }} />
                <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                  {displayedEvent.location}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Form ── */}
          <Box sx={{ display: 'grid', gap: 1.75 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: colorTokens.text.primary,
                  mb: 0.75,
                }}
              >
                Dados da Atividade
              </Typography>
              <Divider sx={{ borderColor: colorTokens.neutral.gray300, mb: 1.5 }} />
            </Box>

            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label="Nome da Atividade *"
                  value={form.name}
                  onChange={(value) => updateField('name', value)}
                  onBlur={() => markTouched('name')}
                  error={Boolean(errors.name)}
                  size="small"
                  fullWidth
                />
                {errors.name && (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <FormControl fullWidth size="small" error={Boolean(errors.category)}>
                    <InputLabel sx={{ fontSize: 14, color: colorTokens.neutral.gray500 }}>
                      Categoria *
                    </InputLabel>
                    <Select
                      value={form.category}
                      label="Categoria *"
                      onChange={(e) => updateField('category', e.target.value)}
                      onBlur={() => markTouched('category')}
                      sx={{ borderRadius: '6px' }}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.category && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.category}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Localização *"
                    value={form.location}
                    onChange={(value) => updateField('location', value)}
                    onBlur={() => markTouched('location')}
                    error={Boolean(errors.location)}
                    size="small"
                    fullWidth
                    placeholder="Ex: Sala 01"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <LocationOnOutlinedIcon
                              sx={{ fontSize: 18, color: colorTokens.neutral.gray500 }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  {errors.location && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.location}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label="Descrição da atividade *"
                  value={form.description}
                  onChange={(value) => updateField('description', value)}
                  onBlur={() => markTouched('description')}
                  error={Boolean(errors.description)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={3}
                />
                {errors.description && (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.description}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Data de Início *"
                    value={form.startDate}
                    onChange={(value) => updateField('startDate', value)}
                    onBlur={() => markTouched('startDate')}
                    error={Boolean(errors.startDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        inputProps: {
                          min: startDateMin,
                          ...(startDateMax ? { max: startDateMax } : {}),
                        },
                      },
                    }}
                  />
                  {errors.startDate && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.startDate}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Data de Término *"
                    value={form.endDate}
                    onChange={(value) => updateField('endDate', value)}
                    onBlur={() => markTouched('endDate')}
                    error={Boolean(errors.endDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        inputProps: {
                          min: endDateMin,
                          ...(endDateMax ? { max: endDateMax } : {}),
                        },
                      },
                    }}
                  />
                  {errors.endDate && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.endDate}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Horário de Início *"
                    value={form.startTime}
                    onChange={(value) => updateField('startTime', value)}
                    onBlur={() => markTouched('startTime')}
                    error={Boolean(errors.startTime)}
                    size="small"
                    fullWidth
                    type="time"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  {errors.startTime && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.startTime}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Horário de Término *"
                    value={form.endTime}
                    onChange={(value) => updateField('endTime', value)}
                    onBlur={() => markTouched('endTime')}
                    error={Boolean(errors.endTime)}
                    size="small"
                    fullWidth
                    type="time"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  {errors.endTime && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.endTime}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label="Carga horária (h) *"
                  value={form.workload}
                  onChange={(value) => updateField('workload', value)}
                  onBlur={() => markTouched('workload')}
                  error={Boolean(errors.workload)}
                  size="small"
                  fullWidth
                  type="number"
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                />
                {errors.workload ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.workload}
                  </Typography>
                ) : maxWorkload != null ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: colorTokens.neutral.gray500 }}>
                    Máximo: {maxWorkload}h (carga horária do evento)
                  </Typography>
                ) : null}
              </Box>

              <Box
                sx={{
                  border: `1px solid ${colorTokens.neutral.gray300}`,
                  borderRadius: '10px',
                  px: 1.5,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: colorTokens.text.primary }}
                  >
                    Gerar Certificado da Atividade
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                    Emite certificado individual para quem tiver presença confirmada, após a
                    atividade ser finalizada.
                  </Typography>
                </Box>
                <Switch
                  checked={form.generateCertificate}
                  onChange={(e) => toggleGenerateCertificate(e.target.checked)}
                  slotProps={{ input: { 'aria-label': 'Gerar Certificado da Atividade' } }}
                  sx={{ flexShrink: 0 }}
                />
              </Box>

              {/* ── Convidados ── */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 0.75,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.primary }}
                  >
                    Convidados (opcional)
                  </Typography>

                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => setGuestModalOpen(true)}
                    sx={{
                      minWidth: 0,
                      px: 0,
                      py: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: colorTokens.navigation.default,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: colorTokens.navigation.hover,
                      },
                    }}
                  >
                    + Adicionar convidado
                  </Button>
                </Box>
                <Divider sx={{ borderColor: colorTokens.neutral.gray300, mb: 1.25 }} />

                {form.guests.map((guest, index) => (
                  <Chip
                    key={`${guest.email}-${index}`}
                    icon={<PersonOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                    label={`${guest.name} · ${
                      GUEST_ROLE_OPTIONS.find((r) => r.value === guest.role)?.label ?? guest.role
                    }`}
                    onClick={() => handleOpenEditGuest(index)}
                    onDelete={() => handleRemoveGuest(index)}
                    size="small"
                    sx={{
                      fontSize: 12,
                      cursor: 'pointer',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        textOverflow: 'clip',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                pt: 1.25,
                display: 'flex',
                justifyContent: isEmbedded ? 'flex-end' : 'center',
                gap: 1,
              }}
            >
              {isEmbedded && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onCancel}
                  sx={{
                    minWidth: 100,
                    height: 34,
                    borderRadius: '6px',
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Cancelar
                </Button>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={!canSubmit}
                sx={{
                  minWidth: 118,
                  height: 34,
                  borderRadius: '6px',
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: colorTokens.navigation.default,
                  '&:hover': { backgroundColor: colorTokens.navigation.hover },
                }}
              >
                {actionLabel}
              </Button>
            </Box>
          </Box>
        </Box>
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
        activityLocation={form.location || displayedEvent.location}
        roleOptions={GUEST_ROLE_OPTIONS}
        onSubmit={handleGuestSubmit}
        initialValues={
          editingGuestIndex !== null
            ? {
                fullName: form.guests[editingGuestIndex].name,
                role: form.guests[editingGuestIndex].role,
                email: form.guests[editingGuestIndex].email,
              }
            : undefined
        }
      />
    </Box>
  );
}
