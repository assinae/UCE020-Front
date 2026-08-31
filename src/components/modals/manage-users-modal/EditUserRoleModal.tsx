'use client';

import { useState } from 'react';
import type { StaffRole, GuestRole } from '@/types/management';

import ModalContainer from '@/components/modals/shared/ModalContainer';
import ModalHeader from '@/components/modals/shared/ModalHeader';
import ModalContent from '@/components/modals/shared/ModalContent';
import ModalFooter from '@/components/modals/shared/ModalFooter';
import { Button } from '@/components/ui/Button';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const USER_ROLES: StaffRole[] = ['Organizador', 'Monitor', 'Participante'];
export const GUEST_ROLES: GuestRole[] = ['Palestrante', 'Ministrante', 'Moderador'];

const USER_ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  Organizador: 'Coordena o evento, define a estrutura e gerencia a operação geral.',
  Monitor: 'Acompanha a dinâmica do evento, apoia participantes e valida presenças.',
  Participante: 'Participante/Ouvinte — acompanha o evento, assiste às atividades e recebe acesso ao conteúdo e certificados quando aplicável.',
};

const GUEST_ROLE_DESCRIPTIONS: Record<GuestRole, string> = {
  Palestrante: 'Apresenta o conteúdo, compartilha conhecimento e conduz a fala principal da atividade.',
  Ministrante: 'Lidera a atividade, orienta a prática e conduz a execução do conteúdo.',
  Moderador: 'Conduz a dinâmica da sessão, media perguntas e organiza a discussão entre os participantes.',
};

interface EditUserRoleModalProps<T extends string> {
  open: boolean;
  userName: string;
  currentRole: T;
  roles: T[];
  onClose: () => void;
  onConfirm: (newRole: T) => void;
}

export function EditUserRoleModal<T extends string>({
  open,
  userName,
  currentRole,
  roles,
  onClose,
  onConfirm,
}: EditUserRoleModalProps<T>) {
  const [selectedRole, setSelectedRole] = useState<T>(currentRole);

  const getRoleMeta = (role: T) => {
    if (role in USER_ROLE_DESCRIPTIONS) {
      return {
        label: role,
        description: USER_ROLE_DESCRIPTIONS[role as StaffRole],
      };
    }

    if (role in GUEST_ROLE_DESCRIPTIONS) {
      return {
        label: role,
        description: GUEST_ROLE_DESCRIPTIONS[role as GuestRole],
      };
    }

    return {
      label: role,
      description: 'Pessoa vinculada ao evento com papel específico na organização ou participação.',
    };
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <Box sx={{ pt: 1 }}>
        <ModalHeader title="Editar tipo de usuário" onClose={onClose} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 3, pb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Tipo de usuário
        </Typography>
        <Tooltip
          title="Define as permissões, acessos e visibilidade do usuário dentro do sistema."
          arrow
          placement="top"
        >
          <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary' }}>
            <InfoOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <ModalContent>
        <p className="mb-5 text-sm text-gray-500">
          Selecione o novo tipo para{' '}
          <span className="font-medium text-gray-700">{userName}</span>.{' '}
          <span className="text-gray-600">
            Convidado é a pessoa externa ao grupo principal do evento e pode atuar como palestrante, ministrante ou moderador.
          </span>
        </p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Tipo de usuário</legend>
          {roles.map((role) => {
            const meta = getRoleMeta(role);

            return (
              <label
                key={role}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  selectedRole === role
                    ? 'border-[#008963] bg-[#008963]/10 text-[#008963]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="user-role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="accent-[#008963] mt-1"
                />
                <span className="flex flex-col text-left">
                  <span className="text-sm font-medium">{meta.label}</span>
                  <span className="text-xs text-gray-500 leading-relaxed">{meta.description}</span>
                </span>
              </label>
            );
          })}
        </fieldset>
      </ModalContent>

      <ModalFooter>
        <Box sx={{ pb: 2 }}>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onConfirm(selectedRole)}
              disabled={selectedRole === currentRole}
              fullWidth
            >
              Salvar
            </Button>
          </div>
        </Box>
      </ModalFooter>
    </ModalContainer>
  );
}