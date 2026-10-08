'use client';

import { useState, type FormEvent } from 'react';
import { Box, alpha } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { colorTokens } from '@/lib/colors';
import { extractApiErrorMessage } from '@/utils/apiError';
import { ProfileFieldActions, ProfileFieldHint, ProfileInput } from './ProfileField';

const PASSWORD_RULES = [
  { label: 'Mínimo de 8 caracteres', test: (value: string) => value.length >= 8 },
  { label: 'Uma letra maiúscula', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Uma letra minúscula', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Um número', test: (value: string) => /[0-9]/.test(value) },
  { label: 'Um caractere especial', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

function getFailedRules(newPassword: string, confirmation: string): string[] {
  const failed = PASSWORD_RULES.filter((rule) => !rule.test(newPassword)).map((rule) => rule.label);
  if (confirmation !== newPassword) failed.unshift('Confirmação igual à nova senha');
  return failed;
}

interface PasswordEditorProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onCancel: () => void;
  onDone: () => void;
}

export function PasswordEditor({ onChangePassword, onCancel, onDone }: PasswordEditorProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const failedRules = getFailedRules(newPassword, confirmation);
  const incomplete = !currentPassword || !newPassword || !confirmation;

  const withReset = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setApiError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (incomplete) return;
    setSubmitted(true);
    if (failedRules.length === 0) setConfirmOpen(true);
  };

  // O ConfirmModal fecha sozinho depois do onConfirm; o erro fica no painel,
  // que continua aberto para a pessoa corrigir a senha atual.
  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      onDone();
    } catch (error) {
      setApiError(extractApiErrorMessage(error, 'Não foi possível alterar a senha.'));
    } finally {
      setSaving(false);
    }
  };

  const showRules = submitted && failedRules.length > 0;

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.125 }}>
        <ProfileInput
          label="Senha atual"
          type="password"
          placeholder="Senha atual"
          autoComplete="current-password"
          autoFocus
          value={currentPassword}
          onChange={withReset(setCurrentPassword)}
          invalid={!!apiError}
        />
        <ProfileInput
          label="Nova senha"
          type="password"
          placeholder="Nova senha"
          autoComplete="new-password"
          value={newPassword}
          onChange={withReset(setNewPassword)}
        />
        <ProfileInput
          label="Confirmação de senha"
          type="password"
          placeholder="Confirmar nova senha"
          autoComplete="new-password"
          value={confirmation}
          onChange={withReset(setConfirmation)}
        />
      </Box>

      {showRules && (
        <Box
          component="ul"
          aria-label="Requisitos que faltam"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, m: 0, p: 0, listStyle: 'none' }}
        >
          {failedRules.map((label, index) => (
            <Box
              component="li"
              key={label}
              className="animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: `${index * 0.04}s`, animationDuration: '0.3s' }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                px: '13px',
                py: '7px',
                borderRadius: '999px',
                fontSize: 12,
                fontWeight: 600,
                bgcolor: colorTokens.surface.dangerSubtle,
                color: colorTokens.status.error,
                border: `1px solid ${alpha(colorTokens.status.error, 0.22)}`,
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 14 }} />
              {label}
            </Box>
          ))}
        </Box>
      )}

      {apiError && <ProfileFieldHint error>{apiError}</ProfileFieldHint>}

      <ProfileFieldActions
        submitLabel="Salvar senha"
        saving={saving}
        disabled={incomplete}
        onCancel={onCancel}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Você precisará usar a nova senha no próximo acesso."
        emphasisEndText="Deseja alterar sua senha?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        type="warning"
      />
    </Box>
  );
}
