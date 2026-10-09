'use client';

import { useState } from 'react';
import { Box, Collapse, alpha, useMediaQuery, useTheme } from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { CERTIFICATE_TEXT_LIMITS } from '@/lib/certificateTextLimits';
import { colorTokens } from '@/lib/colors';
import type { EventFormCertificate } from '../../hooks/useEventForm';
import type { CertificateCustomizationState } from '../../utils/eventFormRules';
import { CertificatePreview } from './CertificatePreview';
import { CharCount, Field, PillButton, SectionTitle, TextControl } from './FormControls';
import { FormSheet, SheetActions } from './FormSheet';
import { ImagePickerField } from './ImagePickerField';

type DescriptionPart = 'descricaoInicio' | 'descricaoEvento' | 'descricaoCargaHoraria';
const DESCRIPTION_PARTS: DescriptionPart[] = [
  'descricaoInicio',
  'descricaoEvento',
  'descricaoCargaHoraria',
];

function remainingFor(values: CertificateCustomizationState, part: DescriptionPart): number {
  const others = DESCRIPTION_PARTS.filter((key) => key !== part).reduce(
    (total, key) => total + values[key].length,
    0
  );
  return Math.max(0, CERTIFICATE_TEXT_LIMITS.descricaoTotal - others);
}

function TokenChip({ label, value }: { label: string; value: string }) {
  return (
    <Box
      component="span"
      sx={{
        alignSelf: 'flex-start',
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        px: 1.75,
        py: '7px',
        borderRadius: '999px',
        bgcolor: colorTokens.surface.hover,
        fontSize: 12.5,
        fontWeight: 600,
        color: colorTokens.text.muted,
        maxWidth: '100%',
      }}
    >
      {label}
      <Box
        component="span"
        sx={{ fontWeight: 700, color: colorTokens.text.heading, overflowWrap: 'anywhere' }}
      >
        {value}
      </Box>
    </Box>
  );
}

interface EditorProps {
  certificate: EventFormCertificate;
  eventName: string;
  workload: string;
  canPreview: boolean;
}

function CertificateEditor({ certificate, eventName, workload, canPreview }: EditorProps) {
  const { values, update } = certificate;

  const descriptionInput = (part: DescriptionPart, label: string) => (
    <TextControl
      id={`certificado-${part}`}
      value={values[part]}
      onChange={(value) => update(part, value)}
      inputProps={{ maxLength: remainingFor(values, part), 'aria-label': label }}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Field
        label="Imagem do template"
        optional
        help="Imagem opcional para personalizar o fundo do certificado."
        hint="JPG, PNG ou WEBP até 3 MB."
      >
        {(id) => (
          <ImagePickerField
            id={id}
            value={values.template}
            onChange={(value) => update('template', value)}
            emptyLabel="Nenhuma imagem selecionada"
          />
        )}
      </Field>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 2.25,
        }}
      >
        <Field
          label="Título"
          aside={<CharCount value={values.titulo.length} max={CERTIFICATE_TEXT_LIMITS.titulo} />}
        >
          {(id) => (
            <TextControl
              id={id}
              value={values.titulo}
              onChange={(value) => update('titulo', value)}
              inputProps={{ maxLength: CERTIFICATE_TEXT_LIMITS.titulo }}
            />
          )}
        </Field>
        <Field
          label="Subtítulo"
          aside={
            <CharCount value={values.subtitulo.length} max={CERTIFICATE_TEXT_LIMITS.subtitulo} />
          }
        >
          {(id) => (
            <TextControl
              id={id}
              value={values.subtitulo}
              onChange={(value) => update('subtitulo', value)}
              inputProps={{ maxLength: CERTIFICATE_TEXT_LIMITS.subtitulo }}
            />
          )}
        </Field>
      </Box>

      <Box
        component="fieldset"
        sx={{ m: 0, p: 0, border: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25 }}
        >
          <Box
            component="legend"
            sx={{ p: 0, fontSize: 12.5, fontWeight: 700, color: colorTokens.text.primary }}
          >
            Descrição
          </Box>
          <CharCount
            value={certificate.descriptionLength}
            max={CERTIFICATE_TEXT_LIMITS.descricaoTotal}
          />
        </Box>
        {descriptionInput('descricaoInicio', 'Início da descrição')}
        <TokenChip label="Nome do evento" value={eventName || 'nome do evento'} />
        {descriptionInput('descricaoEvento', 'Texto depois do nome do evento')}
        <TokenChip label="Carga horária" value={workload ? `${workload} h` : 'carga horária'} />
        {descriptionInput('descricaoCargaHoraria', 'Texto depois da carga horária')}
        {certificate.textError && (
          <Box
            component="span"
            role="alert"
            sx={{ fontSize: 12, fontWeight: 600, color: colorTokens.status.error }}
          >
            {certificate.textError}
          </Box>
        )}
        <Box
          sx={{
            p: '16px 18px',
            borderRadius: '18px',
            bgcolor: colorTokens.surface.panel,
            border: `1px solid ${alpha(colorTokens.navigation.default, 0.05)}`,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'block',
              mb: '5px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: colorTokens.text.label,
            }}
          >
            Visualização da descrição
          </Box>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontSize: 14,
              lineHeight: 1.6,
              color: colorTokens.text.heading,
            }}
          >
            {certificate.descriptionPreview || 'A descrição aparecerá aqui.'}
          </Box>
        </Box>
      </Box>

      <CertificatePreview
        url={certificate.previewUrl}
        loading={certificate.previewLoading || certificate.loading}
        error={certificate.error}
        canRefresh={canPreview}
        onRefresh={certificate.refreshPreview}
      />
    </Box>
  );
}

interface CertificateSectionProps {
  certificate: EventFormCertificate;
  eventName: string;
  workload: string;
  /** Os dados obrigatórios do evento precisam estar válidos para gerar a prévia. */
  ready: boolean;
  onSaved: () => void;
}

export function CertificateSection({
  certificate,
  eventName,
  workload,
  ready,
  onSaved,
}: CertificateSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sheetOpen, setSheetOpen] = useState(false);

  const subtitle = certificate.saved
    ? 'Personalização salva. Ela vai junto quando você salvar o evento.'
    : ready
      ? 'Opcional — sem personalizar, usamos o certificado padrão.'
      : 'Preencha os dados obrigatórios do evento para personalizar o certificado.';

  const openOnMobile = () => {
    if (certificate.open) certificate.resume();
    else void certificate.openEditor();
    setSheetOpen(true);
  };

  const toggleOnDesktop = () => {
    if (certificate.open) certificate.cancel();
    else void certificate.openEditor();
  };

  const save = () => {
    certificate.save();
    setSheetOpen(false);
    onSaved();
  };

  const discardOnMobile = () => {
    certificate.discard();
    setSheetOpen(false);
  };

  const desktopOpen = certificate.open && !isMobile;
  const buttonLabel = isMobile
    ? certificate.saved
      ? 'Editar personalização'
      : 'Personalizar certificado'
    : certificate.open
      ? 'Cancelar personalização'
      : 'Personalizar certificado';

  const editor = (
    <CertificateEditor
      certificate={certificate}
      eventName={eventName}
      workload={workload}
      canPreview={ready}
    />
  );

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SectionTitle>Certificado</SectionTitle>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 2.25 },
          p: { xs: 2.5, md: '20px 24px' },
          borderRadius: '24px',
          bgcolor: colorTokens.surface.panel,
          border: `1px solid ${alpha(colorTokens.navigation.default, 0.05)}`,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box
            aria-hidden
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              bgcolor: colorTokens.surface.mint,
              color: colorTokens.brand.secondary,
            }}
          >
            {certificate.saved ? <CheckRoundedIcon /> : <WorkspacePremiumOutlinedIcon />}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box
              component="span"
              sx={{
                display: 'block',
                fontSize: 15,
                fontWeight: 700,
                color: colorTokens.text.heading,
              }}
            >
              Certificado personalizado
            </Box>
            <Box
              component="span"
              sx={{ display: 'block', mt: '3px', fontSize: 13, color: colorTokens.text.muted }}
            >
              {subtitle}
            </Box>
          </Box>
        </Box>
        <PillButton
          tone="outline"
          onClick={isMobile ? openOnMobile : toggleOnDesktop}
          disabled={!ready && !certificate.open}
          busy={certificate.loading && !certificate.open}
          endIcon={
            isMobile ? undefined : (
              <ExpandMoreRoundedIcon
                sx={{
                  fontSize: 20,
                  transform: desktopOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform .25s ease',
                }}
              />
            )
          }
          sx={{ width: { xs: '100%', md: 250 }, flexShrink: 0 }}
        >
          {buttonLabel}
        </PillButton>
      </Box>

      <Collapse in={desktopOpen} timeout={350} unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            p: 3.25,
            borderRadius: '24px',
            bgcolor: colorTokens.neutral.white,
            border: `1.5px solid ${alpha(colorTokens.brand.secondary, 0.22)}`,
            boxShadow: `0 10px 30px ${alpha(colorTokens.shadow.ink, 0.07)}`,
          }}
        >
          {editor}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: 1.5,
              pt: 2.25,
              borderTop: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
            }}
          >
            <PillButton
              tone="ghost"
              onClick={certificate.cancel}
              startIcon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                '&:hover': {
                  borderColor: colorTokens.status.error,
                  color: colorTokens.status.error,
                },
              }}
            >
              Cancelar personalização
            </PillButton>
            <PillButton
              onClick={save}
              disabled={!ready || !!certificate.textError}
              startIcon={<CheckRoundedIcon sx={{ fontSize: 18 }} />}
            >
              {certificate.saved ? 'Personalização salva' : 'Salvar personalização'}
            </PillButton>
          </Box>
        </Box>
      </Collapse>

      {isMobile && (
        <FormSheet
          open={sheetOpen}
          onClose={discardOnMobile}
          eyebrow="Certificado"
          title="Personalizar"
          footer={
            <SheetActions
              submitLabel="Salvar personalização"
              onSubmit={save}
              onCancel={discardOnMobile}
              disabled={!ready || !!certificate.textError}
            />
          }
        >
          {editor}
        </FormSheet>
      )}
    </Box>
  );
}
