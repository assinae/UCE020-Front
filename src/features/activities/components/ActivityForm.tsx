'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  Typography,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Button, TextInput } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import RegisterGuestModal from '@/components/modals/register-guest-modal/RegisterGuestModal';

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
};

type TouchedState = Record<Exclude<keyof ActivityFormState, 'guests'>, boolean>;

export type ActivityEventInfo = {
  title: string;
  date: string;
  location: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { value: 'palestra', label: 'Palestra' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'mesa_redonda', label: 'Mesa Redonda' },
  { value: 'minicurso', label: 'Minicurso' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'outro', label: 'Outro' },
];

const GUEST_ROLE_OPTIONS = [
  { value: 'palestrante', label: 'Palestrante' },
  { value: 'ministrante', label: 'Ministrante' },
  { value: 'moderador', label: 'Moderador' },
];

const EMPTY_FORM: ActivityFormState = {
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
};

const FALLBACK_EVENT_INFO: ActivityEventInfo = {
  title: 'Título do Evento',
  date: 'dd/mm/yyyy',
  location: 'localização',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createTouchedState(): TouchedState {
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

function getErrors(form: ActivityFormState, touched: TouchedState) {
  return {
    name:
      touched.name && form.name.trim().length < 3
        ? 'Informe um nome com pelo menos 3 caracteres.'
        : '',
    category: touched.category && !form.category ? 'Selecione uma categoria.' : '',
    location:
      touched.location && form.location.trim().length < 1
        ? 'Informe a localização da atividade.'
        : '',
    workload:
      touched.workload && form.workload !== '' && isNaN(Number(form.workload))
        ? 'Informe um número válido de horas.'
        : '',
    description:
      touched.description && form.description.trim().length < 10
        ? 'Descreva melhor a atividade (mínimo 10 caracteres).'
        : '',
    startDate: touched.startDate && !form.startDate ? 'Selecione a data de início.' : '',
    endDate: touched.endDate && !form.endDate ? 'Selecione a data de término.' : '',
    startTime: touched.startTime && !form.startTime ? 'Selecione o horário de início.' : '',
    endTime: touched.endTime && !form.endTime ? 'Selecione o horário de término.' : '',
  };
}

function isFormValid(form: ActivityFormState, errors: ReturnType<typeof getErrors>) {
  return (
    Object.values(errors).every((e) => e === '') &&
    form.name.trim().length >= 3 &&
    Boolean(form.category) &&
    form.location.trim().length >= 1 &&
    form.description.trim().length >= 10 &&
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    Boolean(form.startTime) &&
    Boolean(form.endTime)
  );
}

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
  initialValues,
  onSubmit,
  onCancel,
  backHref = '/home',
}: ActivityFormProps) {
  const isEdit = mode === 'edit';
  const isEmbedded = variant === 'embedded';

  const [form, setForm] = useState<ActivityFormState>({
    ...EMPTY_FORM,
    ...initialValues,
    guests: initialValues?.guests ?? [],
  });
  const [touched, setTouched] = useState<TouchedState>(createTouchedState);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuestIndex, setEditingGuestIndex] = useState<number | null>(null);

  const errors = useMemo(() => getErrors(form, touched), [form, touched]);
  const canSubmit = isFormValid(form, errors);

  const name = isEdit ? 'Edição de Atividade' : 'Cadastrar Atividade';
  const subtitle = isEdit
    ? 'Edite as informações da atividade abaixo'
    : 'Preencha os dados abaixo para cadastrar uma nova atividade';
  const actionLabel = isEdit ? 'Salvar' : 'Cadastrar';
  const displayedEvent = eventInfo ?? FALLBACK_EVENT_INFO;

  function updateField(field: Exclude<keyof ActivityFormState, 'guests'>, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: Exclude<keyof ActivityFormState, 'guests'>) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleGuestSubmit(payload: { fullName: string; role: string; email: string }) {
    const guestData = { name: payload.fullName, email: payload.email, role: payload.role };

    setForm((cur) => {
      if (editingGuestIndex !== null) {
        // edição: substitui no índice correto
        const next = [...cur.guests];
        next[editingGuestIndex] = guestData;
        return { ...cur, guests: next };
      }
      // criação: adiciona no final
      return { ...cur, guests: [...cur.guests, guestData] };
    });

    setEditingGuestIndex(null);
  }

  function handleRemoveGuest(index: number) {
    setForm((cur) => ({ ...cur, guests: cur.guests.filter((_, i) => i !== index) }));
  }

  function handleOpenEditGuest(index: number) {
    setEditingGuestIndex(index);
    setGuestModalOpen(true);
  }

  function handleCloseGuestModal() {
    setGuestModalOpen(false);
    setEditingGuestIndex(null);
  }

  function handleSubmit() {
    const allTouched = createTouchedState();
    (Object.keys(allTouched) as (keyof TouchedState)[]).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const currentErrors = getErrors(form, allTouched);
    if (!isFormValid(form, currentErrors)) return;

    onSubmit?.(form);
  }

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
              <IconButton
                component={Link}
                href={backHref}
                aria-label="Voltar"
                sx={{ p: 0.5, color: colorTokens.text.primary }}
              >
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
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
                  label="Nome da Atividade"
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
                      Categoria
                    </InputLabel>
                    <Select
                      value={form.category}
                      label="Categoria"
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
                    label="Localização"
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
                  label="Carga horária (opcional)"
                  value={form.workload}
                  onChange={(value) => updateField('workload', value)}
                  onBlur={() => markTouched('workload')}
                  error={Boolean(errors.workload)}
                  size="small"
                  fullWidth
                  type="number"
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                />
                {errors.workload && (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.workload}
                  </Typography>
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label="Descrição da atividade"
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
                    label="Data de Início"
                    value={form.startDate}
                    onChange={(value) => updateField('startDate', value)}
                    onBlur={() => markTouched('startDate')}
                    error={Boolean(errors.startDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  {errors.startDate && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.startDate}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Data de Término"
                    value={form.endDate}
                    onChange={(value) => updateField('endDate', value)}
                    onBlur={() => markTouched('endDate')}
                    error={Boolean(errors.endDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  {errors.endDate && (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.endDate}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label="Horário de Início"
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
                    label="Horário de Término"
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
                    sx={{ fontSize: 12, cursor: 'pointer' }}
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
        key={editingGuestIndex ?? 'new'}
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        activityTitle={form.name || 'Nova atividade'}
        activityDate={
          form.startDate && form.startTime
            ? new Date(`${form.startDate}T${form.startTime}:00`)
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
