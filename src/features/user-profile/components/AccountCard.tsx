'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { SkeletonBone } from '@/components/ui';
import { CERTIFICATE_TEXT_LIMITS } from '@/lib/certificateTextLimits';
import type { UserProfile } from '@/types/userProfile';
import { extractApiErrorMessage } from '@/utils/apiError';
import { PasswordEditor } from './PasswordEditor';
import { ProfileCard, ProfileCardHeader, profileDivider } from './ProfileCard';
import {
  ProfileFieldActions,
  ProfileFieldHint,
  ProfileFieldRow,
  ProfileInput,
} from './ProfileField';

type EditableRow = 'name' | 'email' | 'password';

const EMAIL_PATTERN = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const NAME_MIN_LENGTH = 2;

const FIELD_COPY = {
  name: {
    label: 'Nome completo',
    hint: 'Aparece nos certificados emitidos a partir de agora.',
    invalid: `Informe ao menos ${NAME_MIN_LENGTH} caracteres.`,
  },
  email: {
    label: 'E-mail',
    hint: 'Usado para login e envio dos certificados.',
    invalid: 'Informe um e-mail válido.',
  },
} as const;

function validate(row: 'name' | 'email', value: string): boolean {
  return row === 'name' ? value.length >= NAME_MIN_LENGTH : EMAIL_PATTERN.test(value);
}

interface AccountCardProps {
  user: UserProfile;
  onSaveProfile: (changes: { name?: string; email?: string }) => Promise<void>;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function AccountCard({ user, onSaveProfile, onChangePassword }: AccountCardProps) {
  const [editRow, setEditRow] = useState<EditableRow | null>(null);
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const openRow = (row: EditableRow) => {
    setEditRow(row);
    setDraft(row === 'name' ? user.name : row === 'email' ? user.email : '');
    setSubmitted(false);
    setApiError(null);
  };

  const closeRow = () => {
    setEditRow(null);
    setApiError(null);
  };

  const saveField = async (row: 'name' | 'email') => {
    const value = draft.trim();
    setSubmitted(true);
    setApiError(null);
    if (!validate(row, value)) return;
    if (value === (row === 'name' ? user.name : user.email)) {
      closeRow();
      return;
    }

    setSaving(true);
    try {
      await onSaveProfile(row === 'name' ? { name: value } : { email: value.toLowerCase() });
      closeRow();
    } catch (error) {
      setApiError(extractApiErrorMessage(error, 'Não foi possível salvar. Tente novamente.'));
    } finally {
      setSaving(false);
    }
  };

  const renderTextField = (row: 'name' | 'email') => {
    const copy = FIELD_COPY[row];
    const invalid = submitted && !validate(row, draft.trim());
    const message = apiError ?? (invalid ? copy.invalid : copy.hint);

    return (
      <ProfileFieldRow
        label={copy.label}
        value={row === 'name' ? user.name : user.email}
        editing={editRow === row}
        onEdit={() => openRow(row)}
        onSubmit={() => void saveField(row)}
      >
        <ProfileInput
          label={copy.label}
          type={row === 'email' ? 'email' : 'text'}
          value={draft}
          onChange={(value) => {
            setDraft(value);
            setApiError(null);
          }}
          autoFocus
          autoComplete={row === 'email' ? 'email' : 'name'}
          maxLength={row === 'name' ? CERTIFICATE_TEXT_LIMITS.nomeParticipante : undefined}
          invalid={invalid || !!apiError}
        />
        <ProfileFieldHint error={invalid || !!apiError}>{message}</ProfileFieldHint>
        <ProfileFieldActions submitLabel="Salvar" saving={saving} onCancel={closeRow} />
      </ProfileFieldRow>
    );
  };

  return (
    <ProfileCard delay={0.08}>
      <ProfileCardHeader
        icon={<PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />}
        title="Minha conta"
        subtitle="Toque em um campo para editar"
      />

      {renderTextField('name')}
      {renderTextField('email')}

      <ProfileFieldRow
        label="Senha"
        value={
          <Box component="span" sx={{ letterSpacing: '0.14em' }}>
            ••••••••
          </Box>
        }
        editing={editRow === 'password'}
        onEdit={() => openRow('password')}
      >
        <PasswordEditor onCancel={closeRow} onChangePassword={onChangePassword} onDone={closeRow} />
      </ProfileFieldRow>
    </ProfileCard>
  );
}

export function AccountCardSkeleton() {
  return (
    <ProfileCard delay={0.08}>
      <ProfileCardHeader
        icon={<PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />}
        title="Minha conta"
        subtitle="Toque em um campo para editar"
      />
      <Box role="status" aria-label="Carregando dados da conta">
        {[150, 210, 90].map((width) => (
          <Box
            key={width}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              px: 3,
              py: 2.25,
              borderTop: profileDivider,
            }}
          >
            <SkeletonBone sx={{ width: 90, height: 11 }} />
            <SkeletonBone sx={{ width, height: 16 }} />
          </Box>
        ))}
      </Box>
    </ProfileCard>
  );
}
