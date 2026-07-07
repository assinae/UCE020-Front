'use client';

import { Box, Typography, Collapse, Stack, Divider, IconButton } from '@mui/material';
import { useState, useMemo } from 'react';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import TextInput from '@/components/ui/inputs/TextInput';
import { Button } from '@/components/ui/Button';
import type { UserProfile } from '@/types/userProfile';

interface ProfileFormProps {
  user: UserProfile;
  onSave: (userData: UserProfile) => void;
  isEditing: boolean;
  onEditChange: (isEditing: boolean) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void> | void;
}

// ── Requisitos de senha ──────────────────────────────────
const SECURITY_RULES = [
  { label: 'Mínimo de 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Pelo menos uma letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Pelo menos uma letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Pelo menos um número', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Pelo menos um caractere especial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function ProfileForm({ user, onSave, isEditing, onEditChange, onChangePassword }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(user);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const ruleResults = useMemo(
    () => SECURITY_RULES.map((rule) => ({ ...rule, passed: rule.test(newPassword) })),
    [newPassword]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartEditing = () => onEditChange(true);

  const handleSave = () => {
    onSave(formData);
    onEditChange(false);
  };

  const handleCancel = () => {
    setFormData(user);
    onEditChange(false);
  };

  const resetPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleOpenPasswordSection = () => {
    resetPasswordFields();
    setPasswordSuccess(false);
    setIsChangingPassword(true);
  };

  const handleCancelPasswordSection = () => {
    resetPasswordFields();
    setIsChangingPassword(false);
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Preencha todos os campos.');
      return;
    }
    if (!allRulesPassed) {
      setPasswordError('A nova senha não atende a todos os requisitos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setPasswordError(null);
    try {
      await onChangePassword?.(currentPassword, newPassword);
      setPasswordSuccess(true);
      resetPasswordFields();
      setIsChangingPassword(false);
    } catch {
      setPasswordError('Não foi possível alterar a senha. Verifique a senha atual.');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '20px',
        border: '1px solid rgba(15, 29, 53, 0.04)',
        boxShadow: '0 6px 16px rgba(15, 29, 53, 0.08)',
      }}
    >
      <Box sx={{ p: 3, borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        {/* ── Informações Pessoais ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #101828 0%, #1A2744 100%)',
              boxShadow: '0 6px 14px rgba(16, 24, 40, 0.25)',
              flexShrink: 0,
            }}
          >
            <PersonOutlineRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#0D1E3B', fontSize: '1.05rem', flexGrow: 1 }}
          >
            Informações Pessoais
          </Typography>

          {!isEditing && (
            <IconButton
              onClick={handleStartEditing}
              aria-label="Editar informações pessoais"
              size="small"
              sx={{
                bgcolor: 'rgba(15, 29, 53, 0.05)',
                '&:hover': { bgcolor: 'rgba(15, 29, 53, 0.1)' },
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 18, color: '#0D1E3B' }} />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ mb: 2.5 }}>
            <TextInput
              label="Nome Completo"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              disabled={!isEditing}
              placeholder="Seu nome"
            />
          </Box>
          <Box sx={{ mb: 0.5 }}>
            <TextInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              disabled={!isEditing}
              placeholder="seu@email.com"
            />
          </Box>
          {/* <Box>
            <PasswordInput
              label="Senha"
              value={formData.password || ''}
              onChange={(value) => handleInputChange('password', value)}
              disabled={!isEditing}
              showVisibilityToggle
            />
          </Box> */}
        </Box>
      </Box>

      {isEditing && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            p: 3,
            bgcolor: 'rgba(26, 39, 68, 0.02)',
            borderTop: '1px solid rgba(26, 39, 68, 0.08)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          <Button variant="outlined" onClick={handleCancel} color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} color="primary">
            Salvar Alterações
          </Button>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(15, 29, 53, 0.08)' }} />

      {/* ── Alterar Senha ── */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: isChangingPassword ? 3 : 0,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #101828 0%, #1A2744 100%)',
              boxShadow: '0 6px 14px rgba(16, 24, 40, 0.25)',
              flexShrink: 0,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#0D1E3B', fontSize: '1.05rem', flexGrow: 1 }}
          >
            Alterar Senha
          </Typography>

          {!isChangingPassword && (
            <Button variant="text" color="secondary" onClick={handleOpenPasswordSection}>
              Alterar
            </Button>
          )}
        </Box>

        {passwordSuccess && !isChangingPassword && (
          <Typography variant="body2" sx={{ color: '#2E7D32', mt: 1 }}>
            Senha alterada com sucesso.
          </Typography>
        )}

        <Collapse in={isChangingPassword}>
          <Box sx={{ mb: 2.5 }}>
            <TextInput
              label="Senha Atual"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Digite sua senha atual"
            />
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <TextInput
              label="Nova Senha"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Crie uma nova senha"
            />
          </Box>

          <Stack spacing={0.5} sx={{ mb: 2.5, pl: 0.5 }}>
            {ruleResults.map((rule) => (
              <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {rule.passed ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                ) : (
                  <CancelRoundedIcon sx={{ fontSize: 16, color: 'rgba(15, 29, 53, 0.25)' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: rule.passed ? '#2E7D32' : 'rgba(15, 29, 53, 0.5)',
                    fontWeight: rule.passed ? 600 : 400,
                  }}
                >
                  {rule.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ mb: 1 }}>
            <TextInput
              label="Confirmar Nova Senha"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repita a nova senha"
            />
          </Box>

          {passwordError && (
            <Typography variant="caption" sx={{ color: '#D32F2F' }}>
              {passwordError}
            </Typography>
          )}
        </Collapse>
      </Box>

      {isChangingPassword && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            p: 3,
            bgcolor: 'rgba(26, 39, 68, 0.02)',
            borderTop: '1px solid rgba(26, 39, 68, 0.08)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          <Button variant="outlined" onClick={handleCancelPasswordSection} color="secondary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePassword}
            color="primary"
            disabled={!allRulesPassed || newPassword !== confirmPassword || !currentPassword}
          >
            Salvar Nova Senha
          </Button>
        </Box>
      )}
    </Box>
  );
}
