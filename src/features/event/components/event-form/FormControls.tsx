'use client';

import { useId, type ReactNode } from 'react';
import {
  Box,
  ButtonBase,
  InputBase,
  NativeSelect,
  Tooltip,
  alpha,
  type SxProps,
  type Theme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { colorTokens } from '@/lib/colors';

const BORDER = alpha(colorTokens.navigation.default, 0.12);

export const fieldInputSx = {
  width: '100%',
  border: `1.5px solid ${BORDER}`,
  borderRadius: '16px',
  bgcolor: colorTokens.surface.field,
  color: colorTokens.text.heading,
  fontSize: 14.5,
  transition: 'border-color .18s ease, background .18s ease, box-shadow .18s ease',
  '& input, & textarea': { py: '14px', px: '18px', height: 'auto' },
  '& input[type="date"], & input[type="time"]': { py: '13px', px: '16px', fontSize: 14 },
  '&.Mui-focused': {
    borderColor: colorTokens.brand.secondary,
    bgcolor: colorTokens.neutral.white,
    boxShadow: `0 0 0 4px ${alpha(colorTokens.brand.secondary, 0.1)}`,
  },
  '&.Mui-error': { borderColor: colorTokens.status.error },
  '&.Mui-disabled': { bgcolor: colorTokens.surface.hover, color: colorTokens.text.label },
} as const;

export function HelpTip({ label, text }: { label: string; text: string }) {
  return (
    <Tooltip
      title={text}
      arrow
      placement="top-start"
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 'min(270px, 62vw)',
            px: '13px',
            py: '10px',
            borderRadius: '14px',
            bgcolor: colorTokens.navigation.default,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.5,
            boxShadow: `0 10px 26px ${alpha(colorTokens.navigation.default, 0.28)}`,
          },
        },
        arrow: { sx: { color: colorTokens.navigation.default } },
      }}
    >
      <ButtonBase
        aria-label={label}
        sx={{
          width: 26,
          height: 26,
          my: '-6px',
          borderRadius: '999px',
          color: colorTokens.text.icon,
          transition: 'background .18s ease, color .18s ease',
          '&:hover': { bgcolor: colorTokens.surface.mint, color: colorTokens.brand.secondary },
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
    </Tooltip>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  /** Texto à direita do rótulo, como contador de caracteres. */
  aside?: ReactNode;
  error?: string;
  hint?: ReactNode;
  sx?: SxProps<Theme>;
  children: (id: string) => ReactNode;
}

export function Field({
  label,
  required,
  optional,
  help,
  aside,
  error,
  hint,
  sx,
  children,
}: FieldProps) {
  const id = useId();

  return (
    <Box
      sx={[
        { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '7px' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box
            component="label"
            htmlFor={id}
            sx={{ fontSize: 12.5, fontWeight: 700, color: colorTokens.text.primary }}
          >
            {label}
            {required && (
              <Box component="span" aria-hidden sx={{ color: colorTokens.status.error, ml: '4px' }}>
                *
              </Box>
            )}
            {optional && (
              <Box component="span" sx={{ fontWeight: 500, color: colorTokens.text.label }}>
                {' '}
                · opcional
              </Box>
            )}
          </Box>
          {help && <HelpTip label={`Ajuda sobre ${label.toLowerCase()}`} text={help} />}
        </Box>
        {aside}
      </Box>
      {children(id)}
      {error ? (
        <Box
          component="span"
          role="alert"
          sx={{ fontSize: 12, fontWeight: 600, color: colorTokens.status.error }}
        >
          {error}
        </Box>
      ) : hint ? (
        <Box component="span" sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.label }}>
          {hint}
        </Box>
      ) : null}
    </Box>
  );
}

export function CharCount({ value, max }: { value: number; max: number }) {
  return (
    <Box
      component="span"
      sx={{
        fontSize: 12.5,
        fontWeight: 600,
        color: value > max ? colorTokens.status.error : colorTokens.text.label,
      }}
    >
      {value}/{max}
    </Box>
  );
}

interface TextControlProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'number' | 'date' | 'time';
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  inputProps?: Record<string, unknown>;
}

export function TextControl({
  id,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  error,
  disabled,
  multiline,
  rows = 4,
  inputProps,
}: TextControlProps) {
  return (
    <InputBase
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      type={type}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      multiline={multiline}
      minRows={multiline ? rows : undefined}
      inputProps={{ 'aria-invalid': error || undefined, ...inputProps }}
      sx={[fieldInputSx, multiline ? { '& textarea': { resize: 'vertical' } } : {}]}
    />
  );
}

interface SelectControlProps<T extends string> {
  id: string;
  value: T;
  options: readonly { value: T | string; label: string }[];
  onChange: (value: T) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export function SelectControl<T extends string>({
  id,
  value,
  options,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled,
}: SelectControlProps<T>) {
  return (
    <NativeSelect
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      onBlur={onBlur}
      error={error}
      disabled={disabled}
      IconComponent={ExpandMoreRoundedIcon}
      input={<InputBase />}
      inputProps={{ 'aria-invalid': error || undefined }}
      sx={[
        fieldInputSx,
        {
          '& select': {
            py: '14px',
            pl: '18px',
            pr: '44px !important',
            borderRadius: '16px',
            color: value ? colorTokens.text.heading : colorTokens.text.placeholder,
          },
          '& select:focus': { bgcolor: 'transparent' },
          '& .MuiNativeSelect-icon': { right: 14, fontSize: 20, color: colorTokens.text.label },
        },
      ]}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        aria-hidden
        sx={{ width: 5, height: 20, borderRadius: '999px', bgcolor: colorTokens.brand.secondary }}
      />
      <Box
        component="h2"
        sx={{
          m: 0,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: colorTokens.text.heading,
        }}
      >
        {children}
      </Box>
      <Box
        aria-hidden
        sx={{ flex: 1, height: '1px', bgcolor: alpha(colorTokens.navigation.default, 0.08) }}
      />
    </Box>
  );
}

const pillBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '9px',
  minHeight: 47,
  px: 3,
  borderRadius: '999px',
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  transition:
    'transform .28s cubic-bezier(.34,1.2,.64,1), background .18s ease, border-color .18s ease, color .18s ease, opacity .18s ease',
  '&.Mui-disabled': { opacity: 0.5 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} as const;

type PillTone = 'primary' | 'navy' | 'outline' | 'ghost';

const PILL_TONES: Record<PillTone, object> = {
  primary: {
    bgcolor: colorTokens.brand.secondary,
    color: colorTokens.neutral.white,
    '&:hover': { bgcolor: colorTokens.brand.secondaryDark, transform: 'translateY(-2px)' },
  },
  navy: {
    bgcolor: colorTokens.navigation.default,
    color: colorTokens.neutral.white,
    '&:hover': { bgcolor: colorTokens.navigation.hover, transform: 'translateY(-2px)' },
  },
  outline: {
    border: `1.5px solid ${colorTokens.brand.secondary}`,
    bgcolor: colorTokens.neutral.white,
    color: colorTokens.brand.secondary,
    '&:hover': { bgcolor: colorTokens.surface.mint, transform: 'translateY(-2px)' },
  },
  ghost: {
    border: `1.5px solid ${alpha(colorTokens.navigation.default, 0.14)}`,
    bgcolor: 'transparent',
    color: colorTokens.text.muted,
    fontWeight: 600,
    '&:hover': {
      borderColor: colorTokens.navigation.default,
      color: colorTokens.navigation.default,
    },
  },
};

interface PillButtonProps {
  tone?: PillTone;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  busy?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
  children: ReactNode;
}

export function PillButton({
  tone = 'primary',
  onClick,
  type = 'button',
  disabled,
  busy,
  startIcon,
  endIcon,
  sx,
  children,
}: PillButtonProps) {
  return (
    <ButtonBase
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      sx={[pillBase, PILL_TONES[tone], ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonBase>
  );
}
