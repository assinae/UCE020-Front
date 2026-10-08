'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Box, ButtonBase, CircularProgress, Collapse, InputBase, alpha } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { colorTokens } from '@/lib/colors';
import { fieldLabelSx, profileDivider } from './ProfileCard';

interface ProfileFieldRowProps {
  label: string;
  value: ReactNode;
  editing: boolean;
  onEdit: () => void;
  /** Sem `onSubmit`, o conteúdo do painel monta o próprio formulário. */
  onSubmit?: () => void;
  children: ReactNode;
}

export function ProfileFieldRow({
  label,
  value,
  editing,
  onEdit,
  onSubmit,
  children,
}: ProfileFieldRowProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <Box sx={{ borderTop: profileDivider }}>
      <Collapse in={!editing} timeout={260}>
        <ButtonBase
          onClick={onEdit}
          aria-label={`Editar ${label.toLowerCase()}`}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            px: 3,
            py: 2,
            textAlign: 'left',
            transition: 'background .18s ease',
            '&:hover': { bgcolor: colorTokens.surface.muted },
            '&:hover .profile-field-pencil': { color: colorTokens.brand.secondary },
          }}
        >
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <Box component="span" sx={fieldLabelSx}>
              {label}
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 14.5,
                fontWeight: 700,
                color: colorTokens.text.heading,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </Box>
          </Box>
          <EditOutlinedIcon
            className="profile-field-pencil"
            sx={{
              fontSize: 18,
              flexShrink: 0,
              color: colorTokens.text.label,
              transition: 'color .18s ease',
            }}
          />
        </ButtonBase>
      </Collapse>

      <Collapse in={editing} timeout={300} unmountOnExit>
        <Box
          component={onSubmit ? 'form' : 'div'}
          noValidate={onSubmit ? true : undefined}
          onSubmit={onSubmit ? handleSubmit : undefined}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            p: '16px 24px 18px',
            bgcolor: colorTokens.surface.rowHover,
          }}
        >
          <Box component="span" sx={{ ...fieldLabelSx, color: colorTokens.brand.secondary }}>
            {label} · editando
          </Box>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

interface ProfileInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  invalid?: boolean;
}

export function ProfileInput({
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  autoFocus,
  maxLength,
  invalid,
}: ProfileInputProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const borderColor = invalid ? colorTokens.status.error : colorTokens.brand.secondary;

  return (
    <InputBase
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={isPassword && revealed ? 'text' : type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      inputProps={{ 'aria-label': label, 'aria-invalid': invalid || undefined, maxLength }}
      endAdornment={
        isPassword ? (
          <ButtonBase
            onClick={() => setRevealed((current) => !current)}
            aria-label={`${revealed ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
            sx={{
              width: 34,
              height: 34,
              mr: 1,
              flexShrink: 0,
              borderRadius: '999px',
              color: colorTokens.text.label,
              transition: 'background .18s ease, color .18s ease',
              '&:hover': { bgcolor: colorTokens.surface.mint, color: colorTokens.brand.secondary },
            }}
          >
            {revealed ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </ButtonBase>
        ) : undefined
      }
      sx={{
        width: '100%',
        border: `1.5px solid ${borderColor}`,
        borderRadius: '14px',
        bgcolor: colorTokens.neutral.white,
        color: colorTokens.text.heading,
        fontSize: 14.5,
        transition: 'border-color .18s ease, box-shadow .18s ease',
        '&.Mui-focused': { boxShadow: `0 0 0 4px ${alpha(borderColor, 0.12)}` },
        '& input': { py: '13px', px: 2, height: 'auto' },
      }}
    />
  );
}

export function ProfileFieldHint({ children, error }: { children: ReactNode; error?: boolean }) {
  return (
    <Box
      component="span"
      role={error ? 'alert' : undefined}
      sx={{
        fontSize: 12,
        fontWeight: error ? 600 : 500,
        color: error ? colorTokens.status.error : colorTokens.text.muted,
      }}
    >
      {children}
    </Box>
  );
}

interface ProfileFieldActionsProps {
  submitLabel: string;
  saving: boolean;
  disabled?: boolean;
  onCancel: () => void;
}

export function ProfileFieldActions({
  submitLabel,
  saving,
  disabled,
  onCancel,
}: ProfileFieldActionsProps) {
  const pill = {
    py: '11px',
    borderRadius: '999px',
    fontSize: 13,
    fontWeight: 700,
    transition: 'background .18s ease, border-color .18s ease, opacity .18s ease',
  } as const;

  return (
    <Box sx={{ display: 'flex', gap: 1.125, pt: '2px' }}>
      <ButtonBase
        type="submit"
        disabled={saving || disabled}
        aria-busy={saving}
        sx={{
          ...pill,
          gap: 1,
          px: '22px',
          bgcolor: colorTokens.brand.secondary,
          color: colorTokens.neutral.white,
          '&:hover': { bgcolor: colorTokens.brand.secondaryDark },
          '&.Mui-disabled': { opacity: saving ? 0.85 : 0.5 },
        }}
      >
        {saving && <CircularProgress size={14} thickness={5} sx={{ color: 'inherit' }} />}
        {saving ? 'Salvando...' : submitLabel}
      </ButtonBase>
      <ButtonBase
        onClick={onCancel}
        disabled={saving}
        sx={{
          ...pill,
          px: '18px',
          border: `1.5px solid ${alpha(colorTokens.navigation.default, 0.12)}`,
          bgcolor: colorTokens.neutral.white,
          color: colorTokens.text.heading,
          '&:hover': { borderColor: colorTokens.text.heading },
        }}
      >
        Cancelar
      </ButtonBase>
    </Box>
  );
}
