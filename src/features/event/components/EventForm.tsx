'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Button, TextInput, PageLoader } from '@/components/ui';
import { ImageUpload } from '@/components/ui/inputs';
import { colorTokens } from '@/lib/colors';
import { useCreateEvent } from '../../evento/hooks/useCreateEvent';
import { useEditEvent } from '../../evento/hooks/useEditEvent';
import ActivityForm, { ActivityFormState } from '@/features/activities/components/ActivityForm';
import { Activity, ActivityGuest } from '@/types';
import { readGenerateCertificateFlag } from '@/types/activity';
import { resolveCertificateTemplateUrl } from '@/types/event';
import { eventService, type CertificateCustomizationDraftPayload } from '@/services/eventService';
import { extractApiErrorMessage } from '@/utils/apiError';
import { getBahiaDateInput, getBahiaTimeInput, toBahiaIso } from '@/utils/date';

type EventFormMode = 'create' | 'edit';

type ActivityItem = ActivityFormState & { id: string };

type FormState = {
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

type CertificateCustomizationState = {
  template: string | null;
  titulo: string;
  subtitulo: string;
  descricaoInicio: string;
  descricaoEvento: string;
  descricaoCargaHoraria: string;
};

type TouchedState = Record<keyof FormState, boolean>;

const STATUS_OPTIONS: { value: FormState['status']; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'iniciada', label: 'Iniciada' },
  { value: 'andamento', label: 'Em andamento' },
  { value: 'finalizada', label: 'Finalizada' },
];

const DEFAULT_FORM: FormState = {
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

const DEFAULT_CERTIFICATE_CUSTOMIZATION: CertificateCustomizationState = {
  template: null,
  titulo: '',
  subtitulo: '',
  descricaoInicio: '',
  descricaoEvento: '',
  descricaoCargaHoraria: '',
};

function FieldLabelWithHelp({ label, helpText }: { label: string; helpText: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography
        component="span"
        sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.primary }}
      >
        {label}
      </Typography>
      <Tooltip title={helpText} arrow placement="top">
        <IconButton
          size="small"
          aria-label={`Saiba mais sobre ${label}`}
          sx={{
            p: 0.25,
            color: colorTokens.neutral.gray500,
            '&:hover': {
              backgroundColor: 'rgba(15, 23, 42, 0.04)',
            },
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function createTouchedState(): TouchedState {
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

function getErrors(form: FormState, touched: TouchedState, isEdit: boolean) {
  return {
    nome:
      touched.nome && form.nome.trim().length < 3
        ? 'Informe um nome com pelo menos 3 caracteres.'
        : '',
    localizacao:
      touched.localizacao && form.localizacao.trim().length < 3 ? 'Informe o local do evento.' : '',
    responsavel:
      touched.responsavel && form.responsavel.trim().length < 3 ? 'Informe o responsável.' : '',
    descricao:
      touched.descricao && form.descricao.trim().length < 10 ? 'Descreva melhor o evento.' : '',
    startDate: (() => {
      if (touched.startDate && !form.startDate) return 'Selecione a data de início.';
      if (!isEdit && touched.startDate && form.startDate && form.startDate < getTodayString())
        return 'A data de início não pode ser no passado.';
      return '';
    })(),
    endDate: (() => {
      if (touched.endDate && !form.endDate) return 'Selecione a data de término.';
      if (!isEdit) {
        const todayStr = getTodayString();
        const minEndDate = form.startDate && form.startDate > todayStr ? form.startDate : todayStr;
        if (touched.endDate && form.endDate && form.endDate < minEndDate)
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

function toISODateTime(date: string, time: string): string {
  return toBahiaIso(date, time);
}

function getTodayString(): string {
  return getBahiaDateInput(new Date());
}

function formatDateBR(iso: string): string {
  if (!iso) return '--/--/----';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

interface EventFormProps {
  mode: EventFormMode;
  eventId?: number;
}

export default function EventForm({ mode, eventId }: EventFormProps) {
  const isEdit = mode === 'edit';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [touched, setTouched] = useState<TouchedState>(createTouchedState);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [showCertificateCustomization, setShowCertificateCustomization] = useState(false);
  const [certificateCustomizationCollapsed, setCertificateCustomizationCollapsed] = useState(false);
  const [certificateCustomization, setCertificateCustomization] =
    useState<CertificateCustomizationState>(DEFAULT_CERTIFICATE_CUSTOMIZATION);
  const [certificateCustomizationBeforeEdit, setCertificateCustomizationBeforeEdit] =
    useState<CertificateCustomizationState>(DEFAULT_CERTIFICATE_CUSTOMIZATION);
  const [certificateCustomizationSaved, setCertificateCustomizationSaved] = useState(false);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null);
  const [certificateCustomizationLoading, setCertificateCustomizationLoading] = useState(false);
  const [certificatePreviewLoading, setCertificatePreviewLoading] = useState(false);
  const [certificateCustomizationError, setCertificateCustomizationError] = useState('');
  const certificateCustomizationRequestRef = useRef(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  const { handleCreate, loading: createLoading, error: createError } = useCreateEvent();
  const {
    event: existingEvent,
    loadingEvent,
    loadError,
    handleUpdate,
    loading: updateLoading,
    error: updateError,
  } = useEditEvent(isEdit && eventId != null ? eventId : null);

  const isSubmitting = createLoading || updateLoading;
  const submitError = createError || updateError;
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

      const templateUrl = resolveCertificateTemplateUrl(existingEvent);
      const savedCustomization =
        existingEvent.certificadoPersonalizacao ?? existingEvent.certificateCustomization;
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
        template: savedCustomization?.template ?? templateUrl,
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

  const title = isEdit ? 'Edição de Evento' : 'Cadastrar Evento';
  const subtitle = isEdit
    ? 'Edite as informações do evento abaixo'
    : 'Preencha os dados abaixo para cadastrar um novo evento';
  const actionLabel = isEdit ? 'Salvar' : 'Cadastrar Evento';

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

  function buildCertificateCustomizationPayload(): CertificateCustomizationDraftPayload {
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
      template: certificateCustomization.template,
      textos: {
        titulo: certificateCustomization.titulo,
        subtitulo: certificateCustomization.subtitulo,
        descricaoInicio: certificateCustomization.descricaoInicio,
        descricaoEvento: certificateCustomization.descricaoEvento,
        descricaoCargaHoraria: certificateCustomization.descricaoCargaHoraria,
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
    setCertificateCustomizationCollapsed(false);
    setShowCertificateCustomization(true);
    setCertificateCustomizationError('');
    setCertificateCustomizationLoading(true);

    try {
      const defaultCustomization = await eventService.getDefaultCertificateCustomization(
        buildCertificateCustomizationPayload()
      );
      if (requestId !== certificateCustomizationRequestRef.current) return;

      const textos = defaultCustomization.textos ?? {};
      setCertificateCustomization((cur) => ({
        ...cur,
        template: defaultCustomization.templateUrl ?? cur.template,
        titulo: cur.titulo || textos.titulo || '',
        subtitulo: cur.subtitulo || textos.subtitulo || '',
        descricaoInicio: cur.descricaoInicio || textos.descricaoInicio || '',
        descricaoEvento: cur.descricaoEvento || textos.descricaoEvento || '',
        descricaoCargaHoraria: cur.descricaoCargaHoraria || textos.descricaoCargaHoraria || '',
      }));

      if (defaultCustomization.previewPdf) {
        setCertificatePreviewUrl((currentUrl) => {
          if (currentUrl) URL.revokeObjectURL(currentUrl);
          return URL.createObjectURL(defaultCustomization.previewPdf as Blob);
        });
      }
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

  function handleRemoveActivity(id: string) {
    setActivities((cur) => cur.filter((a) => a.id !== id));
  }

  if (isEdit && loadingEvent) {
    return <PageLoader sx={{ background: colorTokens.surface.background }} />;
  }

  if (isEdit && loadError) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          background: colorTokens.surface.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography color="error">{loadError}</Typography>
        <Button variant="outlined" component={Link} href="/home">
          Voltar ao início
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ minHeight: '100dvh', background: colorTokens.surface.background, overflowX: 'hidden' }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: 520, md: 980 },
            background: colorTokens.neutral.white,
            borderRadius: { xs: '28px', md: '24px' },
            boxShadow: '0 18px 40px rgba(25, 44, 72, 0.12)',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2.5, sm: 3, md: 3.5 },
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <IconButton
              component={Link}
              href="/home"
              aria-label="Voltar"
              sx={{ p: 0.5, color: colorTokens.text.primary }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Typography
              sx={{
                fontSize: { xs: 'clamp(18px, 5vw, 26px)', md: 30 },
                lineHeight: 1.1,
                fontWeight: 800,
                color: colorTokens.text.primary,
              }}
            >
              {title}
            </Typography>

            <Box sx={{ flex: 1, height: 1, background: colorTokens.neutral.gray300, ml: 1 }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 11, md: 13 },
              color: colorTokens.neutral.gray500,
              mb: { xs: 2.5, md: 3 },
            }}
          >
            {subtitle}
          </Typography>

          <Box sx={{ display: 'grid', gap: { xs: 1.75, md: 2.25 } }}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  fontWeight: 600,
                  color: colorTokens.text.primary,
                  mb: 0.75,
                }}
              >
                Dados do Evento
              </Typography>
              <Divider sx={{ borderColor: colorTokens.neutral.gray300, mb: 1.5 }} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              <Box sx={{ minWidth: 0, gridColumn: { xs: 'auto', md: 'span 2' } }}>
                <TextInput
                  label={
                    <FieldLabelWithHelp
                      label="Nome"
                      helpText="Nome oficial do evento exibido para participantes e na listagem geral."
                    />
                  }
                  value={form.nome}
                  onChange={(v) => updateField('nome', v)}
                  onBlur={() => markTouched('nome')}
                  error={Boolean(errors.nome)}
                  size="small"
                  fullWidth
                />
                {errors.nome ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.nome}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label={
                    <FieldLabelWithHelp
                      label="Local"
                      helpText="Local onde o evento acontecerá, como sala, campus, auditório ou endereço completo."
                    />
                  }
                  value={form.localizacao}
                  onChange={(v) => updateField('localizacao', v)}
                  onBlur={() => markTouched('localizacao')}
                  error={Boolean(errors.localizacao)}
                  size="small"
                  fullWidth
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
                {errors.localizacao ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.localizacao}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextInput
                  label={
                    <FieldLabelWithHelp
                      label="Responsável"
                      helpText="Pessoa ou equipe responsável pela organização, coordenação e comunicação do evento."
                    />
                  }
                  value={form.responsavel}
                  onChange={(v) => updateField('responsavel', v)}
                  onBlur={() => markTouched('responsavel')}
                  error={Boolean(errors.responsavel)}
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <BadgeOutlinedIcon
                            sx={{ fontSize: 18, color: colorTokens.neutral.gray500 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {errors.responsavel ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.responsavel}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ minWidth: 0, gridColumn: { xs: 'auto', md: 'span 2' } }}>
                <TextInput
                  label={
                    <FieldLabelWithHelp
                      label="Descrição do evento"
                      helpText="Resumo do evento, objetivo, público-alvo e qualquer informação importante para os participantes."
                    />
                  }
                  value={form.descricao}
                  onChange={(v) => updateField('descricao', v)}
                  onBlur={() => markTouched('descricao')}
                  error={Boolean(errors.descricao)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={3}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 0.5 }}>
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 18, color: colorTokens.neutral.gray500 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {errors.descricao ? (
                  <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                    {errors.descricao}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ minWidth: 0, gridColumn: { xs: 'auto', md: 'span 2' } }}>
                <ImageUpload
                  label={
                    <FieldLabelWithHelp
                      label="Imagem do Evento"
                      helpText="Imagem principal da capa do evento, usada na divulgação, visualização e identificação rápida do evento."
                    />
                  }
                  value={form.foto}
                  onChange={(value) => updateField('foto', value)}
                  onBlur={() => markTouched('foto')}
                  error={Boolean(errors.foto)}
                  helperText={errors.foto}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: { xs: 1.5, md: 2 },
                  gridColumn: { xs: 'auto', md: 'span 2' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label={
                      <FieldLabelWithHelp
                        label="Data de Início"
                        helpText="Data em que o evento começa e passa a ficar disponível para participantes."
                      />
                    }
                    value={form.startDate}
                    onChange={(v) => updateField('startDate', v)}
                    onBlur={() => markTouched('startDate')}
                    error={Boolean(errors.startDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        inputProps: startDateMin ? { min: startDateMin } : undefined,
                        endAdornment: <InputAdornment position="end" />,
                      },
                    }}
                  />
                  {errors.startDate ? (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.startDate}
                    </Typography>
                  ) : null}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label={
                      <FieldLabelWithHelp
                        label="Data de Término"
                        helpText="Data em que o evento encerra, definindo o período final de atividades e inscrições."
                      />
                    }
                    value={form.endDate}
                    onChange={(v) => updateField('endDate', v)}
                    onBlur={() => markTouched('endDate')}
                    error={Boolean(errors.endDate)}
                    size="small"
                    fullWidth
                    type="date"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        inputProps: endDateMin ? { min: endDateMin } : undefined,
                        endAdornment: <InputAdornment position="end" />,
                      },
                    }}
                  />
                  {errors.endDate ? (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.endDate}
                    </Typography>
                  ) : null}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label={
                      <FieldLabelWithHelp
                        label="Horário de Início"
                        helpText="Hora em que o evento ou a primeira atividade começa oficialmente."
                      />
                    }
                    value={form.startTime}
                    onChange={(v) => updateField('startTime', v)}
                    onBlur={() => markTouched('startTime')}
                    error={Boolean(errors.startTime)}
                    size="small"
                    fullWidth
                    type="time"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: { endAdornment: <InputAdornment position="end" /> },
                    }}
                  />
                  {errors.startTime ? (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.startTime}
                    </Typography>
                  ) : null}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label={
                      <FieldLabelWithHelp
                        label="Horário de Término"
                        helpText="Hora em que o evento ou a última atividade deve ser encerrada."
                      />
                    }
                    value={form.endTime}
                    onChange={(v) => updateField('endTime', v)}
                    onBlur={() => markTouched('endTime')}
                    error={Boolean(errors.endTime)}
                    size="small"
                    fullWidth
                    type="time"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: { endAdornment: <InputAdornment position="end" /> },
                    }}
                  />
                  {errors.endTime ? (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.endTime}
                    </Typography>
                  ) : null}
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 1.5, md: 2 },
                  gridColumn: { xs: 'auto', md: 'span 2' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <TextInput
                    label={
                      <FieldLabelWithHelp
                        label="Carga Horária (h)"
                        helpText="Tempo total estimado de duração do evento em horas, para fins de organização e registro."
                      />
                    }
                    value={form.cargaHoraria}
                    onChange={(v) => updateField('cargaHoraria', v)}
                    onBlur={() => markTouched('cargaHoraria')}
                    error={Boolean(errors.cargaHoraria)}
                    size="small"
                    fullWidth
                    type="number"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  {errors.cargaHoraria ? (
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>
                      {errors.cargaHoraria}
                    </Typography>
                  ) : null}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextField
                    select
                    label={
                      <FieldLabelWithHelp
                        label="Status"
                        helpText="Etapa atual do evento: pendente, iniciada, em andamento ou finalizada."
                      />
                    }
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value as FormState['status'])}
                    size="small"
                    fullWidth
                    disabled={!isEdit}
                    helperText={
                      !isEdit ? 'Definido automaticamente pela data de início' : undefined
                    }
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                pt: { xs: 1.5, md: 2 },
                display: 'grid',
                gap: 1.5,
                borderTop: `1px solid ${colorTokens.neutral.gray300}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Divider sx={{ borderColor: colorTokens.neutral.gray300, mb: 1.5 }} />
                  <WorkspacePremiumOutlinedIcon
                    sx={{ fontSize: 20, color: colorTokens.navigation.default }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, md: 13 },
                        fontWeight: 600,
                        color: colorTokens.text.primary,
                      }}
                    >
                      Certificado Personalizado
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                      Opcional - se não personalizar, utilizaremos o certificado padrão
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    gap: 1,
                    width: { xs: '100%', sm: 'auto' },
                    position: 'relative',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={
                      showCertificateCustomization
                        ? handleCancelCertificateCustomization
                        : handleOpenCertificateCustomization
                    }
                    disabled={
                      !showCertificateCustomization &&
                      (!canSubmit || certificateCustomizationLoading)
                    }
                    sx={{
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: { xs: 10, sm: 14 },
                      textTransform: 'none',
                    }}
                  >
                    {showCertificateCustomization
                      ? 'Cancelar personalização'
                      : certificateCustomizationLoading
                        ? 'Carregando...'
                        : 'Personalizar certificado'}
                  </Button>
                  {showCertificateCustomization ? (
                    <Tooltip
                      title={
                        certificateCustomizationCollapsed
                          ? 'Expandir personalização'
                          : 'Retrair personalização'
                      }
                      arrow
                    >
                      <IconButton
                        size="small"
                        aria-label={
                          certificateCustomizationCollapsed
                            ? 'Expandir personalização'
                            : 'Retrair personalização'
                        }
                        onClick={() =>
                          setCertificateCustomizationCollapsed((collapsed) => !collapsed)
                        }
                        sx={{
                          color: colorTokens.navigation.default,
                          position: { xs: 'absolute', sm: 'static' },
                          right: { xs: 0, sm: 'auto' },
                        }}
                      >
                        {certificateCustomizationCollapsed ? (
                          <ExpandMoreOutlinedIcon />
                        ) : (
                          <ExpandLessOutlinedIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Box>
              </Box>

              {showCertificateCustomization && !certificateCustomizationCollapsed ? (
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  <ImageUpload
                    label={
                      <FieldLabelWithHelp
                        label="Imagem do template"
                        helpText="Imagem opcional para personalizar o fundo do certificado."
                      />
                    }
                    value={certificateCustomization.template}
                    onChange={(value) => updateCertificateCustomization('template', value)}
                    accept="image/*"
                  />

                  <TextInput
                    label="Título"
                    value={certificateCustomization.titulo}
                    onChange={(value) => updateCertificateCustomization('titulo', value)}
                    size="small"
                    fullWidth
                  />

                  <TextInput
                    label="Subtítulo"
                    value={certificateCustomization.subtitulo}
                    onChange={(value) => updateCertificateCustomization('subtitulo', value)}
                    size="small"
                    fullWidth
                  />

                  <Box sx={{ display: 'grid', gap: 0.75 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 11, sm: 12 },
                        fontWeight: 600,
                        color: colorTokens.text.primary,
                      }}
                    >
                      Descrição
                    </Typography>
                    <TextInput
                      value={certificateCustomization.descricaoInicio}
                      onChange={(value) => updateCertificateCustomization('descricaoInicio', value)}
                      size="small"
                      fullWidth
                    />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        alignItems: 'center',
                        gap: 0.75,
                        width: 'fit-content',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: colorTokens.navigation.default,
                        }}
                      >
                        +
                      </Typography>
                      <Typography
                        sx={{
                          px: 1,
                          py: 0.75,
                          borderRadius: '6px',
                          bgcolor: colorTokens.surface.background,
                          fontSize: { xs: 10, sm: 12 },
                          color: colorTokens.text.primary,
                          minWidth: 0,
                          width: 'fit-content',
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                        }}
                      >
                        <Box component="span" sx={{ color: colorTokens.neutral.gray500 }}>
                          Nome do Evento:{' '}
                        </Box>
                        <Box component="span" sx={{ color: colorTokens.navigation.default }}>
                          {form.nome || 'nome do evento'}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          fontWeight: 700,
                          color: colorTokens.navigation.default,
                        }}
                      >
                        +
                      </Typography>
                    </Box>
                    <TextInput
                      value={certificateCustomization.descricaoEvento}
                      onChange={(value) => updateCertificateCustomization('descricaoEvento', value)}
                      size="small"
                      fullWidth={false}
                      sx={{ width: '100%' }}
                    />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        alignItems: 'center',
                        gap: 0.75,
                        width: 'fit-content',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          fontWeight: 700,
                          color: colorTokens.navigation.default,
                        }}
                      >
                        +
                      </Typography>
                      <Typography
                        sx={{
                          px: 1,
                          py: 0.75,
                          borderRadius: '6px',
                          bgcolor: colorTokens.surface.background,
                          fontSize: { xs: 10, sm: 12 },
                          color: colorTokens.text.primary,
                          minWidth: 0,
                          width: 'fit-content',
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                        }}
                      >
                        <Box component="span" sx={{ color: colorTokens.neutral.gray500 }}>
                          Carga Horária:{' '}
                        </Box>
                        <Box component="span" sx={{ color: colorTokens.navigation.default }}>
                          {form.cargaHoraria ? `${form.cargaHoraria} h` : 'carga horária'}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          fontWeight: 700,
                          color: colorTokens.navigation.default,
                        }}
                      >
                        +
                      </Typography>
                    </Box>
                    <TextInput
                      value={certificateCustomization.descricaoCargaHoraria}
                      onChange={(value) =>
                        updateCertificateCustomization('descricaoCargaHoraria', value)
                      }
                      size="small"
                      fullWidth={false}
                      sx={{ width: '100%' }}
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: '6px',
                      bgcolor: colorTokens.surface.background,
                      border: `1px solid ${colorTokens.neutral.gray300}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 10, sm: 11 },
                        color: colorTokens.neutral.gray500,
                        mb: 0.5,
                      }}
                    >
                      Visualização completa da descrição
                    </Typography>
                    <Typography
                      sx={{ fontSize: { xs: 11, sm: 12 }, color: colorTokens.text.primary }}
                    >
                      {certificateDescriptionPreview || 'A descrição aparecerá aqui.'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      minHeight: 220,
                      borderRadius: '8px',
                      border: `1px solid ${colorTokens.neutral.gray300}`,
                      overflow: 'hidden',
                      bgcolor: colorTokens.surface.background,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {certificatePreviewLoading || certificateCustomizationLoading ? (
                      <CircularProgress size={24} />
                    ) : certificatePreviewUrl ? (
                      <Box
                        component="iframe"
                        src={certificatePreviewUrl}
                        title="Pré-visualização do certificado"
                        sx={{ width: '100%', height: 360, border: 0, bgcolor: 'white' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.75,
                          color: colorTokens.neutral.gray500,
                        }}
                      >
                        <PictureAsPdfOutlinedIcon sx={{ fontSize: 36 }} />
                        <Typography sx={{ fontSize: 12 }}>Pré-visualização indisponível</Typography>
                      </Box>
                    )}
                  </Box>

                  {certificateCustomizationError ? (
                    <Typography sx={{ fontSize: 12, color: 'error.main', textAlign: 'center' }}>
                      {certificateCustomizationError}
                    </Typography>
                  ) : null}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      leftIcon={<PictureAsPdfOutlinedIcon sx={{ fontSize: 14 }} />}
                      onClick={handlePreviewCertificateCustomization}
                      disabled={!canSubmit || certificatePreviewLoading}
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: { xs: 10, sm: 14 },
                        textTransform: 'none',
                      }}
                    >
                      {certificatePreviewLoading
                        ? 'Gerando...'
                        : 'Pré-visualizar Meu Certificado Personalizado'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      leftIcon={<CloseOutlinedIcon sx={{ fontSize: 14 }} />}
                      onClick={handleCancelCertificateCustomization}
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: { xs: 10, sm: 14 },
                        textTransform: 'none',
                      }}
                    >
                      Cancelar Personalização
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      leftIcon={<SaveOutlinedIcon sx={{ fontSize: 14 }} />}
                      onClick={handleSaveCertificateCustomization}
                      disabled={!canSubmit}
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: { xs: 10, sm: 14 },
                        textTransform: 'none',
                      }}
                    >
                      {certificateCustomizationSaved
                        ? 'Personalização salva'
                        : 'Salvar personalização'}
                    </Button>
                    <Tooltip title="Retrair personalização" arrow>
                      <IconButton
                        size="small"
                        aria-label="Retrair personalização"
                        onClick={() => setCertificateCustomizationCollapsed(true)}
                        sx={{
                          color: colorTokens.navigation.default,
                          alignSelf: 'center',
                        }}
                      >
                        <ExpandLessOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : null}
            </Box>

            {/* ── Atividades ── */}
            <Box sx={{ pt: { xs: 1, md: 1.5 } }}>
              <Divider sx={{ borderColor: colorTokens.neutral.gray300, mb: 1.5 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 1.5,
                  px: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <ListAltOutlinedIcon
                    sx={{ fontSize: 20, color: colorTokens.navigation.default }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, md: 13 },
                        fontWeight: 600,
                        color: colorTokens.text.primary,
                        textAlign: 'left',
                      }}
                    >
                      Cadastrar Atividades
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                      Opcional - as atividades também podem ser cadastradas após a criação do evento
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  color="secondary"
                  leftIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
                  onClick={handleOpenNewActivity}
                  disabled={
                    !form.startDate ||
                    !form.endDate ||
                    !form.startTime ||
                    !form.endTime ||
                    !form.cargaHoraria
                  }
                  sx={{
                    minWidth: 0,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '6px',
                    fontSize: { xs: 11, md: 12 },
                    fontWeight: 700,
                    textTransform: 'none',
                    alignSelf: { xs: 'center', sm: 'auto' },
                  }}
                >
                  Cadastrar atividade
                </Button>
              </Box>

              {activities.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: colorTokens.neutral.gray500,
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  Nenhuma atividade cadastrada no momento
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 1.25 }}>
                  {activities.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        border: `1px solid ${colorTokens.neutral.gray300}`,
                        borderRadius: '6px',
                        boxShadow: '0 6px 14px rgba(25, 44, 72, 0.08)',
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
                          sx={{ fontSize: 14, color: colorTokens.text.primary, fontWeight: 600 }}
                        >
                          {activity.name || 'Sem nome'}
                          {activity.category ? (
                            <Typography
                              component="span"
                              sx={{
                                fontSize: 12,
                                fontWeight: 400,
                                color: colorTokens.neutral.gray500,
                                ml: 0.75,
                              }}
                            >
                              · {activity.category}
                            </Typography>
                          ) : null}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.25 }}>
                          {activity.startDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                              <EventOutlinedIcon
                                sx={{ fontSize: 13, color: colorTokens.neutral.gray500 }}
                              />
                              <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                                {formatDateBR(activity.startDate)}
                              </Typography>
                            </Box>
                          )}
                          {activity.startTime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                              <ScheduleOutlinedIcon
                                sx={{ fontSize: 13, color: colorTokens.neutral.gray500 }}
                              />
                              <Typography sx={{ fontSize: 11, color: colorTokens.neutral.gray500 }}>
                                {activity.startTime}
                                {activity.endTime ? ` – ${activity.endTime}` : ''}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          aria-label={`Editar ${activity.name}`}
                          onClick={() => handleOpenEditActivity(activity)}
                          sx={{ color: colorTokens.neutral.gray500 }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>

                        <IconButton
                          size="small"
                          aria-label={`Excluir ${activity.name}`}
                          onClick={() => handleRemoveActivity(activity.id)}
                          sx={{ color: colorTokens.neutral.gray500 }}
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {submitError && (
              <Typography sx={{ fontSize: 12, color: 'error.main', textAlign: 'center' }}>
                {submitError}
              </Typography>
            )}

            <Box
              sx={{ pt: 1.25, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                sx={{
                  minWidth: { xs: 118, md: 148 },
                  height: { xs: 34, md: 40 },
                  borderRadius: '6px',
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: colorTokens.navigation.default,
                  '&:hover': { backgroundColor: colorTokens.navigation.hover },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  actionLabel
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Drawer de Atividade ── */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            sx: {
              width: isMobile ? '100%' : 480,
              maxWidth: '100vw',
              height: isMobile ? '92dvh' : '100dvh',
              borderTopLeftRadius: isMobile ? 20 : 0,
              borderTopRightRadius: isMobile ? 20 : 0,
              background: colorTokens.neutral.white,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <ActivityForm
            mode={editingActivity ? 'edit' : 'create'}
            variant="embedded"
            eventInfo={activityEventInfo}
            eventDateRange={
              form.startDate && form.startTime && form.endDate && form.endTime
                ? {
                    start: `${form.startDate}T${form.startTime}`,
                    end: `${form.endDate}T${form.endTime}`,
                  }
                : undefined
            }
            maxWorkload={form.cargaHoraria ? Number(form.cargaHoraria) : undefined}
            initialValues={editingActivity ?? undefined}
            onSubmit={handleActivitySubmit}
            onCancel={handleCloseDrawer}
          />
        </Box>
      </Drawer>
    </Box>
  );
}
