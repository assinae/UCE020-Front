'use client';

import { useState } from 'react';
import type { StaffRole, GuestRole } from '@/types/management';

import ModalContainer from '@/components/modals/shared/ModalContainer';
import ModalHeader from '@/components/modals/shared/ModalHeader';
import ModalContent from '@/components/modals/shared/ModalContent';
import ModalFooter from '@/components/modals/shared/ModalFooter';
import { Button } from '@/components/ui/Button';
import { Box } from '@mui/material';

export const USER_ROLES: StaffRole[] = ['Organizador', 'Monitor', 'Participante'];
export const GUEST_ROLES: GuestRole[] = ['Palestrante', 'Ministrante'];

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

  return (
    <ModalContainer open={open} onClose={onClose}>
      <Box sx={{ pt: 1 }}>
        <ModalHeader title="Editar tipo de usuário" onClose={onClose} />
      </Box>

      <ModalContent>
        <p className="mb-5 text-sm text-gray-500">
          Selecione o novo tipo para{' '}
          <span className="font-medium text-gray-700">{userName}</span>.
        </p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Tipo de usuário</legend>
          {roles.map((role) => (
            <label
              key={role}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                selectedRole === role
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="user-role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="accent-indigo-600"
              />
              <span className="text-sm font-medium">{role}</span>
            </label>
          ))}
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